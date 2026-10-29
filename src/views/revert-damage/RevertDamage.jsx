// import React, { useEffect, useState } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Ban,
//   CheckCircle2,
//   Eye,
//   FileWarning,
//   LoaderCircle,
//   RefreshCcw,
//   RotateCcw,
//   Search,
//   X,
//   ZoomOut,
// } from 'lucide-react';
// import { useLocation } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import Pagination from '../../utils/Pagination';
// import SearchCenterStock from '../Report/SearchCenterStock';

// const RevertDamage = () => {
//   const [data, setData] = useState([]);
//   const [flattenedData, setFlattenedData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     usageType: 'Damage',
//     status: 'completed',
//     createdBy: '',
//     startDate: '',
//     endDate: '',
//   });

//   const [serialModalVisible, setSerialModalVisible] =
//     useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedSerials, setSelectedSerials] = useState([]);

//   const [revertModalVisible, setRevertModalVisible] =
//     useState(false);
//   const [itemToRevert, setItemToRevert] = useState(null);

//   const [revertLoading, setRevertLoading] =
//     useState(false);
//   const [revertSuccess, setRevertSuccess] =
//     useState(null);
//   const [revertError, setRevertError] =
//     useState(null);
//   const [revertRemark, setRevertRemark] =
//     useState('');

//   const [eligibilityCheck, setEligibilityCheck] =
//     useState(null);
//   const [checkingEligibility, setCheckingEligibility] =
//     useState(false);

//   const [itemEligibility, setItemEligibility] =
//     useState({});
//   const [checkingEligibilityFor, setCheckingEligibilityFor] =
//     useState(null);

//   const location = useLocation();

//   /* =========================================================
//      URL PARAMS
//   ========================================================== */

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(
//       location.search
//     );

//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
//       usageType: searchParams.get('usageType'),
//       productName: searchParams.get('productName'),
//       centerName: searchParams.get('centerName'),
//       month: searchParams.get('month'),
//     };
//   };

//   /* =========================================================
//      INITIALIZE DATA
//   ========================================================== */

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);

//         const urlParams = getUrlParams();

//         await Promise.all([
//           fetchCenters(),
//           fetchProducts(),
//           fetchResellers(),
//         ]);

//         let searchParams = {
//           usageType: 'Damage',
//           status: 'completed',
//         };

//         if (
//           urlParams.product ||
//           urlParams.center ||
//           urlParams.usageType
//         ) {
//           searchParams = {
//             ...searchParams,
//             product: urlParams.product || '',
//             center: urlParams.center || '',
//             usageType:
//               urlParams.usageType || 'Damage',
//             status: 'completed',
//             startDate: '',
//             endDate: '',
//             createdBy: '',
//           };

//           setActiveSearch(searchParams);

//           if (
//             urlParams.productName &&
//             urlParams.centerName &&
//             urlParams.usageType
//           ) {
//             document.title =
//               `Revert Damage - ${decodeURIComponent(
//                 urlParams.productName
//               )} at ${decodeURIComponent(
//                 urlParams.centerName
//               )}`;
//           }
//         } else {
//           searchParams = {
//             usageType: 'Damage',
//             status: 'completed',
//           };

//           setActiveSearch(searchParams);
//         }

//         await fetchData(searchParams, 1);
//       } catch (error) {
//         console.error(
//           'Error initializing data:',
//           error
//         );

//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [location.search]);

//   /* =========================================================
//      FLATTEN API DATA
//   ========================================================== */

//   useEffect(() => {
//     if (data && data.length > 0) {
//       const flattened = [];

//       data.forEach((transaction) => {
//         if (
//           transaction.items &&
//           transaction.items.length > 0
//         ) {
//           transaction.items.forEach((item) => {
//             flattened.push({
//               _id: `${transaction._id}_${item._id}`,
//               transactionId: transaction._id,
//               itemId: item._id,
//               date: transaction.date,
//               usageType:
//                 transaction.usageType,
//               center:
//                 transaction.center?.centerName ||
//                 '',
//               centerId:
//                 transaction.center?._id || '',
//               toCenter:
//                 transaction.toCenter?.centerName ||
//                 '',
//               product:
//                 item.product?.productTitle ||
//                 '',
//               productId:
//                 item.product?.productId || '',
//               productCode:
//                 item.product?.productCode || '',
//               qty: item.quantity || 0,
//               trackSerialNumber:
//                 item.product
//                   ?.trackSerialNumber || 'No',
//               serialNumbers:
//                 item.serialNumbers || [],
//               serialNumberCount:
//                 item.serialNumbers?.length || 0,
//               status: transaction.status,
//               createdBy:
//                 transaction.createdBy?.email ||
//                 '',
//               createdAt:
//                 transaction.createdAt,
//               remark:
//                 transaction.remark,
//               damageReason:
//                 transaction.damageReason,
//               approvedBy:
//                 transaction.approvedBy?.name ||
//                 transaction.approvedBy?.email ||
//                 '',
//               approvalDate:
//                 transaction.approvalDate,
//               canRevert: true,
//             });
//           });
//         }
//       });

//       setFlattenedData(flattened);

//       checkAllItemsEligibility(flattened);
//     } else {
//       setFlattenedData([]);
//     }
//   }, [data]);

//   /* =========================================================
//      CHECK ALL ITEMS ELIGIBILITY
//   ========================================================== */

//   const checkAllItemsEligibility = async (
//     items
//   ) => {
//     const eligibilityMap = {};

//     const batchSize = 5;

//     for (
//       let i = 0;
//       i < items.length;
//       i += batchSize
//     ) {
//       const batch = items.slice(
//         i,
//         i + batchSize
//       );

//       await Promise.all(
//         batch.map(async (item) => {
//           try {
//             const response =
//               await axiosInstance.get(
//                 `/stockusage/${item.transactionId}/check-revert`
//               );

//             if (response.data.success) {
//               eligibilityMap[item._id] = {
//                 eligible:
//                   response.data.eligible,
//                 allItemsPendingDamage:
//                   response.data
//                     .allItemsPendingDamage,
//                 details:
//                   response.data.details,
//               };
//             }
//           } catch (err) {
//             console.error(
//               `Error checking eligibility for item ${item._id}:`,
//               err
//             );

//             eligibilityMap[item._id] = {
//               eligible: false,
//               error: true,
//             };
//           }
//         })
//       );
//     }

//     setItemEligibility(
//       eligibilityMap
//     );
//   };

//   /* =========================================================
//      FETCH DATA
//   ========================================================== */

//   const fetchData = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params =
//         new URLSearchParams();

//       const urlParams =
//         getUrlParams();

//       const productId =
//         urlParams.product ||
//         searchParams.product;

//       const centerId =
//         urlParams.center ||
//         searchParams.center;

//       const usageType =
//         urlParams.usageType ||
//         searchParams.usageType ||
//         'Damage';

//       if (productId) {
//         params.append(
//           'product',
//           productId
//         );
//       }

//       if (centerId) {
//         params.append(
//           'center',
//           centerId
//         );
//       }

//       if (usageType) {
//         params.append(
//           'usageType',
//           usageType
//         );
//       }

//       params.append(
//         'status',
//         'completed'
//       );

//       if (searchParams.createdBy) {
//         params.append(
//           'createdBy',
//           searchParams.createdBy
//         );
//       }

//       if (searchParams.startDate) {
//         params.append(
//           'startDate',
//           searchParams.startDate
//         );
//       }

//       if (searchParams.endDate) {
//         params.append(
//           'endDate',
//           searchParams.endDate
//         );
//       }

//       if (urlParams.month) {
//         const [year, month] =
//           urlParams.month.split('-');

//         const monthStart = `${year}-${month.padStart(
//           2,
//           '0'
//         )}-01`;

//         const lastDay = new Date(
//           parseInt(year, 10),
//           parseInt(month, 10),
//           0
//         ).getDate();

//         const monthEnd = `${year}-${month.padStart(
//           2,
//           '0'
//         )}-${lastDay}`;

//         params.append(
//           'startDate',
//           monthStart
//         );

//         params.append(
//           'endDate',
//           monthEnd
//         );
//       }

//       params.append(
//         'page',
//         page
//       );

//       let url =
//         '/stockusage?usageType=Damage&status=completed';

//       if (params.toString()) {
//         url = `/stockusage?${params.toString()}`;
//       }

//       const response =
//         await axiosInstance.get(
//           url
//         );

//       if (response.data.success) {
//         setData(
//           response.data.data
//         );

//         setCurrentPage(
//           response.data.pagination
//             ?.currentPage || 1
//         );

//         setTotalPages(
//           response.data.pagination
//             ?.totalPages || 1
//         );
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response';

//         setError(errorMessage);
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data
//             ?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`;

//         setError(errorMessage);
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
//      MASTER DATA
//   ========================================================== */

//   const fetchCenters = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/centers'
//         );

//       if (response.data.success) {
//         setCenters(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error
//       );
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/products/all'
//         );

//       if (response.data.success) {
//         setProducts(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error
//       );
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/resellers'
//         );

//       if (response.data.success) {
//         setResellers(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching resellers:',
//         error
//       );
//     }
//   };

//   /* =========================================================
//      PAGINATION
//   ========================================================== */

//   const handlePageChange = (
//     page
//   ) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return;
//     }

//     fetchData(
//       activeSearch,
//       page
//     );
//   };

//   /* =========================================================
//      TOTALS
//   ========================================================== */

//   const calculateTotals = () => {
//     const totals = {
//       total: 0,
//     };

//     filteredData.forEach(
//       (item) => {
//         totals.total +=
//           parseFloat(
//             item.qty || 0
//           );
//       }
//     );

//     return totals;
//   };

//   /* =========================================================
//      SORTING
//   ========================================================== */

//   const handleSort = (key) => {
//     let direction =
//       'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction ===
//         'ascending'
//     ) {
//       direction =
//         'descending';
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedData =
//       [...flattenedData].sort(
//         (a, b) => {
//           let aValue = a[key];
//           let bValue = b[key];

//           if (
//             aValue < bValue
//           ) {
//             return direction ===
//               'ascending'
//               ? -1
//               : 1;
//           }

//           if (
//             aValue > bValue
//           ) {
//             return direction ===
//               'ascending'
//               ? 1
//               : -1;
//           }

//           return 0;
//         }
//       );

//     setFlattenedData(
//       sortedData
//     );
//   };

//   const getSortIcon = (
//     key
//   ) => {
//     if (
//       sortConfig.key !== key
//     ) {
//       return null;
//     }

//     return sortConfig.direction ===
//       'ascending' ? (
//       <ArrowUp
//         size={14}
//         className="ml-1 inline"
//       />
//     ) : (
//       <ArrowDown
//         size={14}
//         className="ml-1 inline"
//       />
//     );
//   };

//   /* =========================================================
//      SEARCH
//   ========================================================== */

//   const handleSearch = (
//     searchData
//   ) => {
//     setActiveSearch(
//       searchData
//     );

//     fetchData(
//       {
//         ...searchData,
//         usageType: 'Damage',
//         status: 'completed',
//       },
//       1
//     );
//   };

//   const handleResetSearch =
//     () => {
//       const resetSearch = {
//         product: '',
//         center: '',
//         usageType: 'Damage',
//         status: 'completed',
//       };

//       setActiveSearch(
//         resetSearch
//       );

//       setSearchTerm('');

//       fetchData(
//         {
//           usageType: 'Damage',
//           status: 'completed',
//         },
//         1
//       );
//     };

//   const isSearchActive =
//     () => {
//       return Object.values(
//         activeSearch
//       ).some(
//         (value) =>
//           value !== '' &&
//           value !== 'Damage' &&
//           value !== 'completed'
//       );
//     };

//   /* =========================================================
//      FRONTEND SEARCH
//   ========================================================== */

//   const filteredData =
//     flattenedData.filter(
//       (item) => {
//         if (searchTerm) {
//           const searchLower =
//             searchTerm.toLowerCase();

//           return (
//             (item.date &&
//               new Date(
//                 item.date
//               )
//                 .toLocaleDateString()
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.usageType &&
//               item.usageType
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.center &&
//               item.center
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.product &&
//               item.product
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.damageReason &&
//               item.damageReason
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.qty &&
//               item.qty
//                 .toString()
//                 .includes(
//                   searchLower
//                 ))
//           );
//         }

//         return true;
//       }
//     );

//   /* =========================================================
//      SERIAL NUMBERS
//   ========================================================== */

//   const handleShowSerialNumbers =
//     (item) => {
//       if (
//         item.trackSerialNumber ===
//           'Yes' &&
//         item.serialNumbers &&
//         item.serialNumbers
//           .length > 0
//       ) {
//         setSelectedItem(
//           item
//         );

//         setSelectedSerials(
//           item.serialNumbers
//         );

//         setSerialModalVisible(
//           true
//         );
//       }
//     };

//   /* =========================================================
//      ELIGIBILITY CHECK
//   ========================================================== */

//   const checkRevertEligibility =
//     async (item) => {
//       try {
//         setCheckingEligibility(
//           true
//         );

//         setCheckingEligibilityFor(
//           item._id
//         );

//         setEligibilityCheck(
//           null
//         );

//         const response =
//           await axiosInstance.get(
//             `/stockusage/${item.transactionId}/check-revert`
//           );

//         if (
//           response.data.success
//         ) {
//           setEligibilityCheck(
//             response.data
//           );

//           setItemEligibility(
//             (prev) => ({
//               ...prev,
//               [item._id]: {
//                 eligible:
//                   response.data
//                     .eligible,
//                 allItemsPendingDamage:
//                   response.data
//                     .allItemsPendingDamage,
//                 details:
//                   response.data
//                     .details,
//               },
//             })
//           );

//           if (
//             response.data.eligible
//           ) {
//             setItemToRevert(
//               item
//             );

//             setRevertModalVisible(
//               true
//             );

//             setRevertSuccess(
//               null
//             );

//             setRevertError(
//               null
//             );

//             setRevertRemark(
//               ''
//             );
//           } else {
//             setRevertError(
//               response.data
//                 .message ||
//                 'This item cannot be reverted'
//             );

//             setRevertModalVisible(
//               true
//             );
//           }
//         } else {
//           setRevertError(
//             response.data
//               .message ||
//               'Failed to check eligibility'
//           );

//           setRevertModalVisible(
//             true
//           );
//         }
//       } catch (err) {
//         console.error(
//           'Error checking eligibility:',
//           err
//         );

//         setRevertError(
//           err.response?.data
//             ?.message ||
//             err.message ||
//             'Failed to check revert eligibility'
//         );

//         setRevertModalVisible(
//           true
//         );
//       } finally {
//         setCheckingEligibility(
//           false
//         );

//         setCheckingEligibilityFor(
//           null
//         );
//       }
//     };

//   const handleRevertClick = (
//     item
//   ) => {
//     checkRevertEligibility(
//       item
//     );
//   };

//   /* =========================================================
//      CONFIRM REVERT
//   ========================================================== */

//   const confirmRevert =
//     async () => {
//       if (!itemToRevert) {
//         return;
//       }

//       try {
//         setRevertLoading(
//           true
//         );

//         setRevertError(null);

//         const user =
//           JSON.parse(
//             localStorage.getItem(
//               'user'
//             ) || 'null'
//           );

//         const response =
//           await axiosInstance.put(
//             `/stockusage/${itemToRevert.transactionId}/revert-damage`,
//             {
//               revertRemark:
//                 revertRemark ||
//                 `Reverted by ${
//                   user?.name || 'user'
//                 }`,
//             }
//           );

//         if (
//           response.data.success
//         ) {
//           setRevertSuccess(
//             'Item successfully reverted from damage stock'
//           );

//           setItemEligibility(
//             (prev) => ({
//               ...prev,
//               [itemToRevert._id]: {
//                 eligible: false,
//                 reverted: true,
//               },
//             })
//           );

//           setTimeout(() => {
//             setRevertModalVisible(
//               false
//             );

//             fetchData(
//               activeSearch,
//               currentPage
//             );
//           }, 1500);
//         } else {
//           setRevertError(
//             response.data
//               .message ||
//               'Failed to revert item'
//           );
//         }
//       } catch (err) {
//         console.error(
//           'Error reverting damage:',
//           err
//         );

//         setRevertError(
//           err.response?.data
//             ?.message ||
//             err.message ||
//             'An error occurred while reverting'
//         );
//       } finally {
//         setRevertLoading(
//           false
//         );
//       }
//     };

//   /* =========================================================
//      REVERT HELPERS
//   ========================================================== */

//   const canItemBeReverted =
//     (item) => {
//       const eligibility =
//         itemEligibility[
//           item._id
//         ];

//       return (
//         eligibility?.eligible ===
//         true
//       );
//     };

//   const getRevertButtonTooltip =
//     (item) => {
//       const eligibility =
//         itemEligibility[
//           item._id
//         ];

//       if (!eligibility) {
//         return 'Checking eligibility...';
//       }

//       if (
//         eligibility.eligible
//       ) {
//         return 'Click to revert this item';
//       }

//       if (eligibility.error) {
//         return 'Error checking eligibility';
//       }

//       return 'This item cannot be reverted (already processed)';
//     };

//   /* =========================================================
//      FORMAT DATE
//   ========================================================== */

//   const formatDate = (
//     dateString
//   ) => {
//     if (!dateString) {
//       return '';
//     }

//     const date =
//       new Date(dateString);

//     return date.toLocaleDateString(
//       'en-IN',
//       {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       }
//     );
//   };

//   /* =========================================================
//      LOADING
//   ========================================================== */

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-3 text-gray-500">
//           <LoaderCircle
//             size={36}
//             className="animate-spin text-blue-600"
//           />

//           <span className="text-sm">
//             Loading damage records...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   /* =========================================================
//      ERROR
//   ========================================================== */

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   const totals =
//     calculateTotals();

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-[1600px]">
//         {/* PAGE TITLE */}

//         <div className="mb-5">
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Revert Damage Products
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Review completed damage
//             transactions and revert eligible
//             items back to available stock.
//           </p>
//         </div>

//         {/* SEARCH MODAL */}

//         <SearchCenterStock
//           visible={
//             searchModalVisible
//           }
//           onClose={() =>
//             setSearchModalVisible(
//               false
//             )
//           }
//           onSearch={
//             handleSearch
//           }
//           centers={centers}
//           products={products}
//           resellers={resellers}
//           initialUsageType="Damage"
//           showStatusFilter={false}
//         />

//         {/* =================================================
//             SERIAL MODAL
//         ================================================== */}

//         {serialModalVisible && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//             <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
//               {/* HEADER */}

//               <div className="flex items-center justify-between border-b px-5 py-4">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   Serial Numbers -{' '}
//                   {
//                     selectedItem?.product
//                   }
//                 </h2>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setSerialModalVisible(
//                       false
//                     )
//                   }
//                   className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* BODY */}

//               <div className="overflow-y-auto p-5">
//                 {selectedItem && (
//                   <div className="overflow-x-auto rounded-lg border border-gray-200">
//                     <table className="w-full min-w-[500px] border-collapse text-sm">
//                       <thead>
//                         <tr className="bg-gray-100 text-left">
//                           <th className="w-[15%] border-b px-4 py-3 font-semibold text-gray-700">
//                             SR No.
//                           </th>

//                           <th className="w-[85%] border-b px-4 py-3 font-semibold text-gray-700">
//                             Serial Number
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {selectedSerials.length >
//                         0 ? (
//                           selectedSerials.map(
//                             (
//                               serial,
//                               index
//                             ) => (
//                               <tr
//                                 key={`${serial}-${index}`}
//                                 className="border-b border-gray-100"
//                               >
//                                 <td className="px-4 py-3 font-semibold text-gray-800">
//                                   {index +
//                                     1}
//                                 </td>

//                                 <td className="px-4 py-3">
//                                   <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-medium text-gray-800">
//                                     {serial}
//                                   </div>
//                                 </td>
//                               </tr>
//                             )
//                           )
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={2}
//                               className="px-4 py-8 text-center text-sm text-gray-500"
//                             >
//                               No serial
//                               numbers
//                               available
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>

//               {/* FOOTER */}

//               <div className="flex justify-end border-t bg-gray-50 px-5 py-4">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setSerialModalVisible(
//                       false
//                     )
//                   }
//                   className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* =================================================
//             REVERT MODAL
//         ================================================== */}

//         {revertModalVisible && (
//           <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
//             <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
//               {/* HEADER */}

//               <div className="flex items-center justify-between border-b px-5 py-4">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   {revertSuccess
//                     ? 'Revert Successful'
//                     : revertError &&
//                         !eligibilityCheck?.eligible
//                       ? 'Cannot Revert'
//                       : 'Confirm Revert'}
//                 </h2>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setRevertModalVisible(
//                       false
//                     )
//                   }
//                   disabled={
//                     revertLoading ||
//                     checkingEligibility
//                   }
//                   className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* BODY */}

//               <div className="overflow-y-auto p-5">
//                 {/* CHECKING */}

//                 {checkingEligibility ? (
//                   <div className="flex min-h-[180px] flex-col items-center justify-center text-gray-600">
//                     <LoaderCircle
//                       size={34}
//                       className="animate-spin text-blue-600"
//                     />

//                     <p className="mt-3 text-sm">
//                       Checking revert
//                       eligibility...
//                     </p>
//                   </div>
//                 ) : revertSuccess ? (
//                   <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                     <CheckCircle2
//                       size={20}
//                       className="mt-0.5 shrink-0"
//                     />

//                     <span>
//                       {revertSuccess}
//                     </span>
//                   </div>
//                 ) : (
//                   <>
//                     {/* ERROR */}

//                     {revertError && (
//                       <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                         <FileWarning
//                           size={20}
//                           className="mt-0.5 shrink-0"
//                         />

//                         <span>
//                           {
//                             revertError
//                           }
//                         </span>
//                       </div>
//                     )}

//                     {/* ELIGIBILITY DETAILS */}

//                     {eligibilityCheck &&
//                       !eligibilityCheck.eligible &&
//                       eligibilityCheck.details && (
//                         <div className="mb-5">
//                           <h3 className="mb-3 text-sm font-semibold text-gray-800">
//                             Revert Eligibility
//                             Details:
//                           </h3>

//                           <div className="overflow-x-auto rounded-lg border border-gray-200">
//                             <table className="w-full min-w-[600px] border-collapse text-sm">
//                               <thead>
//                                 <tr className="bg-gray-100 text-left">
//                                   <th className="border-b px-4 py-3 font-semibold text-gray-700">
//                                     Product
//                                   </th>

//                                   <th className="border-b px-4 py-3 font-semibold text-gray-700">
//                                     Status
//                                   </th>

//                                   <th className="border-b px-4 py-3 font-semibold text-gray-700">
//                                     Message
//                                   </th>
//                                 </tr>
//                               </thead>

//                               <tbody>
//                                 {eligibilityCheck
//                                   .details
//                                   .items?.map(
//                                     (
//                                       detail,
//                                       index
//                                     ) => (
//                                       <tr
//                                         key={
//                                           index
//                                         }
//                                         className="border-b border-gray-100"
//                                       >
//                                         <td className="px-4 py-3 text-gray-800">
//                                           {
//                                             detail.product
//                                           }
//                                         </td>

//                                         <td className="px-4 py-3">
//                                           <span
//                                             className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                                               detail.status ===
//                                               'pending_damage'
//                                                 ? 'bg-yellow-100 text-yellow-800'
//                                                 : 'bg-red-100 text-red-700'
//                                             }`}
//                                           >
//                                             {
//                                               detail.status
//                                             }
//                                           </span>
//                                         </td>

//                                         <td className="px-4 py-3 text-gray-600">
//                                           {
//                                             detail.message
//                                           }
//                                         </td>
//                                       </tr>
//                                     )
//                                   )}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       )}

//                     {/* CONFIRM REVERT */}

//                     {eligibilityCheck?.eligible &&
//                       itemToRevert && (
//                         <>
//                           <p className="mb-4 text-sm text-gray-700">
//                             Are you sure you
//                             want to revert this
//                             damage item?
//                           </p>

//                           <div className="mb-5 overflow-hidden rounded-lg border border-gray-200">
//                             <table className="w-full border-collapse text-sm">
//                               <tbody>
//                                 <tr className="border-b border-gray-100">
//                                   <th className="w-[30%] bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Product
//                                   </th>

//                                   <td className="px-4 py-3 font-semibold text-gray-800">
//                                     {
//                                       itemToRevert.product
//                                     }
//                                   </td>
//                                 </tr>

//                                 <tr className="border-b border-gray-100">
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Quantity
//                                   </th>

//                                   <td className="px-4 py-3">
//                                     <span className="font-semibold text-gray-800">
//                                       {
//                                         itemToRevert.qty
//                                       }
//                                     </span>

//                                     {itemToRevert.trackSerialNumber ===
//                                       'Yes' &&
//                                       itemToRevert.serialNumberCount >
//                                         0 && (
//                                         <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
//                                           {
//                                             itemToRevert.serialNumberCount
//                                           }{' '}
//                                           serials
//                                         </span>
//                                       )}
//                                   </td>
//                                 </tr>

//                                 <tr className="border-b border-gray-100">
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Branch
//                                   </th>

//                                   <td className="px-4 py-3 text-gray-700">
//                                     {
//                                       itemToRevert.center
//                                     }
//                                   </td>
//                                 </tr>

//                                 <tr
//                                   className={
//                                     itemToRevert
//                                       .damageReason
//                                       ? 'border-b border-gray-100'
//                                       : ''
//                                   }
//                                 >
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Date
//                                   </th>

//                                   <td className="px-4 py-3 text-gray-700">
//                                     {formatDate(
//                                       itemToRevert.date
//                                     )}
//                                   </td>
//                                 </tr>

//                                 {itemToRevert.damageReason && (
//                                   <tr>
//                                     <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                       Damage
//                                       Reason
//                                     </th>

//                                     <td className="px-4 py-3 text-gray-700">
//                                       {
//                                         itemToRevert.damageReason
//                                       }
//                                     </td>
//                                   </tr>
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>

//                           {/* REMARK */}

//                           <div className="mb-4">
//                             <label
//                               htmlFor="revertRemark"
//                               className="mb-2 block text-sm font-medium text-gray-700"
//                             >
//                               Revert Remark
//                               <span className="ml-1 text-gray-400">
//                                 (Optional)
//                               </span>
//                             </label>

//                             <input
//                               id="revertRemark"
//                               type="text"
//                               value={
//                                 revertRemark
//                               }
//                               onChange={(e) =>
//                                 setRevertRemark(
//                                   e.target
//                                     .value
//                                 )
//                               }
//                               placeholder="Enter reason for reverting this damage"
//                               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           </div>

//                           {/* WARNING */}

//                           <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
//                             <FileWarning
//                               size={19}
//                               className="mt-0.5 shrink-0"
//                             />

//                             <p>
//                               <strong>
//                                 Note:
//                               </strong>{' '}
//                               This will move the
//                               item back to available
//                               stock and remove it
//                               from faulty stock.
//                             </p>
//                           </div>
//                         </>
//                       )}
//                   </>
//                 )}
//               </div>

//               {/* FOOTER */}

//               <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setRevertModalVisible(
//                       false
//                     )
//                   }
//                   disabled={
//                     revertLoading ||
//                     checkingEligibility
//                   }
//                   className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   {revertSuccess
//                     ? 'Close'
//                     : 'Cancel'}
//                 </button>

//                 {!revertSuccess &&
//                   eligibilityCheck?.eligible && (
//                     <button
//                       type="button"
//                       onClick={
//                         confirmRevert
//                       }
//                       disabled={
//                         revertLoading ||
//                         checkingEligibility
//                       }
//                       className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                       {revertLoading ? (
//                         <>
//                           <LoaderCircle
//                             size={16}
//                             className="animate-spin"
//                           />
//                           Reverting...
//                         </>
//                       ) : (
//                         <>
//                           <RotateCcw
//                             size={16}
//                           />
//                           Confirm Revert
//                         </>
//                       )}
//                     </button>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* =================================================
//             MAIN TABLE CARD
//         ================================================== */}

//         <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//           {/* CARD HEADER */}

//           <div className="flex flex-col gap-4 border-b bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex flex-wrap items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setSearchModalVisible(
//                     true
//                   )
//                 }
//                 className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <Search
//                   size={16}
//                 />
//                 Search
//               </button>

//               {isSearchActive() && (
//                 <button
//                   type="button"
//                   onClick={
//                     handleResetSearch
//                   }
//                   className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//                 >
//                   <ZoomOut
//                     size={16}
//                   />
//                   Reset Search
//                 </button>
//               )}
//             </div>

//             <Pagination
//               currentPage={
//                 currentPage
//               }
//               totalPages={
//                 totalPages
//               }
//               onPageChange={
//                 handlePageChange
//               }
//             />
//           </div>

//           {/* CARD BODY */}

//           <div className="p-5">
//             {/* SEARCH + COUNT */}

//             <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <div className="text-sm text-gray-500">
//                 Showing{' '}
//                 <span className="font-semibold text-gray-700">
//                   {
//                     filteredData.length
//                   }
//                 </span>{' '}
//                 items
//               </div>

//               <div className="relative w-full sm:w-[350px]">
//                 <Search
//                   size={16}
//                   className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   type="text"
//                   value={
//                     searchTerm
//                   }
//                   onChange={(e) =>
//                     setSearchTerm(
//                       e.target
//                         .value
//                     )
//                   }
//                   placeholder="Search..."
//                   className="h-9 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>
//             </div>

//             {/* TABLE */}

//             <div className="overflow-x-auto rounded-lg border border-gray-200">
//               <table className="w-full min-w-[1100px] border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-gray-100 text-left">
//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'date'
//                         )
//                       }
//                       className="cursor-pointer border-b px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                     >
//                       Date
//                       {getSortIcon(
//                         'date'
//                       )}
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'center'
//                         )
//                       }
//                       className="cursor-pointer border-b px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                     >
//                       Branch
//                       {getSortIcon(
//                         'center'
//                       )}
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'product'
//                         )
//                       }
//                       className="cursor-pointer border-b px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                     >
//                       Product
//                       {getSortIcon(
//                         'product'
//                       )}
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'damageReason'
//                         )
//                       }
//                       className="cursor-pointer border-b px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                     >
//                       Damage Reason
//                       {getSortIcon(
//                         'damageReason'
//                       )}
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'qty'
//                         )
//                       }
//                       className="cursor-pointer border-b px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                     >
//                       Qty
//                       {getSortIcon(
//                         'qty'
//                       )}
//                     </th>

//                     <th className="border-b px-4 py-3 font-semibold text-gray-700">
//                       Status
//                     </th>

//                     <th className="border-b px-4 py-3 font-semibold text-gray-700">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredData.length >
//                   0 ? (
//                     <>
//                       {filteredData.map(
//                         (item) => {
//                           const eligibility =
//                             itemEligibility[
//                               item._id
//                             ];

//                           const isEligible =
//                             eligibility?.eligible ===
//                             true;

//                           const isChecking =
//                             checkingEligibilityFor ===
//                             item._id;

//                           return (
//                             <tr
//                               key={
//                                 item._id
//                               }
//                               className="border-b border-gray-100 hover:bg-gray-50"
//                             >
//                               {/* DATE */}

//                               <td className="px-4 py-3 text-gray-700">
//                                 {formatDate(
//                                   item.date
//                                 )}
//                               </td>

//                               {/* BRANCH */}

//                               <td className="px-4 py-3 text-gray-700">
//                                 {
//                                   item.center
//                                 }
//                               </td>

//                               {/* PRODUCT */}

//                               <td className="px-4 py-3 font-medium text-gray-800">
//                                 {
//                                   item.product
//                                 }
//                               </td>

//                               {/* DAMAGE REASON */}

//                               <td className="px-4 py-3 text-gray-600">
//                                 {item.damageReason ||
//                                   'N/A'}
//                               </td>

//                               {/* QTY */}

//                               <td className="px-4 py-3">
//                                 <div className="flex items-center gap-2">
//                                   <span className="font-semibold text-gray-800">
//                                     {
//                                       item.qty
//                                     }
//                                   </span>

//                                   {item.trackSerialNumber ===
//                                     'Yes' &&
//                                     item.serialNumberCount >
//                                       0 && (
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleShowSerialNumbers(
//                                             item
//                                           )
//                                         }
//                                         title={`Click to view ${item.serialNumberCount} serial number(s)`}
//                                         className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
//                                       >
//                                         <Eye
//                                           size={
//                                             16
//                                           }
//                                         />
//                                       </button>
//                                     )}
//                                 </div>
//                               </td>

//                               {/* STATUS */}

//                               <td className="px-4 py-3">
//                                 {isChecking ? (
//                                   <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
//                                     <LoaderCircle
//                                       size={
//                                         13
//                                       }
//                                       className="animate-spin"
//                                     />
//                                     Checking...
//                                   </span>
//                                 ) : eligibility ? (
//                                   <span
//                                     className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                                       isEligible
//                                         ? 'bg-green-100 text-green-700'
//                                         : 'bg-gray-100 text-gray-600'
//                                     }`}
//                                   >
//                                     {isEligible
//                                       ? 'Pending'
//                                       : 'Processed'}
//                                   </span>
//                                 ) : (
//                                   <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
//                                     Checking...
//                                   </span>
//                                 )}
//                               </td>

//                               {/* ACTION */}

//                               <td className="px-4 py-3">
//                                 <button
//                                   type="button"
//                                   title={getRevertButtonTooltip(
//                                     item
//                                   )}
//                                   onClick={() =>
//                                     handleRevertClick(
//                                       item
//                                     )
//                                   }
//                                   disabled={
//                                     !isEligible ||
//                                     revertLoading ||
//                                     isChecking
//                                   }
//                                   className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
//                                     isEligible
//                                       ? 'bg-blue-600 text-white hover:bg-blue-700'
//                                       : 'bg-gray-200 text-gray-500'
//                                   }`}
//                                 >
//                                   {isChecking ? (
//                                     <LoaderCircle
//                                       size={
//                                         15
//                                       }
//                                       className="animate-spin"
//                                     />
//                                   ) : isEligible ? (
//                                     <RotateCcw
//                                       size={
//                                         15
//                                       }
//                                     />
//                                   ) : (
//                                     <Ban
//                                       size={
//                                         15
//                                       }
//                                     />
//                                   )}

//                                   {isEligible
//                                     ? 'Revert'
//                                     : 'Cannot Revert'}
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         }
//                       )}

//                       {/* TOTAL */}

//                       <tr className="bg-gray-50">
//                         <td
//                           colSpan={
//                             5
//                           }
//                           className="px-4 py-3 text-right font-semibold text-gray-700"
//                         >
//                           Total Quantity:
//                         </td>

//                         <td
//                           colSpan={
//                             2
//                           }
//                           className="px-4 py-3 font-bold text-gray-800"
//                         >
//                           {totals.total.toFixed(
//                             2
//                           )}
//                         </td>
//                       </tr>
//                     </>
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={
//                           7
//                         }
//                         className="px-4 py-12 text-center text-sm text-gray-500"
//                       >
//                         No completed
//                         damage records
//                         found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RevertDamage;



// import React, { useEffect, useState } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Ban,
//   CheckCircle2,
//   List,
//   FileWarning,
//   LoaderCircle,
//   RefreshCcw,
//   RotateCcw,
//   Search,
//   X,
//   ZoomOut,
// } from 'lucide-react';
// import { useLocation } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import Pagination from '../../utils/Pagination';
// import SearchCenterStock from '../Report/SearchCenterStock';

// const RevertDamage = () => {
//   const [data, setData] = useState([]);
//   const [flattenedData, setFlattenedData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     usageType: 'Damage',
//     status: 'completed',
//     createdBy: '',
//     startDate: '',
//     endDate: '',
//   });

//   const [serialModalVisible, setSerialModalVisible] =
//     useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedSerials, setSelectedSerials] = useState([]);

//   const [revertModalVisible, setRevertModalVisible] =
//     useState(false);
//   const [itemToRevert, setItemToRevert] = useState(null);

//   const [revertLoading, setRevertLoading] =
//     useState(false);
//   const [revertSuccess, setRevertSuccess] =
//     useState(null);
//   const [revertError, setRevertError] =
//     useState(null);
//   const [revertRemark, setRevertRemark] =
//     useState('');

//   const [eligibilityCheck, setEligibilityCheck] =
//     useState(null);
//   const [checkingEligibility, setCheckingEligibility] =
//     useState(false);

//   const [itemEligibility, setItemEligibility] =
//     useState({});
//   const [checkingEligibilityFor, setCheckingEligibilityFor] =
//     useState(null);

//   const location = useLocation();

//   /* =========================================================
//      URL PARAMS
//   ========================================================== */

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(
//       location.search
//     );

//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
//       usageType: searchParams.get('usageType'),
//       productName: searchParams.get('productName'),
//       centerName: searchParams.get('centerName'),
//       month: searchParams.get('month'),
//     };
//   };

//   /* =========================================================
//      INITIALIZE DATA
//   ========================================================== */

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);

//         const urlParams = getUrlParams();

//         await Promise.all([
//           fetchCenters(),
//           fetchProducts(),
//           fetchResellers(),
//         ]);

//         let searchParams = {
//           usageType: 'Damage',
//           status: 'completed',
//         };

//         if (
//           urlParams.product ||
//           urlParams.center ||
//           urlParams.usageType
//         ) {
//           searchParams = {
//             ...searchParams,
//             product: urlParams.product || '',
//             center: urlParams.center || '',
//             usageType:
//               urlParams.usageType || 'Damage',
//             status: 'completed',
//             startDate: '',
//             endDate: '',
//             createdBy: '',
//           };

//           setActiveSearch(searchParams);

//           if (
//             urlParams.productName &&
//             urlParams.centerName &&
//             urlParams.usageType
//           ) {
//             document.title =
//               `Revert Damage - ${decodeURIComponent(
//                 urlParams.productName
//               )} at ${decodeURIComponent(
//                 urlParams.centerName
//               )}`;
//           }
//         } else {
//           searchParams = {
//             usageType: 'Damage',
//             status: 'completed',
//           };

//           setActiveSearch(searchParams);
//         }

//         await fetchData(searchParams, 1);
//       } catch (error) {
//         console.error(
//           'Error initializing data:',
//           error
//         );

//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [location.search]);

//   /* =========================================================
//      FLATTEN API DATA
//   ========================================================== */

//   useEffect(() => {
//     if (data && data.length > 0) {
//       const flattened = [];

//       data.forEach((transaction) => {
//         if (
//           transaction.items &&
//           transaction.items.length > 0
//         ) {
//           transaction.items.forEach((item) => {
//             flattened.push({
//               _id: `${transaction._id}_${item._id}`,
//               transactionId: transaction._id,
//               itemId: item._id,
//               date: transaction.date,
//               usageType:
//                 transaction.usageType,
//               center:
//                 transaction.center?.centerName ||
//                 '',
//               centerId:
//                 transaction.center?._id || '',
//               toCenter:
//                 transaction.toCenter?.centerName ||
//                 '',
//               product:
//                 item.product?.productTitle ||
//                 '',
//               productId:
//                 item.product?.productId || '',
//               productCode:
//                 item.product?.productCode || '',
//               qty: item.quantity || 0,
//               trackSerialNumber:
//                 item.product
//                   ?.trackSerialNumber || 'No',
//               serialNumbers:
//                 item.serialNumbers || [],
//               serialNumberCount:
//                 item.serialNumbers?.length || 0,
//               status: transaction.status,
//               createdBy:
//                 transaction.createdBy?.email ||
//                 '',
//               createdAt:
//                 transaction.createdAt,
//               remark:
//                 transaction.remark,
//               damageReason:
//                 transaction.damageReason,
//               approvedBy:
//                 transaction.approvedBy?.name ||
//                 transaction.approvedBy?.email ||
//                 '',
//               approvalDate:
//                 transaction.approvalDate,
//               canRevert: true,
//             });
//           });
//         }
//       });

//       setFlattenedData(flattened);

//       checkAllItemsEligibility(flattened);
//     } else {
//       setFlattenedData([]);
//     }
//   }, [data]);

//   /* =========================================================
//      CHECK ALL ITEMS ELIGIBILITY
//   ========================================================== */

//   const checkAllItemsEligibility = async (
//     items
//   ) => {
//     const eligibilityMap = {};

//     const batchSize = 5;

//     for (
//       let i = 0;
//       i < items.length;
//       i += batchSize
//     ) {
//       const batch = items.slice(
//         i,
//         i + batchSize
//       );

//       await Promise.all(
//         batch.map(async (item) => {
//           try {
//             const response =
//               await axiosInstance.get(
//                 `/stockusage/${item.transactionId}/check-revert`
//               );

//             if (response.data.success) {
//               eligibilityMap[item._id] = {
//                 eligible:
//                   response.data.eligible,
//                 allItemsPendingDamage:
//                   response.data
//                     .allItemsPendingDamage,
//                 details:
//                   response.data.details,
//               };
//             }
//           } catch (err) {
//             console.error(
//               `Error checking eligibility for item ${item._id}:`,
//               err
//             );

//             eligibilityMap[item._id] = {
//               eligible: false,
//               error: true,
//             };
//           }
//         })
//       );
//     }

//     setItemEligibility(
//       eligibilityMap
//     );
//   };

//   /* =========================================================
//      FETCH DATA
//   ========================================================== */

//   const fetchData = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params =
//         new URLSearchParams();

//       const urlParams =
//         getUrlParams();

//       const productId =
//         urlParams.product ||
//         searchParams.product;

//       const centerId =
//         urlParams.center ||
//         searchParams.center;

//       const usageType =
//         urlParams.usageType ||
//         searchParams.usageType ||
//         'Damage';

//       if (productId) {
//         params.append(
//           'product',
//           productId
//         );
//       }

//       if (centerId) {
//         params.append(
//           'center',
//           centerId
//         );
//       }

//       if (usageType) {
//         params.append(
//           'usageType',
//           usageType
//         );
//       }

//       params.append(
//         'status',
//         'completed'
//       );

//       if (searchParams.createdBy) {
//         params.append(
//           'createdBy',
//           searchParams.createdBy
//         );
//       }

//       if (searchParams.startDate) {
//         params.append(
//           'startDate',
//           searchParams.startDate
//         );
//       }

//       if (searchParams.endDate) {
//         params.append(
//           'endDate',
//           searchParams.endDate
//         );
//       }

//       if (urlParams.month) {
//         const [year, month] =
//           urlParams.month.split('-');

//         const monthStart = `${year}-${month.padStart(
//           2,
//           '0'
//         )}-01`;

//         const lastDay = new Date(
//           parseInt(year, 10),
//           parseInt(month, 10),
//           0
//         ).getDate();

//         const monthEnd = `${year}-${month.padStart(
//           2,
//           '0'
//         )}-${lastDay}`;

//         params.append(
//           'startDate',
//           monthStart
//         );

//         params.append(
//           'endDate',
//           monthEnd
//         );
//       }

//       params.append(
//         'page',
//         page
//       );

//       let url =
//         '/stockusage?usageType=Damage&status=completed';

//       if (params.toString()) {
//         url = `/stockusage?${params.toString()}`;
//       }

//       const response =
//         await axiosInstance.get(
//           url
//         );

//       if (response.data.success) {
//         setData(
//           response.data.data
//         );

//         setCurrentPage(
//           response.data.pagination
//             ?.currentPage || 1
//         );

//         setTotalPages(
//           response.data.pagination
//             ?.totalPages || 1
//         );
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response';

//         setError(errorMessage);
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data
//             ?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`;

//         setError(errorMessage);
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
//      MASTER DATA
//   ========================================================== */

//   const fetchCenters = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/centers'
//         );

//       if (response.data.success) {
//         setCenters(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error
//       );
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/products/all'
//         );

//       if (response.data.success) {
//         setProducts(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error
//       );
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/resellers'
//         );

//       if (response.data.success) {
//         setResellers(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching resellers:',
//         error
//       );
//     }
//   };

//   /* =========================================================
//      PAGINATION
//   ========================================================== */

//   const handlePageChange = (
//     page
//   ) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return;
//     }

//     fetchData(
//       activeSearch,
//       page
//     );
//   };

//   /* =========================================================
//      TOTALS
//   ========================================================== */

//   const calculateTotals = () => {
//     const totals = {
//       total: 0,
//     };

//     filteredData.forEach(
//       (item) => {
//         totals.total +=
//           parseFloat(
//             item.qty || 0
//           );
//       }
//     );

//     return totals;
//   };

//   /* =========================================================
//      SORTING
//   ========================================================== */

//   const handleSort = (key) => {
//     let direction =
//       'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction ===
//         'ascending'
//     ) {
//       direction =
//         'descending';
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedData =
//       [...flattenedData].sort(
//         (a, b) => {
//           let aValue = a[key];
//           let bValue = b[key];

//           if (
//             aValue < bValue
//           ) {
//             return direction ===
//               'ascending'
//               ? -1
//               : 1;
//           }

//           if (
//             aValue > bValue
//           ) {
//             return direction ===
//               'ascending'
//               ? 1
//               : -1;
//           }

//           return 0;
//         }
//       );

//     setFlattenedData(
//       sortedData
//     );
//   };

//   const getSortIcon = (
//     key
//   ) => {
//     if (
//       sortConfig.key !== key
//     ) {
//       return null;
//     }

//     return sortConfig.direction ===
//       'ascending' ? (
//       <ArrowUp
//         size={14}
//         className="ml-1 inline"
//       />
//     ) : (
//       <ArrowDown
//         size={14}
//         className="ml-1 inline"
//       />
//     );
//   };

//   /* =========================================================
//      SEARCH
//   ========================================================== */

//   const handleSearch = (
//     searchData
//   ) => {
//     setActiveSearch(
//       searchData
//     );

//     fetchData(
//       {
//         ...searchData,
//         usageType: 'Damage',
//         status: 'completed',
//       },
//       1
//     );
//   };

//   const handleResetSearch =
//     () => {
//       const resetSearch = {
//         product: '',
//         center: '',
//         usageType: 'Damage',
//         status: 'completed',
//       };

//       setActiveSearch(
//         resetSearch
//       );

//       setSearchTerm('');

//       fetchData(
//         {
//           usageType: 'Damage',
//           status: 'completed',
//         },
//         1
//       );
//     };

//   const isSearchActive =
//     () => {
//       return Object.values(
//         activeSearch
//       ).some(
//         (value) =>
//           value !== '' &&
//           value !== 'Damage' &&
//           value !== 'completed'
//       );
//     };

//   /* =========================================================
//      FRONTEND SEARCH
//   ========================================================== */

//   const filteredData =
//     flattenedData.filter(
//       (item) => {
//         if (searchTerm) {
//           const searchLower =
//             searchTerm.toLowerCase();

//           return (
//             (item.date &&
//               new Date(
//                 item.date
//               )
//                 .toLocaleDateString()
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.usageType &&
//               item.usageType
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.center &&
//               item.center
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.product &&
//               item.product
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.damageReason &&
//               item.damageReason
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.qty &&
//               item.qty
//                 .toString()
//                 .includes(
//                   searchLower
//                 ))
//           );
//         }

//         return true;
//       }
//     );

//   /* =========================================================
//      SERIAL NUMBERS
//   ========================================================== */

//   const handleShowSerialNumbers =
//     (item) => {
//       if (
//         item.trackSerialNumber ===
//           'Yes' &&
//         item.serialNumbers &&
//         item.serialNumbers
//           .length > 0
//       ) {
//         setSelectedItem(
//           item
//         );

//         setSelectedSerials(
//           item.serialNumbers
//         );

//         setSerialModalVisible(
//           true
//         );
//       }
//     };

//   /* =========================================================
//      ELIGIBILITY CHECK
//   ========================================================== */

//   const checkRevertEligibility =
//     async (item) => {
//       try {
//         setCheckingEligibility(
//           true
//         );

//         setCheckingEligibilityFor(
//           item._id
//         );

//         setEligibilityCheck(
//           null
//         );

//         const response =
//           await axiosInstance.get(
//             `/stockusage/${item.transactionId}/check-revert`
//           );

//         if (
//           response.data.success
//         ) {
//           setEligibilityCheck(
//             response.data
//           );

//           setItemEligibility(
//             (prev) => ({
//               ...prev,
//               [item._id]: {
//                 eligible:
//                   response.data
//                     .eligible,
//                 allItemsPendingDamage:
//                   response.data
//                     .allItemsPendingDamage,
//                 details:
//                   response.data
//                     .details,
//               },
//             })
//           );

//           if (
//             response.data.eligible
//           ) {
//             setItemToRevert(
//               item
//             );

//             setRevertModalVisible(
//               true
//             );

//             setRevertSuccess(
//               null
//             );

//             setRevertError(
//               null
//             );

//             setRevertRemark(
//               ''
//             );
//           } else {
//             setRevertError(
//               response.data
//                 .message ||
//                 'This item cannot be reverted'
//             );

//             setRevertModalVisible(
//               true
//             );
//           }
//         } else {
//           setRevertError(
//             response.data
//               .message ||
//               'Failed to check eligibility'
//           );

//           setRevertModalVisible(
//             true
//           );
//         }
//       } catch (err) {
//         console.error(
//           'Error checking eligibility:',
//           err
//         );

//         setRevertError(
//           err.response?.data
//             ?.message ||
//             err.message ||
//             'Failed to check revert eligibility'
//         );

//         setRevertModalVisible(
//           true
//         );
//       } finally {
//         setCheckingEligibility(
//           false
//         );

//         setCheckingEligibilityFor(
//           null
//         );
//       }
//     };

//   const handleRevertClick = (
//     item
//   ) => {
//     checkRevertEligibility(
//       item
//     );
//   };

//   /* =========================================================
//      CONFIRM REVERT
//   ========================================================== */

//   const confirmRevert =
//     async () => {
//       if (!itemToRevert) {
//         return;
//       }

//       try {
//         setRevertLoading(
//           true
//         );

//         setRevertError(null);

//         const user =
//           JSON.parse(
//             localStorage.getItem(
//               'user'
//             ) || 'null'
//           );

//         const response =
//           await axiosInstance.put(
//             `/stockusage/${itemToRevert.transactionId}/revert-damage`,
//             {
//               revertRemark:
//                 revertRemark ||
//                 `Reverted by ${
//                   user?.name || 'user'
//                 }`,
//             }
//           );

//         if (
//           response.data.success
//         ) {
//           setRevertSuccess(
//             'Item successfully reverted from damage stock'
//           );

//           setItemEligibility(
//             (prev) => ({
//               ...prev,
//               [itemToRevert._id]: {
//                 eligible: false,
//                 reverted: true,
//               },
//             })
//           );

//           setTimeout(() => {
//             setRevertModalVisible(
//               false
//             );

//             fetchData(
//               activeSearch,
//               currentPage
//             );
//           }, 1500);
//         } else {
//           setRevertError(
//             response.data
//               .message ||
//               'Failed to revert item'
//           );
//         }
//       } catch (err) {
//         console.error(
//           'Error reverting damage:',
//           err
//         );

//         setRevertError(
//           err.response?.data
//             ?.message ||
//             err.message ||
//             'An error occurred while reverting'
//         );
//       } finally {
//         setRevertLoading(
//           false
//         );
//       }
//     };

//   /* =========================================================
//      REVERT HELPERS
//   ========================================================== */

//   const canItemBeReverted =
//     (item) => {
//       const eligibility =
//         itemEligibility[
//           item._id
//         ];

//       return (
//         eligibility?.eligible ===
//         true
//       );
//     };

//   const getRevertButtonTooltip =
//     (item) => {
//       const eligibility =
//         itemEligibility[
//           item._id
//         ];

//       if (!eligibility) {
//         return 'Checking eligibility...';
//       }

//       if (
//         eligibility.eligible
//       ) {
//         return 'Click to revert this item';
//       }

//       if (eligibility.error) {
//         return 'Error checking eligibility';
//       }

//       return 'This item cannot be reverted (already processed)';
//     };

//   /* =========================================================
//      FORMAT DATE
//   ========================================================== */

//   const formatDate = (
//     dateString
//   ) => {
//     if (!dateString) {
//       return '';
//     }

//     const date =
//       new Date(dateString);

//     return date.toLocaleDateString(
//       'en-IN',
//       {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       }
//     );
//   };

//   /* =========================================================
//      LOADING
//   ========================================================== */

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-3 text-gray-500">
//           <LoaderCircle
//             size={36}
//             className="animate-spin text-[#2759A2]"
//           />

//           <span className="text-sm">
//             Loading damage records...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   /* =========================================================
//      ERROR
//   ========================================================== */

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   const totals =
//     calculateTotals();

//   return (
//     <>
//       <style>{`
//         @keyframes revertDamageDrop {
//           0% {
//             opacity: 0;
//             transform: translateY(-45px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//       <div className="min-h-screen w-full bg-[#f5f6f8] px-2 py-2 md:px-3">
//         <div className="w-full bg-[#f5f6f8]">
//           {/* PAGE TITLE */}
//           <div className="mb-7 px-1">
//             <h1 className="text-[24px] font-normal leading-tight text-[#212529]">
//               Revert Damage Products
//             </h1>
//           </div>

//           {/* SEARCH MODAL */}
//           <SearchCenterStock
//             visible={searchModalVisible}
//             onClose={() => setSearchModalVisible(false)}
//             onSearch={handleSearch}
//             centers={centers}
//             products={products}
//             resellers={resellers}
//             initialUsageType="Damage"
//             showStatusFilter={false}
//           />

//           {/* SERIAL MODAL */}
//           {serialModalVisible && (
//             <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
//               <div
//                 className="mt-8 flex max-h-[calc(100vh-64px)] w-full max-w-2xl flex-col overflow-hidden rounded-md border-t-4 border-[#2759A2] bg-white shadow-2xl"
//                 style={{
//                   animation:
//                     'revertDamageDrop 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
//                 }}
//               >
//                 <div className="flex items-center justify-between border-b border-[#e1e4e8] px-5 py-4">
//                   <h2 className="text-lg font-semibold text-[#343a40]">
//                     Serial Numbers - {selectedItem?.product}
//                   </h2>
//                   <button
//                     type="button"
//                     onClick={() => setSerialModalVisible(false)}
//                     className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <div className="overflow-y-auto p-5">
//                   {selectedItem && (
//                     <div className="overflow-x-auto rounded-sm border border-[#e1e4e8]">
//                       <table className="w-full min-w-[500px] border-collapse text-sm">
//                         <thead>
//                           <tr className="bg-[#f1f3f5] text-left">
//                             <th className="w-[15%] border-b border-[#dfe3e7] px-4 py-3 font-bold text-[#171717]">
//                               SR No.
//                             </th>
//                             <th className="w-[85%] border-b border-[#dfe3e7] px-4 py-3 font-bold text-[#171717]">
//                               Serial Number
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {selectedSerials.length > 0 ? (
//                             selectedSerials.map((serial, index) => (
//                               <tr
//                                 key={`${serial}-${index}`}
//                                 className="border-b border-gray-100"
//                               >
//                                 <td className="px-4 py-3 font-semibold text-gray-800">
//                                   {index + 1}
//                                 </td>
//                                 <td className="px-3 py-3">
//                                   <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-medium text-gray-800">
//                                     {serial}
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td
//                                 colSpan={2}
//                                 className="px-4 py-8 text-center text-sm text-gray-500"
//                               >
//                                 No serial numbers available
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-end border-t border-[#e1e4e8] bg-white px-5 py-4">
//                   <button
//                     type="button"
//                     onClick={() => setSerialModalVisible(false)}
//                     className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* REVERT MODAL */}
//           {revertModalVisible && (
//             <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
//               <div
//                 className="mt-8 flex max-h-[calc(100vh-64px)] w-full max-w-3xl flex-col overflow-hidden rounded-md border-t-4 border-[#2759A2] bg-white shadow-2xl"
//                 style={{
//                   animation:
//                     'revertDamageDrop 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
//                 }}
//               >
//                 <div className="flex items-center justify-between border-b border-[#e1e4e8] px-5 py-4">
//                   <h2 className="text-lg font-semibold text-[#343a40]">
//                     {revertSuccess
//                       ? 'Revert Successful'
//                       : revertError && !eligibilityCheck?.eligible
//                         ? 'Cannot Revert'
//                         : 'Confirm Revert'}
//                   </h2>

//                   <button
//                     type="button"
//                     onClick={() => setRevertModalVisible(false)}
//                     disabled={revertLoading || checkingEligibility}
//                     className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <div className="overflow-y-auto p-5">
//                   {checkingEligibility ? (
//                     <div className="flex min-h-[180px] flex-col items-center justify-center text-gray-600">
//                       <LoaderCircle
//                         size={34}
//                         className="animate-spin text-[#2759A2]"
//                       />
//                       <p className="mt-3 text-sm">
//                         Checking revert eligibility...
//                       </p>
//                     </div>
//                   ) : revertSuccess ? (
//                     <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                       <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
//                       <span>{revertSuccess}</span>
//                     </div>
//                   ) : (
//                     <>
//                       {revertError && (
//                         <div className="mb-4 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                           <FileWarning size={20} className="mt-0.5 shrink-0" />
//                           <span>{revertError}</span>
//                         </div>
//                       )}

//                       {eligibilityCheck &&
//                         !eligibilityCheck.eligible &&
//                         eligibilityCheck.details && (
//                           <div className="mb-5">
//                             <h3 className="mb-3 text-sm font-semibold text-gray-800">
//                               Revert Eligibility Details:
//                             </h3>

//                             <div className="overflow-x-auto rounded-sm border border-[#e1e4e8]">
//                               <table className="w-full min-w-[600px] border-collapse text-sm">
//                                 <thead>
//                                   <tr className="bg-[#f1f3f5] text-left">
//                                     <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                                       Product
//                                     </th>
//                                     <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                                       Status
//                                     </th>
//                                     <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                                       Message
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {eligibilityCheck.details.items?.map(
//                                     (detail, index) => (
//                                       <tr
//                                         key={index}
//                                         className="border-b border-gray-100"
//                                       >
//                                         <td className="px-4 py-3 text-gray-800">
//                                           {detail.product}
//                                         </td>
//                                         <td className="px-3 py-3">
//                                           <span
//                                             className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                                               detail.status === 'pending_damage'
//                                                 ? 'bg-yellow-100 text-yellow-800'
//                                                 : 'bg-red-100 text-red-700'
//                                             }`}
//                                           >
//                                             {detail.status}
//                                           </span>
//                                         </td>
//                                         <td className="px-3 py-3 text-[#343a40]">
//                                           {detail.message}
//                                         </td>
//                                       </tr>
//                                     ),
//                                   )}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         )}

//                       {eligibilityCheck?.eligible && itemToRevert && (
//                         <>
//                           <p className="mb-4 text-sm text-gray-700">
//                             Are you sure you want to revert this damage item?
//                           </p>

//                           <div className="mb-5 overflow-hidden rounded-md border border-[#e1e4e8]">
//                             <table className="w-full border-collapse text-sm">
//                               <tbody>
//                                 <tr className="border-b border-gray-100">
//                                   <th className="w-[30%] bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Product
//                                   </th>
//                                   <td className="px-4 py-3 font-semibold text-gray-800">
//                                     {itemToRevert.product}
//                                   </td>
//                                 </tr>

//                                 <tr className="border-b border-gray-100">
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Quantity
//                                   </th>
//                                   <td className="px-3 py-3">
//                                     <span className="font-semibold text-gray-800">
//                                       {itemToRevert.qty}
//                                     </span>
//                                     {itemToRevert.trackSerialNumber === 'Yes' &&
//                                       itemToRevert.serialNumberCount > 0 && (
//                                         <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
//                                           {itemToRevert.serialNumberCount} serials
//                                         </span>
//                                       )}
//                                   </td>
//                                 </tr>

//                                 <tr className="border-b border-gray-100">
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Branch
//                                   </th>
//                                   <td className="px-3 py-3 text-[#171717]">
//                                     {itemToRevert.center}
//                                   </td>
//                                 </tr>

//                                 <tr
//                                   className={
//                                     itemToRevert.damageReason
//                                       ? 'border-b border-gray-100'
//                                       : ''
//                                   }
//                                 >
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Date
//                                   </th>
//                                   <td className="px-3 py-3 text-[#171717]">
//                                     {formatDate(itemToRevert.date)}
//                                   </td>
//                                 </tr>

//                                 {itemToRevert.damageReason && (
//                                   <tr>
//                                     <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                       Damage Reason
//                                     </th>
//                                     <td className="px-3 py-3 text-[#171717]">
//                                       {itemToRevert.damageReason}
//                                     </td>
//                                   </tr>
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>

//                           <div className="mb-4">
//                             <label
//                               htmlFor="revertRemark"
//                               className="mb-2 block text-sm font-medium text-gray-700"
//                             >
//                               Revert Remark
//                               <span className="ml-1 text-gray-400">
//                                 (Optional)
//                               </span>
//                             </label>

//                             <input
//                               id="revertRemark"
//                               type="text"
//                               value={revertRemark}
//                               onChange={(e) => setRevertRemark(e.target.value)}
//                               placeholder="Enter reason for reverting this damage"
//                               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-blue-100"
//                             />
//                           </div>

//                           <div className="flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
//                             <FileWarning size={19} className="mt-0.5 shrink-0" />
//                             <p>
//                               <strong>Note:</strong> This will move the item back
//                               to available stock and remove it from faulty stock.
//                             </p>
//                           </div>
//                         </>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 <div className="flex justify-end gap-2 border-t border-[#e1e4e8] bg-white px-5 py-4">
//                   <button
//                     type="button"
//                     onClick={() => setRevertModalVisible(false)}
//                     disabled={revertLoading || checkingEligibility}
//                     className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     {revertSuccess ? 'Close' : 'Cancel'}
//                   </button>

//                   {!revertSuccess && eligibilityCheck?.eligible && (
//                     <button
//                       type="button"
//                       onClick={confirmRevert}
//                       disabled={revertLoading || checkingEligibility}
//                       className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4b8c] disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                       {revertLoading ? (
//                         <>
//                           <LoaderCircle size={16} className="animate-spin" />
//                           Reverting...
//                         </>
//                       ) : (
//                         <>
//                           <RotateCcw size={16} />
//                           Confirm Revert
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* MAIN TABLE CARD */}
//           <div className="w-full overflow-hidden rounded-sm border border-[#e1e4e8] border-t-4 border-t-[#2759A2] bg-white shadow-sm">
//             {/* TOP ACTION BAR */}
//             <div className="flex min-h-[54px] items-center justify-between border-b border-[#e1e4e8] bg-white px-4 py-3">
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setSearchModalVisible(true)}
//                   className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4b8c]"
//                 >
//                   <Search size={16} />
//                   Search
//                 </button>

//                 {isSearchActive() && (
//                   <button
//                     type="button"
//                     onClick={handleResetSearch}
//                     className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4b8c]"
//                   >
//                     <ZoomOut size={16} />
//                     Reset Search
//                   </button>
//                 )}
//               </div>

//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             </div>

//             {/* TABLE CONTENT */}
//             <div className="p-4">
//               <div className="mb-4 flex items-center justify-between gap-4">
//                 <div className="text-[16px] text-[#6c757d]">
//                   Showing{' '}
//                   <span className="font-medium text-[#6c757d]">
//                     {filteredData.length}
//                   </span>{' '}
//                   items
//                 </div>

//                 <div className="flex w-[250px] items-center gap-2">
//                   <label
//                     htmlFor="revert-damage-search"
//                     className="whitespace-nowrap text-sm font-semibold text-[#171717]"
//                   >
//                     Search:
//                   </label>
//                   <div className="relative flex-1">
//                     <Search
//                       size={15}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                       id="revert-damage-search"
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="h-9 w-full rounded-sm border border-[#d7dce1] bg-white pl-9 pr-3 text-sm text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]/20"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* VERTICAL TABLE SCROLL ONLY */}
//               <div className="max-h-[520px] overflow-y-auto overflow-x-hidden border border-[#e1e4e8]">
//                 <table className="w-full table-fixed border-collapse text-sm">
//                   <thead className="sticky top-0 z-20">
//                     <tr className="bg-[#f1f3f5] text-left">
//                       <th
//                         onClick={() => handleSort('date')}
//                         className="w-[8%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Date {getSortIcon('date')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('center')}
//                         className="w-[8%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Branch {getSortIcon('center')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('product')}
//                         className="w-[39%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Product {getSortIcon('product')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('damageReason')}
//                         className="w-[15%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Damage Reason {getSortIcon('damageReason')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('qty')}
//                         className="w-[5%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Qty {getSortIcon('qty')}
//                       </th>
//                       <th className="w-[9%] border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                         Status
//                       </th>
//                       <th className="w-[16%] border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredData.length > 0 ? (
//                       <>
//                         {filteredData.map((item) => {
//                           const eligibility = itemEligibility[item._id];
//                           const isEligible = eligibility?.eligible === true;
//                           const isChecking =
//                             checkingEligibilityFor === item._id;

//                           return (
//                             <tr
//                               key={item._id}
//                               className="border-b border-white odd:bg-[#f0f0f0] even:bg-white hover:bg-[#e5f0ff]"
//                             >
//                               <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#171717]">
//                                 {formatDate(item.date)}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#171717]">
//                                 {item.center}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3 font-medium text-[#171717]">
//                                 {item.product}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#343a40]">
//                                 {item.damageReason || 'N/A'}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3">
//                                 <div className="flex items-center gap-2">
//                                   <span className="font-semibold text-gray-800">
//                                     {item.qty}
//                                   </span>

//                                   {item.trackSerialNumber === 'Yes' &&
//                                     item.serialNumberCount > 0 && (
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleShowSerialNumbers(item)
//                                         }
//                                         title={`Click to view ${item.serialNumberCount} serial number(s)`}
//                                         className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#eaf2ff] text-[#2759A2] transition hover:bg-[#dceaff]"
//                                       >
//                                         <List size={18} strokeWidth={2} />
//                                       </button>
//                                     )}
//                                 </div>
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3">
//                                 {isChecking ? (
//                                   <span className="inline-flex items-center gap-2 rounded-md bg-[#eaf2ff] px-2.5 py-1 text-xs font-medium text-[#2759A2]">
//                                     <LoaderCircle
//                                       size={13}
//                                       className="animate-spin"
//                                     />
//                                     Checking...
//                                   </span>
//                                 ) : eligibility ? (
//                                   <span
//                                     className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
//                                       isEligible
//                                         ? 'bg-[#16a34a] text-white'
//                                         : 'bg-gray-100 text-gray-600'
//                                     }`}
//                                   >
//                                     {isEligible ? 'Pending' : 'Processed'}
//                                   </span>
//                                 ) : (
//                                   <span className="inline-flex rounded-md bg-[#eeeeee] px-2.5 py-1 text-xs font-medium text-[#777]">
//                                     Checking...
//                                   </span>
//                                 )}
//                               </td>

//                               <td className="px-3 py-3">
//                                 <button
//                                   type="button"
//                                   title={getRevertButtonTooltip(item)}
//                                   onClick={() => handleRevertClick(item)}
//                                   disabled={
//                                     !isEligible ||
//                                     revertLoading ||
//                                     isChecking
//                                   }
//                                   className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
//                                     isEligible
//                                       ? 'bg-[#2759A2] text-white hover:bg-[#1f4b8c]'
//                                       : 'bg-gray-200 text-gray-500'
//                                   }`}
//                                 >
//                                   {isChecking ? (
//                                     <LoaderCircle
//                                       size={15}
//                                       className="animate-spin"
//                                     />
//                                   ) : isEligible ? (
//                                     <RotateCcw size={15} />
//                                   ) : (
//                                     <Ban size={15} />
//                                   )}
//                                   {isEligible ? 'Revert' : 'Cannot Revert'}
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}

//                         <tr className="bg-[#e5f1df]">
//                           <td
//                             colSpan={5}
//                             className="px-3 py-3 text-right font-semibold text-[#171717]"
//                           >
//                             Total Quantity:
//                           </td>
//                           <td
//                             colSpan={2}
//                             className="px-3 py-3 font-bold text-[#171717]"
//                           >
//                             {totals.total.toFixed(2)}
//                           </td>
//                         </tr>
//                       </>
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan={7}
//                           className="px-3 py-12 text-center text-sm text-[#777]"
//                         >
//                           No completed damage records found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default RevertDamage;



// import React, { useEffect, useState } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Ban,
//   CheckCircle2,
//   List,
//   FileWarning,
//   LoaderCircle,
//   RefreshCcw,
//   RotateCcw,
//   Search,
//   X,
//   ZoomOut,
// } from 'lucide-react';
// import { useLocation } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import Pagination from '../../utils/Pagination';
// import SearchCenterStock from '../Report/SearchCenterStock';

// const RevertDamage = () => {
//   const [data, setData] = useState([]);
//   const [flattenedData, setFlattenedData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     usageType: 'Damage',
//     status: 'completed',
//     createdBy: '',
//     startDate: '',
//     endDate: '',
//   });

//   const [serialModalVisible, setSerialModalVisible] =
//     useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedSerials, setSelectedSerials] = useState([]);

//   const [revertModalVisible, setRevertModalVisible] =
//     useState(false);
//   const [itemToRevert, setItemToRevert] = useState(null);

//   const [revertLoading, setRevertLoading] =
//     useState(false);
//   const [revertSuccess, setRevertSuccess] =
//     useState(null);
//   const [revertError, setRevertError] =
//     useState(null);
//   const [revertRemark, setRevertRemark] =
//     useState('');

//   const [eligibilityCheck, setEligibilityCheck] =
//     useState(null);
//   const [checkingEligibility, setCheckingEligibility] =
//     useState(false);

//   const [itemEligibility, setItemEligibility] =
//     useState({});
//   const [checkingEligibilityFor, setCheckingEligibilityFor] =
//     useState(null);

//   const location = useLocation();

//   /* =========================================================
//      URL PARAMS
//   ========================================================== */

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(
//       location.search
//     );

//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
//       usageType: searchParams.get('usageType'),
//       productName: searchParams.get('productName'),
//       centerName: searchParams.get('centerName'),
//       month: searchParams.get('month'),
//     };
//   };

//   /* =========================================================
//      INITIALIZE DATA
//   ========================================================== */

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);

//         const urlParams = getUrlParams();

//         await Promise.all([
//           fetchCenters(),
//           fetchProducts(),
//           fetchResellers(),
//         ]);

//         let searchParams = {
//           usageType: 'Damage',
//           status: 'completed',
//         };

//         if (
//           urlParams.product ||
//           urlParams.center ||
//           urlParams.usageType
//         ) {
//           searchParams = {
//             ...searchParams,
//             product: urlParams.product || '',
//             center: urlParams.center || '',
//             usageType:
//               urlParams.usageType || 'Damage',
//             status: 'completed',
//             startDate: '',
//             endDate: '',
//             createdBy: '',
//           };

//           setActiveSearch(searchParams);

//           if (
//             urlParams.productName &&
//             urlParams.centerName &&
//             urlParams.usageType
//           ) {
//             document.title =
//               `Revert Damage - ${decodeURIComponent(
//                 urlParams.productName
//               )} at ${decodeURIComponent(
//                 urlParams.centerName
//               )}`;
//           }
//         } else {
//           searchParams = {
//             usageType: 'Damage',
//             status: 'completed',
//           };

//           setActiveSearch(searchParams);
//         }

//         await fetchData(searchParams, 1);
//       } catch (error) {
//         console.error(
//           'Error initializing data:',
//           error
//         );

//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [location.search]);

//   /* =========================================================
//      FLATTEN API DATA
//   ========================================================== */

//   useEffect(() => {
//     const transactions = Array.isArray(data) ? data : [];
//     const flattened = [];

//     transactions.forEach((transaction) => {
//       const items = Array.isArray(transaction?.items)
//         ? transaction.items
//         : [];

//       items.forEach((item, index) => {
//         const product =
//           item?.product && typeof item.product === 'object'
//             ? item.product
//             : {};

//         const serialNumbers = Array.isArray(item?.serialNumbers)
//           ? item.serialNumbers
//           : Array.isArray(item?.serialNumber)
//             ? item.serialNumber
//             : [];

//         const transactionId =
//           transaction?._id ||
//           transaction?.id ||
//           transaction?.transactionId ||
//           '';

//         const itemId =
//           item?._id ||
//           item?.id ||
//           item?.itemId ||
//           index;

//         flattened.push({
//           _id: `${transactionId}_${itemId}`,
//           transactionId,
//           itemId,
//           date: transaction?.date || transaction?.createdAt || '',
//           usageType: transaction?.usageType || 'Damage',
//           center:
//             transaction?.center?.centerName ||
//             transaction?.center?.name ||
//             transaction?.centerName ||
//             (typeof transaction?.center === 'string' ? transaction.center : '') ||
//             '',
//           centerId:
//             transaction?.center?._id ||
//             transaction?.center?.id ||
//             transaction?.centerId ||
//             '',
//           toCenter:
//             transaction?.toCenter?.centerName ||
//             transaction?.toCenter?.name ||
//             '',
//           product:
//             product?.productTitle ||
//             product?.name ||
//             item?.productTitle ||
//             (typeof item?.product === 'string' ? item.product : '') ||
//             '',
//           productId:
//             product?._id ||
//             product?.productId ||
//             product?.id ||
//             item?.productId ||
//             '',
//           productCode:
//             product?.productCode ||
//             item?.productCode ||
//             '',
//           qty: Number(item?.quantity ?? item?.qty ?? 0),
//           trackSerialNumber:
//             product?.trackSerialNumber ||
//             item?.trackSerialNumber ||
//             'No',
//           serialNumbers,
//           serialNumberCount: serialNumbers.length,
//           status: transaction?.status || '',
//           createdBy:
//             transaction?.createdBy?.email ||
//             transaction?.createdBy?.name ||
//             '',
//           createdAt: transaction?.createdAt || '',
//           remark: transaction?.remark || '',
//           damageReason:
//             item?.damageReason ||
//             transaction?.damageReason ||
//             item?.reason ||
//             '',
//           approvedBy:
//             transaction?.approvedBy?.name ||
//             transaction?.approvedBy?.email ||
//             '',
//           approvalDate: transaction?.approvalDate || '',
//           canRevert: true,
//         });
//       });
//     });

//     setFlattenedData(flattened);

//     if (flattened.length > 0) {
//       checkAllItemsEligibility(flattened);
//     } else {
//       setItemEligibility({});
//     }
//   }, [data]);

//   /* =========================================================
//      CHECK ALL ITEMS ELIGIBILITY
//   ========================================================== */

//   const checkAllItemsEligibility = async (
//     items
//   ) => {
//     const eligibilityMap = {};

//     const batchSize = 5;

//     for (
//       let i = 0;
//       i < items.length;
//       i += batchSize
//     ) {
//       const batch = items.slice(
//         i,
//         i + batchSize
//       );

//       await Promise.all(
//         batch.map(async (item) => {
//           try {
//             const response =
//               await axiosInstance.get(
//                 `/stockusage/${item.transactionId}/check-revert`
//               );

//             if (response.data.success) {
//               eligibilityMap[item._id] = {
//                 eligible:
//                   response.data.eligible,
//                 allItemsPendingDamage:
//                   response.data
//                     .allItemsPendingDamage,
//                 details:
//                   response.data.details,
//               };
//             }
//           } catch (err) {
//             console.error(
//               `Error checking eligibility for item ${item._id}:`,
//               err
//             );

//             eligibilityMap[item._id] = {
//               eligible: false,
//               error: true,
//             };
//           }
//         })
//       );
//     }

//     setItemEligibility(
//       eligibilityMap
//     );
//   };

//   /* =========================================================
//      FETCH DATA
//   ========================================================== */

//   const fetchData = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params =
//         new URLSearchParams();

//       const urlParams =
//         getUrlParams();

//       const productId =
//         urlParams.product ||
//         searchParams.product;

//       const centerId =
//         urlParams.center ||
//         searchParams.center;

//       const usageType =
//         urlParams.usageType ||
//         searchParams.usageType ||
//         'Damage';

//       if (productId) {
//         params.append(
//           'product',
//           productId
//         );
//       }

//       if (centerId) {
//         params.append(
//           'center',
//           centerId
//         );
//       }

//       if (usageType) {
//         params.append(
//           'usageType',
//           usageType
//         );
//       }

//       params.append(
//         'status',
//         'completed'
//       );

//       if (searchParams.createdBy) {
//         params.append(
//           'createdBy',
//           searchParams.createdBy
//         );
//       }

//       if (searchParams.startDate) {
//         params.append(
//           'startDate',
//           searchParams.startDate
//         );
//       }

//       if (searchParams.endDate) {
//         params.append(
//           'endDate',
//           searchParams.endDate
//         );
//       }

//       if (urlParams.month) {
//         const [year, month] =
//           urlParams.month.split('-');

//         const monthStart = `${year}-${month.padStart(
//           2,
//           '0'
//         )}-01`;

//         const lastDay = new Date(
//           parseInt(year, 10),
//           parseInt(month, 10),
//           0
//         ).getDate();

//         const monthEnd = `${year}-${month.padStart(
//           2,
//           '0'
//         )}-${lastDay}`;

//         params.append(
//           'startDate',
//           monthStart
//         );

//         params.append(
//           'endDate',
//           monthEnd
//         );
//       }

//       params.append(
//         'page',
//         page
//       );

//       let url =
//         '/stockusage?usageType=Damage&status=completed';

//       if (params.toString()) {
//         url = `/stockusage?${params.toString()}`;
//       }

//       const response =
//         await axiosInstance.get(
//           url
//         );

//       if (response.data?.success) {
//         // New backend response is nested: data.records + data.pagination.
//         // Keep compatibility with endpoints returning data as an array.
//         const payload = response.data.data;
//         const records = Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload?.records)
//             ? payload.records
//             : Array.isArray(response.data.records)
//               ? response.data.records
//               : [];

//         const pagination =
//           payload?.pagination ||
//           response.data.pagination ||
//           {};

//         setData(records);
//         setCurrentPage(
//           Number(
//             pagination.page ??
//             pagination.currentPage ??
//             page
//           ) || 1
//         );
//         setTotalPages(
//           Math.max(
//             1,
//             Number(pagination.totalPages ?? pagination.pages ?? 1) || 1
//           )
//         );
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response';

//         setError(errorMessage);
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data
//             ?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`;

//         setError(errorMessage);
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
//      MASTER DATA
//   ========================================================== */

//   const fetchCenters = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/centers'
//         );

//       if (response.data.success) {
//         setCenters(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error
//       );
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/products/all'
//         );

//       if (response.data.success) {
//         setProducts(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error
//       );
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/resellers'
//         );

//       if (response.data.success) {
//         setResellers(
//           response.data.data
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching resellers:',
//         error
//       );
//     }
//   };

//   /* =========================================================
//      PAGINATION
//   ========================================================== */

//   const handlePageChange = (
//     page
//   ) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return;
//     }

//     fetchData(
//       activeSearch,
//       page
//     );
//   };

//   /* =========================================================
//      TOTALS
//   ========================================================== */

//   const calculateTotals = () => {
//     const totals = {
//       total: 0,
//     };

//     filteredData.forEach(
//       (item) => {
//         totals.total +=
//           parseFloat(
//             item.qty || 0
//           );
//       }
//     );

//     return totals;
//   };

//   /* =========================================================
//      SORTING
//   ========================================================== */

//   const handleSort = (key) => {
//     let direction =
//       'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction ===
//         'ascending'
//     ) {
//       direction =
//         'descending';
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedData =
//       [...flattenedData].sort(
//         (a, b) => {
//           let aValue = a[key];
//           let bValue = b[key];

//           if (
//             aValue < bValue
//           ) {
//             return direction ===
//               'ascending'
//               ? -1
//               : 1;
//           }

//           if (
//             aValue > bValue
//           ) {
//             return direction ===
//               'ascending'
//               ? 1
//               : -1;
//           }

//           return 0;
//         }
//       );

//     setFlattenedData(
//       sortedData
//     );
//   };

//   const getSortIcon = (
//     key
//   ) => {
//     if (
//       sortConfig.key !== key
//     ) {
//       return null;
//     }

//     return sortConfig.direction ===
//       'ascending' ? (
//       <ArrowUp
//         size={14}
//         className="ml-1 inline"
//       />
//     ) : (
//       <ArrowDown
//         size={14}
//         className="ml-1 inline"
//       />
//     );
//   };

//   /* =========================================================
//      SEARCH
//   ========================================================== */

//   const handleSearch = (
//     searchData
//   ) => {
//     setActiveSearch(
//       searchData
//     );

//     fetchData(
//       {
//         ...searchData,
//         usageType: 'Damage',
//         status: 'completed',
//       },
//       1
//     );
//   };

//   const handleResetSearch =
//     () => {
//       const resetSearch = {
//         product: '',
//         center: '',
//         usageType: 'Damage',
//         status: 'completed',
//       };

//       setActiveSearch(
//         resetSearch
//       );

//       setSearchTerm('');

//       fetchData(
//         {
//           usageType: 'Damage',
//           status: 'completed',
//         },
//         1
//       );
//     };

//   const isSearchActive =
//     () => {
//       return Object.values(
//         activeSearch
//       ).some(
//         (value) =>
//           value !== '' &&
//           value !== 'Damage' &&
//           value !== 'completed'
//       );
//     };

//   /* =========================================================
//      FRONTEND SEARCH
//   ========================================================== */

//   const filteredData =
//     flattenedData.filter(
//       (item) => {
//         if (searchTerm) {
//           const searchLower =
//             searchTerm.toLowerCase();

//           return (
//             (item.date &&
//               new Date(
//                 item.date
//               )
//                 .toLocaleDateString()
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.usageType &&
//               item.usageType
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.center &&
//               item.center
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.product &&
//               item.product
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.damageReason &&
//               item.damageReason
//                 .toLowerCase()
//                 .includes(
//                   searchLower
//                 )) ||
//             (item.qty &&
//               item.qty
//                 .toString()
//                 .includes(
//                   searchLower
//                 ))
//           );
//         }

//         return true;
//       }
//     );

//   /* =========================================================
//      SERIAL NUMBERS
//   ========================================================== */

//   const handleShowSerialNumbers =
//     (item) => {
//       if (
//         item.trackSerialNumber ===
//           'Yes' &&
//         item.serialNumbers &&
//         item.serialNumbers
//           .length > 0
//       ) {
//         setSelectedItem(
//           item
//         );

//         setSelectedSerials(
//           item.serialNumbers
//         );

//         setSerialModalVisible(
//           true
//         );
//       }
//     };

//   /* =========================================================
//      ELIGIBILITY CHECK
//   ========================================================== */

//   const checkRevertEligibility =
//     async (item) => {
//       try {
//         setCheckingEligibility(
//           true
//         );

//         setCheckingEligibilityFor(
//           item._id
//         );

//         setEligibilityCheck(
//           null
//         );

//         const response =
//           await axiosInstance.get(
//             `/stockusage/${item.transactionId}/check-revert`
//           );

//         if (
//           response.data.success
//         ) {
//           setEligibilityCheck(
//             response.data
//           );

//           setItemEligibility(
//             (prev) => ({
//               ...prev,
//               [item._id]: {
//                 eligible:
//                   response.data
//                     .eligible,
//                 allItemsPendingDamage:
//                   response.data
//                     .allItemsPendingDamage,
//                 details:
//                   response.data
//                     .details,
//               },
//             })
//           );

//           if (
//             response.data.eligible
//           ) {
//             setItemToRevert(
//               item
//             );

//             setRevertModalVisible(
//               true
//             );

//             setRevertSuccess(
//               null
//             );

//             setRevertError(
//               null
//             );

//             setRevertRemark(
//               ''
//             );
//           } else {
//             setRevertError(
//               response.data
//                 .message ||
//                 'This item cannot be reverted'
//             );

//             setRevertModalVisible(
//               true
//             );
//           }
//         } else {
//           setRevertError(
//             response.data
//               .message ||
//               'Failed to check eligibility'
//           );

//           setRevertModalVisible(
//             true
//           );
//         }
//       } catch (err) {
//         console.error(
//           'Error checking eligibility:',
//           err
//         );

//         setRevertError(
//           err.response?.data
//             ?.message ||
//             err.message ||
//             'Failed to check revert eligibility'
//         );

//         setRevertModalVisible(
//           true
//         );
//       } finally {
//         setCheckingEligibility(
//           false
//         );

//         setCheckingEligibilityFor(
//           null
//         );
//       }
//     };

//   const handleRevertClick = (
//     item
//   ) => {
//     checkRevertEligibility(
//       item
//     );
//   };

//   /* =========================================================
//      CONFIRM REVERT
//   ========================================================== */

//   const confirmRevert =
//     async () => {
//       if (!itemToRevert) {
//         return;
//       }

//       try {
//         setRevertLoading(
//           true
//         );

//         setRevertError(null);

//         const user =
//           JSON.parse(
//             localStorage.getItem(
//               'user'
//             ) || 'null'
//           );

//         const response =
//           await axiosInstance.put(
//             `/stockusage/${itemToRevert.transactionId}/revert-damage`,
//             {
//               revertRemark:
//                 revertRemark ||
//                 `Reverted by ${
//                   user?.name || 'user'
//                 }`,
//             }
//           );

//         if (
//           response.data.success
//         ) {
//           setRevertSuccess(
//             'Item successfully reverted from damage stock'
//           );

//           setItemEligibility(
//             (prev) => ({
//               ...prev,
//               [itemToRevert._id]: {
//                 eligible: false,
//                 reverted: true,
//               },
//             })
//           );

//           setTimeout(() => {
//             setRevertModalVisible(
//               false
//             );

//             fetchData(
//               activeSearch,
//               currentPage
//             );
//           }, 1500);
//         } else {
//           setRevertError(
//             response.data
//               .message ||
//               'Failed to revert item'
//           );
//         }
//       } catch (err) {
//         console.error(
//           'Error reverting damage:',
//           err
//         );

//         setRevertError(
//           err.response?.data
//             ?.message ||
//             err.message ||
//             'An error occurred while reverting'
//         );
//       } finally {
//         setRevertLoading(
//           false
//         );
//       }
//     };

//   /* =========================================================
//      REVERT HELPERS
//   ========================================================== */

//   const canItemBeReverted =
//     (item) => {
//       const eligibility =
//         itemEligibility[
//           item._id
//         ];

//       return (
//         eligibility?.eligible ===
//         true
//       );
//     };

//   const getRevertButtonTooltip =
//     (item) => {
//       const eligibility =
//         itemEligibility[
//           item._id
//         ];

//       if (!eligibility) {
//         return 'Checking eligibility...';
//       }

//       if (
//         eligibility.eligible
//       ) {
//         return 'Click to revert this item';
//       }

//       if (eligibility.error) {
//         return 'Error checking eligibility';
//       }

//       return 'This item cannot be reverted (already processed)';
//     };

//   /* =========================================================
//      FORMAT DATE
//   ========================================================== */

//   const formatDate = (
//     dateString
//   ) => {
//     if (!dateString) {
//       return '';
//     }

//     const date =
//       new Date(dateString);

//     return date.toLocaleDateString(
//       'en-IN',
//       {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       }
//     );
//   };

//   /* =========================================================
//      LOADING
//   ========================================================== */

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-3 text-gray-500">
//           <LoaderCircle
//             size={36}
//             className="animate-spin text-[#2759A2]"
//           />

//           <span className="text-sm">
//             Loading damage records...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   /* =========================================================
//      ERROR
//   ========================================================== */

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   const totals =
//     calculateTotals();

//   return (
//     <>
//       <style>{`
//         @keyframes revertDamageDrop {
//           0% {
//             opacity: 0;
//             transform: translateY(-45px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//       <div className="min-h-screen w-full bg-[#f5f6f8] px-2 py-2 md:px-3">
//         <div className="w-full bg-[#f5f6f8]">
//           {/* PAGE TITLE */}
//           <div className="mb-7 px-1">
//             <h1 className="text-[24px] font-normal leading-tight text-[#212529]">
//               Revert Damage Products
//             </h1>
//           </div>

//           {/* SEARCH MODAL */}
//           <SearchCenterStock
//             visible={searchModalVisible}
//             onClose={() => setSearchModalVisible(false)}
//             onSearch={handleSearch}
//             centers={centers}
//             products={products}
//             resellers={resellers}
//             initialUsageType="Damage"
//             showStatusFilter={false}
//           />

//           {/* SERIAL MODAL */}
//           {serialModalVisible && (
//             <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
//               <div
//                 className="mt-8 flex max-h-[calc(100vh-64px)] w-full max-w-2xl flex-col overflow-hidden rounded-md border-t-4 border-[#2759A2] bg-white shadow-2xl"
//                 style={{
//                   animation:
//                     'revertDamageDrop 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
//                 }}
//               >
//                 <div className="flex items-center justify-between border-b border-[#e1e4e8] px-5 py-4">
//                   <h2 className="text-lg font-semibold text-[#343a40]">
//                     Serial Numbers - {selectedItem?.product}
//                   </h2>
//                   <button
//                     type="button"
//                     onClick={() => setSerialModalVisible(false)}
//                     className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <div className="overflow-y-auto p-5">
//                   {selectedItem && (
//                     <div className="overflow-x-auto rounded-sm border border-[#e1e4e8]">
//                       <table className="w-full min-w-[500px] border-collapse text-sm">
//                         <thead>
//                           <tr className="bg-[#f1f3f5] text-left">
//                             <th className="w-[15%] border-b border-[#dfe3e7] px-4 py-3 font-bold text-[#171717]">
//                               SR No.
//                             </th>
//                             <th className="w-[85%] border-b border-[#dfe3e7] px-4 py-3 font-bold text-[#171717]">
//                               Serial Number
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {selectedSerials.length > 0 ? (
//                             selectedSerials.map((serial, index) => (
//                               <tr
//                                 key={`${serial}-${index}`}
//                                 className="border-b border-gray-100"
//                               >
//                                 <td className="px-4 py-3 font-semibold text-gray-800">
//                                   {index + 1}
//                                 </td>
//                                 <td className="px-3 py-3">
//                                   <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-medium text-gray-800">
//                                     {serial}
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td
//                                 colSpan={2}
//                                 className="px-4 py-8 text-center text-sm text-gray-500"
//                               >
//                                 No serial numbers available
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-end border-t border-[#e1e4e8] bg-white px-5 py-4">
//                   <button
//                     type="button"
//                     onClick={() => setSerialModalVisible(false)}
//                     className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* REVERT MODAL */}
//           {revertModalVisible && (
//             <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
//               <div
//                 className="mt-8 flex max-h-[calc(100vh-64px)] w-full max-w-3xl flex-col overflow-hidden rounded-md border-t-4 border-[#2759A2] bg-white shadow-2xl"
//                 style={{
//                   animation:
//                     'revertDamageDrop 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
//                 }}
//               >
//                 <div className="flex items-center justify-between border-b border-[#e1e4e8] px-5 py-4">
//                   <h2 className="text-lg font-semibold text-[#343a40]">
//                     {revertSuccess
//                       ? 'Revert Successful'
//                       : revertError && !eligibilityCheck?.eligible
//                         ? 'Cannot Revert'
//                         : 'Confirm Revert'}
//                   </h2>

//                   <button
//                     type="button"
//                     onClick={() => setRevertModalVisible(false)}
//                     disabled={revertLoading || checkingEligibility}
//                     className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <div className="overflow-y-auto p-5">
//                   {checkingEligibility ? (
//                     <div className="flex min-h-[180px] flex-col items-center justify-center text-gray-600">
//                       <LoaderCircle
//                         size={34}
//                         className="animate-spin text-[#2759A2]"
//                       />
//                       <p className="mt-3 text-sm">
//                         Checking revert eligibility...
//                       </p>
//                     </div>
//                   ) : revertSuccess ? (
//                     <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                       <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
//                       <span>{revertSuccess}</span>
//                     </div>
//                   ) : (
//                     <>
//                       {revertError && (
//                         <div className="mb-4 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                           <FileWarning size={20} className="mt-0.5 shrink-0" />
//                           <span>{revertError}</span>
//                         </div>
//                       )}

//                       {eligibilityCheck &&
//                         !eligibilityCheck.eligible &&
//                         eligibilityCheck.details && (
//                           <div className="mb-5">
//                             <h3 className="mb-3 text-sm font-semibold text-gray-800">
//                               Revert Eligibility Details:
//                             </h3>

//                             <div className="overflow-x-auto rounded-sm border border-[#e1e4e8]">
//                               <table className="w-full min-w-[600px] border-collapse text-sm">
//                                 <thead>
//                                   <tr className="bg-[#f1f3f5] text-left">
//                                     <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                                       Product
//                                     </th>
//                                     <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                                       Status
//                                     </th>
//                                     <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                                       Message
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {eligibilityCheck.details.items?.map(
//                                     (detail, index) => (
//                                       <tr
//                                         key={index}
//                                         className="border-b border-gray-100"
//                                       >
//                                         <td className="px-4 py-3 text-gray-800">
//                                           {detail.product}
//                                         </td>
//                                         <td className="px-3 py-3">
//                                           <span
//                                             className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                                               detail.status === 'pending_damage'
//                                                 ? 'bg-yellow-100 text-yellow-800'
//                                                 : 'bg-red-100 text-red-700'
//                                             }`}
//                                           >
//                                             {detail.status}
//                                           </span>
//                                         </td>
//                                         <td className="px-3 py-3 text-[#343a40]">
//                                           {detail.message}
//                                         </td>
//                                       </tr>
//                                     ),
//                                   )}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         )}

//                       {eligibilityCheck?.eligible && itemToRevert && (
//                         <>
//                           <p className="mb-4 text-sm text-gray-700">
//                             Are you sure you want to revert this damage item?
//                           </p>

//                           <div className="mb-5 overflow-hidden rounded-md border border-[#e1e4e8]">
//                             <table className="w-full border-collapse text-sm">
//                               <tbody>
//                                 <tr className="border-b border-gray-100">
//                                   <th className="w-[30%] bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Product
//                                   </th>
//                                   <td className="px-4 py-3 font-semibold text-gray-800">
//                                     {itemToRevert.product}
//                                   </td>
//                                 </tr>

//                                 <tr className="border-b border-gray-100">
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Quantity
//                                   </th>
//                                   <td className="px-3 py-3">
//                                     <span className="font-semibold text-gray-800">
//                                       {itemToRevert.qty}
//                                     </span>
//                                     {itemToRevert.trackSerialNumber === 'Yes' &&
//                                       itemToRevert.serialNumberCount > 0 && (
//                                         <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
//                                           {itemToRevert.serialNumberCount} serials
//                                         </span>
//                                       )}
//                                   </td>
//                                 </tr>

//                                 <tr className="border-b border-gray-100">
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Branch
//                                   </th>
//                                   <td className="px-3 py-3 text-[#171717]">
//                                     {itemToRevert.center}
//                                   </td>
//                                 </tr>

//                                 <tr
//                                   className={
//                                     itemToRevert.damageReason
//                                       ? 'border-b border-gray-100'
//                                       : ''
//                                   }
//                                 >
//                                   <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                     Date
//                                   </th>
//                                   <td className="px-3 py-3 text-[#171717]">
//                                     {formatDate(itemToRevert.date)}
//                                   </td>
//                                 </tr>

//                                 {itemToRevert.damageReason && (
//                                   <tr>
//                                     <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
//                                       Damage Reason
//                                     </th>
//                                     <td className="px-3 py-3 text-[#171717]">
//                                       {itemToRevert.damageReason}
//                                     </td>
//                                   </tr>
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>

//                           <div className="mb-4">
//                             <label
//                               htmlFor="revertRemark"
//                               className="mb-2 block text-sm font-medium text-gray-700"
//                             >
//                               Revert Remark
//                               <span className="ml-1 text-gray-400">
//                                 (Optional)
//                               </span>
//                             </label>

//                             <input
//                               id="revertRemark"
//                               type="text"
//                               value={revertRemark}
//                               onChange={(e) => setRevertRemark(e.target.value)}
//                               placeholder="Enter reason for reverting this damage"
//                               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-blue-100"
//                             />
//                           </div>

//                           <div className="flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
//                             <FileWarning size={19} className="mt-0.5 shrink-0" />
//                             <p>
//                               <strong>Note:</strong> This will move the item back
//                               to available stock and remove it from faulty stock.
//                             </p>
//                           </div>
//                         </>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 <div className="flex justify-end gap-2 border-t border-[#e1e4e8] bg-white px-5 py-4">
//                   <button
//                     type="button"
//                     onClick={() => setRevertModalVisible(false)}
//                     disabled={revertLoading || checkingEligibility}
//                     className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     {revertSuccess ? 'Close' : 'Cancel'}
//                   </button>

//                   {!revertSuccess && eligibilityCheck?.eligible && (
//                     <button
//                       type="button"
//                       onClick={confirmRevert}
//                       disabled={revertLoading || checkingEligibility}
//                       className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4b8c] disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                       {revertLoading ? (
//                         <>
//                           <LoaderCircle size={16} className="animate-spin" />
//                           Reverting...
//                         </>
//                       ) : (
//                         <>
//                           <RotateCcw size={16} />
//                           Confirm Revert
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* MAIN TABLE CARD */}
//           <div className="w-full overflow-hidden rounded-sm border border-[#e1e4e8] border-t-4 border-t-[#2759A2] bg-white shadow-sm">
//             {/* TOP ACTION BAR */}
//             <div className="flex min-h-[54px] items-center justify-between border-b border-[#e1e4e8] bg-white px-4 py-3">
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setSearchModalVisible(true)}
//                   className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4b8c]"
//                 >
//                   <Search size={16} />
//                   Search
//                 </button>

//                 {isSearchActive() && (
//                   <button
//                     type="button"
//                     onClick={handleResetSearch}
//                     className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4b8c]"
//                   >
//                     <ZoomOut size={16} />
//                     Reset Search
//                   </button>
//                 )}
//               </div>

//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             </div>

//             {/* TABLE CONTENT */}
//             <div className="p-4">
//               <div className="mb-4 flex items-center justify-between gap-4">
//                 <div className="text-[16px] text-[#6c757d]">
//                   Showing{' '}
//                   <span className="font-medium text-[#6c757d]">
//                     {filteredData.length}
//                   </span>{' '}
//                   items
//                 </div>

//                 <div className="flex w-[250px] items-center gap-2">
//                   <label
//                     htmlFor="revert-damage-search"
//                     className="whitespace-nowrap text-sm font-semibold text-[#171717]"
//                   >
//                     Search:
//                   </label>
//                   <div className="relative flex-1">
//                     <Search
//                       size={15}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                       id="revert-damage-search"
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="h-9 w-full rounded-sm border border-[#d7dce1] bg-white pl-9 pr-3 text-sm text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]/20"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* VERTICAL TABLE SCROLL ONLY */}
//               <div className="max-h-[520px] overflow-y-auto overflow-x-hidden border border-[#e1e4e8]">
//                 <table className="w-full table-fixed border-collapse text-sm">
//                   <thead className="sticky top-0 z-20">
//                     <tr className="bg-[#f1f3f5] text-left">
//                       <th
//                         onClick={() => handleSort('date')}
//                         className="w-[8%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Date {getSortIcon('date')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('center')}
//                         className="w-[8%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Branch {getSortIcon('center')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('product')}
//                         className="w-[39%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Product {getSortIcon('product')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('damageReason')}
//                         className="w-[15%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Damage Reason {getSortIcon('damageReason')}
//                       </th>
//                       <th
//                         onClick={() => handleSort('qty')}
//                         className="w-[5%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
//                       >
//                         Qty {getSortIcon('qty')}
//                       </th>
//                       <th className="w-[9%] border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                         Status
//                       </th>
//                       <th className="w-[16%] border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredData.length > 0 ? (
//                       <>
//                         {filteredData.map((item) => {
//                           const eligibility = itemEligibility[item._id];
//                           const isEligible = eligibility?.eligible === true;
//                           const isChecking =
//                             checkingEligibilityFor === item._id;

//                           return (
//                             <tr
//                               key={item._id}
//                               className="border-b border-white odd:bg-[#f0f0f0] even:bg-white hover:bg-[#e5f0ff]"
//                             >
//                               <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#171717]">
//                                 {formatDate(item.date)}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#171717]">
//                                 {item.center}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3 font-medium text-[#171717]">
//                                 {item.product}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#343a40]">
//                                 {item.damageReason || 'N/A'}
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3">
//                                 <div className="flex items-center gap-2">
//                                   <span className="font-semibold text-gray-800">
//                                     {item.qty}
//                                   </span>

//                                   {item.trackSerialNumber === 'Yes' &&
//                                     item.serialNumberCount > 0 && (
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleShowSerialNumbers(item)
//                                         }
//                                         title={`Click to view ${item.serialNumberCount} serial number(s)`}
//                                         className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#eaf2ff] text-[#2759A2] transition hover:bg-[#dceaff]"
//                                       >
//                                         <List size={18} strokeWidth={2} />
//                                       </button>
//                                     )}
//                                 </div>
//                               </td>

//                               <td className="border-r border-[#e6e6e6] px-3 py-3">
//                                 {isChecking ? (
//                                   <span className="inline-flex items-center gap-2 rounded-md bg-[#eaf2ff] px-2.5 py-1 text-xs font-medium text-[#2759A2]">
//                                     <LoaderCircle
//                                       size={13}
//                                       className="animate-spin"
//                                     />
//                                     Checking...
//                                   </span>
//                                 ) : eligibility ? (
//                                   <span
//                                     className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
//                                       isEligible
//                                         ? 'bg-[#16a34a] text-white'
//                                         : 'bg-gray-100 text-gray-600'
//                                     }`}
//                                   >
//                                     {isEligible ? 'Pending' : 'Processed'}
//                                   </span>
//                                 ) : (
//                                   <span className="inline-flex rounded-md bg-[#eeeeee] px-2.5 py-1 text-xs font-medium text-[#777]">
//                                     Checking...
//                                   </span>
//                                 )}
//                               </td>

//                               <td className="px-3 py-3">
//                                 <button
//                                   type="button"
//                                   title={getRevertButtonTooltip(item)}
//                                   onClick={() => handleRevertClick(item)}
//                                   disabled={
//                                     !isEligible ||
//                                     revertLoading ||
//                                     isChecking
//                                   }
//                                   className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
//                                     isEligible
//                                       ? 'bg-[#2759A2] text-white hover:bg-[#1f4b8c]'
//                                       : 'bg-gray-200 text-gray-500'
//                                   }`}
//                                 >
//                                   {isChecking ? (
//                                     <LoaderCircle
//                                       size={15}
//                                       className="animate-spin"
//                                     />
//                                   ) : isEligible ? (
//                                     <RotateCcw size={15} />
//                                   ) : (
//                                     <Ban size={15} />
//                                   )}
//                                   {isEligible ? 'Revert' : 'Cannot Revert'}
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}

//                         <tr className="bg-[#e5f1df]">
//                           <td
//                             colSpan={5}
//                             className="px-3 py-3 text-right font-semibold text-[#171717]"
//                           >
//                             Total Quantity:
//                           </td>
//                           <td
//                             colSpan={2}
//                             className="px-3 py-3 font-bold text-[#171717]"
//                           >
//                             {totals.total.toFixed(2)}
//                           </td>
//                         </tr>
//                       </>
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan={7}
//                           className="px-3 py-12 text-center text-sm text-[#777]"
//                         >
//                           No completed damage records found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default RevertDamage;


import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Ban,
  CheckCircle2,
  List,
  FileWarning,
  LoaderCircle,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
  ZoomOut,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import Pagination from '../../utils/Pagination';
import SearchCenterStock from '../Report/SearchCenterStock';

const RevertDamage = () => {
  const [data, setData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [resellers, setResellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeSearch, setActiveSearch] = useState({
    product: '',
    center: '',
    usageType: 'Damage',
    status: 'completed',
    createdBy: '',
    startDate: '',
    endDate: '',
  });

  const [serialModalVisible, setSerialModalVisible] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState([]);

  const [revertModalVisible, setRevertModalVisible] =
    useState(false);
  const [itemToRevert, setItemToRevert] = useState(null);

  const [revertLoading, setRevertLoading] =
    useState(false);
  const [revertSuccess, setRevertSuccess] =
    useState(null);
  const [revertError, setRevertError] =
    useState(null);
  const [revertRemark, setRevertRemark] =
    useState('');

  const [eligibilityCheck, setEligibilityCheck] =
    useState(null);
  const [checkingEligibility, setCheckingEligibility] =
    useState(false);

  const [itemEligibility, setItemEligibility] =
    useState({});
  const [checkingEligibilityFor, setCheckingEligibilityFor] =
    useState(null);

  const location = useLocation();

  /* =========================================================
     URL PARAMS
  ========================================================== */

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(
      location.search
    );

    return {
      product: searchParams.get('product'),
      center: searchParams.get('center'),
      usageType: searchParams.get('usageType'),
      productName: searchParams.get('productName'),
      centerName: searchParams.get('centerName'),
      month: searchParams.get('month'),
    };
  };

  /* =========================================================
     INITIALIZE DATA
  ========================================================== */

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        const urlParams = getUrlParams();

        await Promise.all([
          fetchCenters(),
          fetchProducts(),
          fetchResellers(),
        ]);

        let searchParams = {
          usageType: 'Damage',
          status: 'completed',
        };

        if (
          urlParams.product ||
          urlParams.center ||
          urlParams.usageType
        ) {
          searchParams = {
            ...searchParams,
            product: urlParams.product || '',
            center: urlParams.center || '',
            usageType:
              urlParams.usageType || 'Damage',
            status: 'completed',
            startDate: '',
            endDate: '',
            createdBy: '',
          };

          setActiveSearch(searchParams);

          if (
            urlParams.productName &&
            urlParams.centerName &&
            urlParams.usageType
          ) {
            document.title =
              `Revert Damage - ${decodeURIComponent(
                urlParams.productName
              )} at ${decodeURIComponent(
                urlParams.centerName
              )}`;
          }
        } else {
          searchParams = {
            usageType: 'Damage',
            status: 'completed',
          };

          setActiveSearch(searchParams);
        }

        await fetchData(searchParams, 1);
      } catch (error) {
        console.error(
          'Error initializing data:',
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.search]);

  /* =========================================================
     FLATTEN API DATA
  ========================================================== */

  useEffect(() => {
    const transactions = Array.isArray(data) ? data : [];
    const flattened = [];

    transactions.forEach((transaction) => {
      const items = Array.isArray(transaction?.items)
        ? transaction.items
        : [];

      items.forEach((item, index) => {
        const product =
          item?.product && typeof item.product === 'object'
            ? item.product
            : {};

        const serialNumbers = Array.isArray(item?.serialNumbers)
          ? item.serialNumbers
          : Array.isArray(item?.serialNumber)
            ? item.serialNumber
            : [];

        const transactionId =
          transaction?._id ||
          transaction?.id ||
          transaction?.transactionId ||
          '';

        const itemId =
          item?._id ||
          item?.id ||
          item?.itemId ||
          index;

        flattened.push({
          _id: `${transactionId}_${itemId}`,
          transactionId,
          itemId,
          date: transaction?.date || transaction?.createdAt || '',
          usageType: transaction?.usageType || 'Damage',
          center:
            transaction?.center?.centerName ||
            transaction?.center?.name ||
            transaction?.centerName ||
            (typeof transaction?.center === 'string' ? transaction.center : '') ||
            '',
          centerId:
            transaction?.center?._id ||
            transaction?.center?.id ||
            transaction?.centerId ||
            '',
          toCenter:
            transaction?.toCenter?.centerName ||
            transaction?.toCenter?.name ||
            '',
          product:
            product?.productTitle ||
            product?.name ||
            item?.productTitle ||
            (typeof item?.product === 'string' ? item.product : '') ||
            '',
          productId:
            product?._id ||
            product?.productId ||
            product?.id ||
            item?.productId ||
            '',
          productCode:
            product?.productCode ||
            item?.productCode ||
            '',
          qty: Number(item?.quantity ?? item?.qty ?? 0),
          trackSerialNumber:
            product?.trackSerialNumber ||
            item?.trackSerialNumber ||
            'No',
          serialNumbers,
          serialNumberCount: serialNumbers.length,
          status: transaction?.status || '',
          createdBy:
            transaction?.createdBy?.email ||
            transaction?.createdBy?.name ||
            '',
          createdAt: transaction?.createdAt || '',
          remark: transaction?.remark || '',
          damageReason:
            item?.damageReason ||
            transaction?.damageReason ||
            item?.reason ||
            '',
          approvedBy:
            transaction?.approvedBy?.name ||
            transaction?.approvedBy?.email ||
            '',
          approvalDate: transaction?.approvalDate || '',
          canRevert: true,
        });
      });
    });

    setFlattenedData(flattened);

    if (flattened.length > 0) {
      checkAllItemsEligibility(flattened);
    } else {
      setItemEligibility({});
    }
  }, [data]);

  /* =========================================================
     CHECK ALL ITEMS ELIGIBILITY
  ========================================================== */

  const checkAllItemsEligibility = async (
    items
  ) => {
    const eligibilityMap = {};

    const batchSize = 5;

    for (
      let i = 0;
      i < items.length;
      i += batchSize
    ) {
      const batch = items.slice(
        i,
        i + batchSize
      );

      await Promise.all(
        batch.map(async (item) => {
          try {
            const response =
              await axiosInstance.get(
                `/stockusage/${item.transactionId}/check-revert`
              );

            if (response.data?.success) {
              // Support both { eligible } and { data: { eligible } } responses.
              const result = response.data.data ?? response.data;
              eligibilityMap[item._id] = {
                eligible: result.eligible === true,
                allItemsPendingDamage: result.allItemsPendingDamage,
                details: result.details,
              };
            } else {
              eligibilityMap[item._id] = {
                eligible: false,
                error: true,
                message: response.data?.message || 'Eligibility check failed',
              };
            }
          } catch (err) {
            console.error(
              `Error checking eligibility for item ${item._id}:`,
              err
            );

            eligibilityMap[item._id] = {
              eligible: false,
              error: true,
              message:
                err.response?.data?.message ||
                `Eligibility check failed${err.response?.status ? ` (${err.response.status})` : ''}`,
            };
          }
        })
      );
    }

    setItemEligibility(
      eligibilityMap
    );
  };

  /* =========================================================
     FETCH DATA
  ========================================================== */

  const fetchData = async (
    searchParams = {},
    page = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params =
        new URLSearchParams();

      const urlParams =
        getUrlParams();

      const productId =
        urlParams.product ||
        searchParams.product;

      const centerId =
        urlParams.center ||
        searchParams.center;

      const usageType =
        urlParams.usageType ||
        searchParams.usageType ||
        'Damage';

      if (productId) {
        params.append(
          'product',
          productId
        );
      }

      if (centerId) {
        params.append(
          'center',
          centerId
        );
      }

      if (usageType) {
        params.append(
          'usageType',
          usageType
        );
      }

      params.append(
        'status',
        'completed'
      );

      if (searchParams.createdBy) {
        params.append(
          'createdBy',
          searchParams.createdBy
        );
      }

      if (searchParams.startDate) {
        params.append(
          'startDate',
          searchParams.startDate
        );
      }

      if (searchParams.endDate) {
        params.append(
          'endDate',
          searchParams.endDate
        );
      }

      if (urlParams.month) {
        const [year, month] =
          urlParams.month.split('-');

        const monthStart = `${year}-${month.padStart(
          2,
          '0'
        )}-01`;

        const lastDay = new Date(
          parseInt(year, 10),
          parseInt(month, 10),
          0
        ).getDate();

        const monthEnd = `${year}-${month.padStart(
          2,
          '0'
        )}-${lastDay}`;

        params.append(
          'startDate',
          monthStart
        );

        params.append(
          'endDate',
          monthEnd
        );
      }

      params.append('page', String(page));
      // Match the legacy page's 100-record page size when supported by the API.
      params.append('limit', '100');

      const url = `/stockusage?${params.toString()}`;

      const response =
        await axiosInstance.get(
          url
        );

      if (response.data?.success) {
        // New backend response is nested: data.records + data.pagination.
        // Keep compatibility with endpoints returning data as an array.
        const payload = response.data.data;
        const records = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.records)
            ? payload.records
            : Array.isArray(response.data.records)
              ? response.data.records
              : [];

        const pagination =
          payload?.pagination ||
          response.data.pagination ||
          {};

        setData(records);
        setCurrentPage(
          Number(
            pagination.page ??
            pagination.currentPage ??
            page
          ) || 1
        );
        setTotalPages(
          Math.max(
            1,
            Number(pagination.totalPages ?? pagination.pages ?? 1) || 1
          )
        );
      } else {
        const errorMessage =
          response.data.message ||
          'API returned unsuccessful response';

        setError(errorMessage);
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data
            ?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;

        setError(errorMessage);
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.'
        );
      } else {
        setError(
          err.message ||
            'An error occurred while fetching data'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     MASTER DATA
  ========================================================== */

  const fetchCenters = async () => {
    try {
      const response =
        await axiosInstance.get(
          '/centers'
        );

      if (response.data.success) {
        setCenters(
          response.data.data
        );
      }
    } catch (error) {
      console.error(
        'Error fetching centers:',
        error
      );
    }
  };

  const fetchProducts = async () => {
    try {
      const response =
        await axiosInstance.get(
          '/products/all'
        );

      if (response.data.success) {
        setProducts(
          response.data.data
        );
      }
    } catch (error) {
      console.error(
        'Error fetching products:',
        error
      );
    }
  };

  const fetchResellers = async () => {
    try {
      const response =
        await axiosInstance.get(
          '/resellers'
        );

      if (response.data.success) {
        setResellers(
          response.data.data
        );
      }
    } catch (error) {
      console.error(
        'Error fetching resellers:',
        error
      );
    }
  };

  /* =========================================================
     PAGINATION
  ========================================================== */

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    fetchData(
      activeSearch,
      page
    );
  };

  /* =========================================================
     TOTALS
  ========================================================== */

  const calculateTotals = () => {
    const totals = {
      total: 0,
    };

    filteredData.forEach(
      (item) => {
        totals.total +=
          parseFloat(
            item.qty || 0
          );
      }
    );

    return totals;
  };

  /* =========================================================
     SORTING
  ========================================================== */

  const handleSort = (key) => {
    let direction =
      'ascending';

    if (
      sortConfig.key === key &&
      sortConfig.direction ===
        'ascending'
    ) {
      direction =
        'descending';
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedData =
      [...flattenedData].sort(
        (a, b) => {
          let aValue = a[key];
          let bValue = b[key];

          if (
            aValue < bValue
          ) {
            return direction ===
              'ascending'
              ? -1
              : 1;
          }

          if (
            aValue > bValue
          ) {
            return direction ===
              'ascending'
              ? 1
              : -1;
          }

          return 0;
        }
      );

    setFlattenedData(
      sortedData
    );
  };

  const getSortIcon = (
    key
  ) => {
    if (
      sortConfig.key !== key
    ) {
      return null;
    }

    return sortConfig.direction ===
      'ascending' ? (
      <ArrowUp
        size={14}
        className="ml-1 inline"
      />
    ) : (
      <ArrowDown
        size={14}
        className="ml-1 inline"
      />
    );
  };

  /* =========================================================
     SEARCH
  ========================================================== */

  const handleSearch = (
    searchData
  ) => {
    setActiveSearch(
      searchData
    );

    fetchData(
      {
        ...searchData,
        usageType: 'Damage',
        status: 'completed',
      },
      1
    );
  };

  const handleResetSearch =
    () => {
      const resetSearch = {
        product: '',
        center: '',
        usageType: 'Damage',
        status: 'completed',
      };

      setActiveSearch(
        resetSearch
      );

      setSearchTerm('');

      fetchData(
        {
          usageType: 'Damage',
          status: 'completed',
        },
        1
      );
    };

  const isSearchActive =
    () => {
      return Object.values(
        activeSearch
      ).some(
        (value) =>
          value !== '' &&
          value !== 'Damage' &&
          value !== 'completed'
      );
    };

  /* =========================================================
     FRONTEND SEARCH
  ========================================================== */

  const filteredData =
    flattenedData.filter(
      (item) => {
        if (searchTerm) {
          const searchLower =
            searchTerm.toLowerCase();

          return (
            (item.date &&
              new Date(
                item.date
              )
                .toLocaleDateString()
                .toLowerCase()
                .includes(
                  searchLower
                )) ||
            (item.usageType &&
              item.usageType
                .toLowerCase()
                .includes(
                  searchLower
                )) ||
            (item.center &&
              item.center
                .toLowerCase()
                .includes(
                  searchLower
                )) ||
            (item.product &&
              item.product
                .toLowerCase()
                .includes(
                  searchLower
                )) ||
            (item.damageReason &&
              item.damageReason
                .toLowerCase()
                .includes(
                  searchLower
                )) ||
            (item.qty &&
              item.qty
                .toString()
                .includes(
                  searchLower
                ))
          );
        }

        return true;
      }
    );

  /* =========================================================
     SERIAL NUMBERS
  ========================================================== */

  const handleShowSerialNumbers =
    (item) => {
      if (
        item.trackSerialNumber ===
          'Yes' &&
        item.serialNumbers &&
        item.serialNumbers
          .length > 0
      ) {
        setSelectedItem(
          item
        );

        setSelectedSerials(
          item.serialNumbers
        );

        setSerialModalVisible(
          true
        );
      }
    };

  /* =========================================================
     ELIGIBILITY CHECK
  ========================================================== */

  const checkRevertEligibility =
    async (item) => {
      try {
        setCheckingEligibility(
          true
        );

        setCheckingEligibilityFor(
          item._id
        );

        setEligibilityCheck(
          null
        );

        const response =
          await axiosInstance.get(
            `/stockusage/${item.transactionId}/check-revert`
          );

        if (response.data?.success) {
          const result = response.data.data ?? response.data;
          setEligibilityCheck(result);

          setItemEligibility((prev) => ({
            ...prev,
            [item._id]: {
              eligible: result.eligible === true,
              allItemsPendingDamage: result.allItemsPendingDamage,
              details: result.details,
            },
          }));

          if (result.eligible === true) {
            setItemToRevert(
              item
            );

            setRevertModalVisible(
              true
            );

            setRevertSuccess(
              null
            );

            setRevertError(
              null
            );

            setRevertRemark(
              ''
            );
          } else {
            setRevertError(
              response.data
                .message ||
                'This item cannot be reverted'
            );

            setRevertModalVisible(
              true
            );
          }
        } else {
          setRevertError(
            response.data
              .message ||
              'Failed to check eligibility'
          );

          setRevertModalVisible(
            true
          );
        }
      } catch (err) {
        console.error(
          'Error checking eligibility:',
          err
        );

        setRevertError(
          err.response?.data
            ?.message ||
            err.message ||
            'Failed to check revert eligibility'
        );

        setRevertModalVisible(
          true
        );
      } finally {
        setCheckingEligibility(
          false
        );

        setCheckingEligibilityFor(
          null
        );
      }
    };

  const handleRevertClick = (
    item
  ) => {
    checkRevertEligibility(
      item
    );
  };

  /* =========================================================
     CONFIRM REVERT
  ========================================================== */

  const confirmRevert =
    async () => {
      if (!itemToRevert) {
        return;
      }

      try {
        setRevertLoading(
          true
        );

        setRevertError(null);

        const user =
          JSON.parse(
            localStorage.getItem(
              'user'
            ) || 'null'
          );

        const response =
          await axiosInstance.put(
            `/stockusage/${itemToRevert.transactionId}/revert-damage`,
            {
              revertRemark:
                revertRemark ||
                `Reverted by ${
                  user?.name || 'user'
                }`,
            }
          );

        if (
          response.data.success
        ) {
          setRevertSuccess(
            'Item successfully reverted from damage stock'
          );

          setItemEligibility(
            (prev) => ({
              ...prev,
              [itemToRevert._id]: {
                eligible: false,
                reverted: true,
              },
            })
          );

          setTimeout(() => {
            setRevertModalVisible(
              false
            );

            fetchData(
              activeSearch,
              currentPage
            );
          }, 1500);
        } else {
          setRevertError(
            response.data
              .message ||
              'Failed to revert item'
          );
        }
      } catch (err) {
        console.error(
          'Error reverting damage:',
          err
        );

        setRevertError(
          err.response?.data
            ?.message ||
            err.message ||
            'An error occurred while reverting'
        );
      } finally {
        setRevertLoading(
          false
        );
      }
    };

  /* =========================================================
     REVERT HELPERS
  ========================================================== */

  const canItemBeReverted =
    (item) => {
      const eligibility =
        itemEligibility[
          item._id
        ];

      return (
        eligibility?.eligible ===
        true
      );
    };

  const getRevertButtonTooltip =
    (item) => {
      const eligibility =
        itemEligibility[
          item._id
        ];

      if (!eligibility) {
        return 'Checking eligibility...';
      }

      if (
        eligibility.eligible
      ) {
        return 'Click to revert this item';
      }

      if (eligibility.error) {
        return 'Error checking eligibility';
      }

      return 'This item cannot be reverted (already processed)';
    };

  /* =========================================================
     FORMAT DATE
  ========================================================== */

  const formatDate = (
    dateString
  ) => {
    if (!dateString) {
      return '';
    }

    const date =
      new Date(dateString);

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );
  };

  /* =========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <LoaderCircle
            size={36}
            className="animate-spin text-[#2759A2]"
          />

          <span className="text-sm">
            Loading damage records...
          </span>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const totals =
    calculateTotals();

  return (
    <>
      <style>{`
        @keyframes revertDamageDrop {
          0% {
            opacity: 0;
            transform: translateY(-45px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="min-h-screen w-full bg-[#f5f6f8] px-2 py-2 md:px-3">
        <div className="w-full bg-[#f5f6f8]">
          {/* PAGE TITLE */}
          <div className="mb-7 px-1">
            <h1 className="text-[24px] font-normal leading-tight text-[#212529]">
              Revert Damage Products
            </h1>
          </div>

          {/* SEARCH MODAL */}
          <SearchCenterStock
            visible={searchModalVisible}
            onClose={() => setSearchModalVisible(false)}
            onSearch={handleSearch}
            centers={centers}
            products={products}
            resellers={resellers}
            initialUsageType="Damage"
            showStatusFilter={false}
          />

          {/* SERIAL MODAL */}
          {serialModalVisible && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
              <div
                className="mt-8 flex max-h-[calc(100vh-64px)] w-full max-w-2xl flex-col overflow-hidden rounded-md border-t-4 border-[#2759A2] bg-white shadow-2xl"
                style={{
                  animation:
                    'revertDamageDrop 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
                }}
              >
                <div className="flex items-center justify-between border-b border-[#e1e4e8] px-5 py-4">
                  <h2 className="text-lg font-semibold text-[#343a40]">
                    Serial Numbers - {selectedItem?.product}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSerialModalVisible(false)}
                    className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="overflow-y-auto p-5">
                  {selectedItem && (
                    <div className="overflow-x-auto rounded-sm border border-[#e1e4e8]">
                      <table className="w-full min-w-[500px] border-collapse text-sm">
                        <thead>
                          <tr className="bg-[#f1f3f5] text-left">
                            <th className="w-[15%] border-b border-[#dfe3e7] px-4 py-3 font-bold text-[#171717]">
                              SR No.
                            </th>
                            <th className="w-[85%] border-b border-[#dfe3e7] px-4 py-3 font-bold text-[#171717]">
                              Serial Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedSerials.length > 0 ? (
                            selectedSerials.map((serial, index) => (
                              <tr
                                key={`${serial}-${index}`}
                                className="border-b border-gray-100"
                              >
                                <td className="px-4 py-3 font-semibold text-gray-800">
                                  {index + 1}
                                </td>
                                <td className="px-3 py-3">
                                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-medium text-gray-800">
                                    {serial}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={2}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                              >
                                No serial numbers available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex justify-end border-t border-[#e1e4e8] bg-white px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setSerialModalVisible(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REVERT MODAL */}
          {revertModalVisible && (
            <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
              <div
                className="mt-8 flex max-h-[calc(100vh-64px)] w-full max-w-3xl flex-col overflow-hidden rounded-md border-t-4 border-[#2759A2] bg-white shadow-2xl"
                style={{
                  animation:
                    'revertDamageDrop 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
                }}
              >
                <div className="flex items-center justify-between border-b border-[#e1e4e8] px-5 py-4">
                  <h2 className="text-lg font-semibold text-[#343a40]">
                    {revertSuccess
                      ? 'Revert Successful'
                      : revertError && !eligibilityCheck?.eligible
                        ? 'Cannot Revert'
                        : 'Confirm Revert'}
                  </h2>

                  <button
                    type="button"
                    onClick={() => setRevertModalVisible(false)}
                    disabled={revertLoading || checkingEligibility}
                    className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="overflow-y-auto p-5">
                  {checkingEligibility ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center text-gray-600">
                      <LoaderCircle
                        size={34}
                        className="animate-spin text-[#2759A2]"
                      />
                      <p className="mt-3 text-sm">
                        Checking revert eligibility...
                      </p>
                    </div>
                  ) : revertSuccess ? (
                    <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                      <span>{revertSuccess}</span>
                    </div>
                  ) : (
                    <>
                      {revertError && (
                        <div className="mb-4 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          <FileWarning size={20} className="mt-0.5 shrink-0" />
                          <span>{revertError}</span>
                        </div>
                      )}

                      {eligibilityCheck &&
                        !eligibilityCheck.eligible &&
                        eligibilityCheck.details && (
                          <div className="mb-5">
                            <h3 className="mb-3 text-sm font-semibold text-gray-800">
                              Revert Eligibility Details:
                            </h3>

                            <div className="overflow-x-auto rounded-sm border border-[#e1e4e8]">
                              <table className="w-full min-w-[600px] border-collapse text-sm">
                                <thead>
                                  <tr className="bg-[#f1f3f5] text-left">
                                    <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
                                      Product
                                    </th>
                                    <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
                                      Status
                                    </th>
                                    <th className="border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
                                      Message
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {eligibilityCheck.details.items?.map(
                                    (detail, index) => (
                                      <tr
                                        key={index}
                                        className="border-b border-gray-100"
                                      >
                                        <td className="px-4 py-3 text-gray-800">
                                          {detail.product}
                                        </td>
                                        <td className="px-3 py-3">
                                          <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                              detail.status === 'pending_damage'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                          >
                                            {detail.status}
                                          </span>
                                        </td>
                                        <td className="px-3 py-3 text-[#343a40]">
                                          {detail.message}
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      {eligibilityCheck?.eligible && itemToRevert && (
                        <>
                          <p className="mb-4 text-sm text-gray-700">
                            Are you sure you want to revert this damage item?
                          </p>

                          <div className="mb-5 overflow-hidden rounded-md border border-[#e1e4e8]">
                            <table className="w-full border-collapse text-sm">
                              <tbody>
                                <tr className="border-b border-gray-100">
                                  <th className="w-[30%] bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
                                    Product
                                  </th>
                                  <td className="px-4 py-3 font-semibold text-gray-800">
                                    {itemToRevert.product}
                                  </td>
                                </tr>

                                <tr className="border-b border-gray-100">
                                  <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
                                    Quantity
                                  </th>
                                  <td className="px-3 py-3">
                                    <span className="font-semibold text-gray-800">
                                      {itemToRevert.qty}
                                    </span>
                                    {itemToRevert.trackSerialNumber === 'Yes' &&
                                      itemToRevert.serialNumberCount > 0 && (
                                        <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                                          {itemToRevert.serialNumberCount} serials
                                        </span>
                                      )}
                                  </td>
                                </tr>

                                <tr className="border-b border-gray-100">
                                  <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
                                    Branch
                                  </th>
                                  <td className="px-3 py-3 text-[#171717]">
                                    {itemToRevert.center}
                                  </td>
                                </tr>

                                <tr
                                  className={
                                    itemToRevert.damageReason
                                      ? 'border-b border-gray-100'
                                      : ''
                                  }
                                >
                                  <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
                                    Date
                                  </th>
                                  <td className="px-3 py-3 text-[#171717]">
                                    {formatDate(itemToRevert.date)}
                                  </td>
                                </tr>

                                {itemToRevert.damageReason && (
                                  <tr>
                                    <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
                                      Damage Reason
                                    </th>
                                    <td className="px-3 py-3 text-[#171717]">
                                      {itemToRevert.damageReason}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="revertRemark"
                              className="mb-2 block text-sm font-medium text-gray-700"
                            >
                              Revert Remark
                              <span className="ml-1 text-gray-400">
                                (Optional)
                              </span>
                            </label>

                            <input
                              id="revertRemark"
                              type="text"
                              value={revertRemark}
                              onChange={(e) => setRevertRemark(e.target.value)}
                              placeholder="Enter reason for reverting this damage"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-blue-100"
                            />
                          </div>

                          <div className="flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                            <FileWarning size={19} className="mt-0.5 shrink-0" />
                            <p>
                              <strong>Note:</strong> This will move the item back
                              to available stock and remove it from faulty stock.
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-[#e1e4e8] bg-white px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setRevertModalVisible(false)}
                    disabled={revertLoading || checkingEligibility}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {revertSuccess ? 'Close' : 'Cancel'}
                  </button>

                  {!revertSuccess && eligibilityCheck?.eligible && (
                    <button
                      type="button"
                      onClick={confirmRevert}
                      disabled={revertLoading || checkingEligibility}
                      className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4b8c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {revertLoading ? (
                        <>
                          <LoaderCircle size={16} className="animate-spin" />
                          Reverting...
                        </>
                      ) : (
                        <>
                          <RotateCcw size={16} />
                          Confirm Revert
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MAIN TABLE CARD */}
          <div className="w-full overflow-hidden rounded-sm border border-[#e1e4e8] border-t-4 border-t-[#2759A2] bg-white shadow-sm">
            {/* TOP ACTION BAR */}
            <div className="flex min-h-[54px] items-center justify-between border-b border-[#e1e4e8] bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSearchModalVisible(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4b8c]"
                >
                  <Search size={16} />
                  Search
                </button>

                {isSearchActive() && (
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4b8c]"
                  >
                    <ZoomOut size={16} />
                    Reset Search
                  </button>
                )}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            {/* TABLE CONTENT */}
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="text-[16px] text-[#6c757d]">
                  Showing{' '}
                  <span className="font-medium text-[#6c757d]">
                    {filteredData.length}
                  </span>{' '}
                  items
                </div>

                <div className="flex w-[250px] items-center gap-2">
                  <label
                    htmlFor="revert-damage-search"
                    className="whitespace-nowrap text-sm font-semibold text-[#171717]"
                  >
                    Search:
                  </label>
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="revert-damage-search"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full rounded-sm border border-[#d7dce1] bg-white pl-9 pr-3 text-sm text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]/20"
                    />
                  </div>
                </div>
              </div>

              {/* VERTICAL TABLE SCROLL ONLY */}
              <div className="max-h-[520px] overflow-y-auto overflow-x-hidden border border-[#e1e4e8]">
                <table className="w-full table-fixed border-collapse text-sm">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-[#f1f3f5] text-left">
                      <th
                        onClick={() => handleSort('date')}
                        className="w-[8%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
                      >
                        Date {getSortIcon('date')}
                      </th>
                      <th
                        onClick={() => handleSort('center')}
                        className="w-[8%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
                      >
                        Branch {getSortIcon('center')}
                      </th>
                      <th
                        onClick={() => handleSort('product')}
                        className="w-[39%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
                      >
                        Product {getSortIcon('product')}
                      </th>
                      <th
                        onClick={() => handleSort('damageReason')}
                        className="w-[15%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
                      >
                        Damage Reason {getSortIcon('damageReason')}
                      </th>
                      <th
                        onClick={() => handleSort('qty')}
                        className="w-[5%] cursor-pointer border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717] transition hover:bg-[#e5e8eb]"
                      >
                        Qty {getSortIcon('qty')}
                      </th>
                      <th className="w-[9%] border-b border-r border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
                        Status
                      </th>
                      <th className="w-[16%] border-b border-[#dfe3e7] px-3 py-3 font-bold text-[#171717]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.length > 0 ? (
                      <>
                        {filteredData.map((item) => {
                          const eligibility = itemEligibility[item._id];
                          const isEligible = eligibility?.eligible === true;
                          const isChecking =
                            checkingEligibilityFor === item._id;

                          return (
                            <tr
                              key={item._id}
                              className="border-b border-white odd:bg-[#f0f0f0] even:bg-white hover:bg-[#e5f0ff]"
                            >
                              <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#171717]">
                                {formatDate(item.date)}
                              </td>

                              <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#171717]">
                                {item.center}
                              </td>

                              <td className="border-r border-[#e6e6e6] px-3 py-3 font-medium text-[#171717]">
                                {item.product}
                              </td>

                              <td className="border-r border-[#e6e6e6] px-3 py-3 text-[#343a40]">
                                {item.damageReason || 'N/A'}
                              </td>

                              <td className="border-r border-[#e6e6e6] px-3 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-800">
                                    {item.qty}
                                  </span>

                                  {item.trackSerialNumber === 'Yes' &&
                                    item.serialNumberCount > 0 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleShowSerialNumbers(item)
                                        }
                                        title={`Click to view ${item.serialNumberCount} serial number(s)`}
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#eaf2ff] text-[#2759A2] transition hover:bg-[#dceaff]"
                                      >
                                        <List size={18} strokeWidth={2} />
                                      </button>
                                    )}
                                </div>
                              </td>

                              <td className="border-r border-[#e6e6e6] px-3 py-3">
                                {isChecking ? (
                                  <span className="inline-flex items-center gap-2 rounded-md bg-[#eaf2ff] px-2.5 py-1 text-xs font-medium text-[#2759A2]">
                                    <LoaderCircle
                                      size={13}
                                      className="animate-spin"
                                    />
                                    Checking...
                                  </span>
                                                        ) : eligibility ? (
                                  <span
                                    title={eligibility.message || (eligibility.error ? 'Could not verify revert eligibility' : '')}
                                    className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                                      isEligible
                                        ? 'bg-[#16a34a] text-white'
                                        : eligibility.error
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {isEligible ? 'Pending' : eligibility.error ? 'Check Failed' : 'Processed'}
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-md bg-[#eeeeee] px-2.5 py-1 text-xs font-medium text-[#777]">
                                    Checking...
                                  </span>
                                )}
                              </td>

                              <td className="px-3 py-3">
                                <button
                                  type="button"
                                  title={getRevertButtonTooltip(item)}
                                  onClick={() => handleRevertClick(item)}
                                  disabled={
                                    !isEligible ||
                                    revertLoading ||
                                    isChecking
                                  }
                                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    isEligible
                                      ? 'bg-[#2759A2] text-white hover:bg-[#1f4b8c]'
                                      : 'bg-gray-200 text-gray-500'
                                  }`}
                                >
                                  {isChecking ? (
                                    <LoaderCircle
                                      size={15}
                                      className="animate-spin"
                                    />
                                  ) : isEligible ? (
                                    <RotateCcw size={15} />
                                  ) : (
                                    <Ban size={15} />
                                  )}
                                  {isEligible ? 'Revert' : 'Cannot Revert'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                        <tr className="bg-[#e5f1df]">
                          <td
                            colSpan={5}
                            className="px-3 py-3 text-right font-semibold text-[#171717]"
                          >
                            Total Quantity:
                          </td>
                          <td
                            colSpan={2}
                            className="px-3 py-3 font-bold text-[#171717]"
                          >
                            {totals.total.toFixed(2)}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-3 py-12 text-center text-sm text-[#777]"
                        >
                          No completed damage records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default RevertDamage;