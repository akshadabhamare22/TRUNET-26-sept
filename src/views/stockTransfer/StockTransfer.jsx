// import React, { useState, useRef, useEffect } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FilePlus2,
//   MoreVertical,
//   Pencil,
//   RotateCcw,
//   Search,
//   Settings,
//   Trash2,
// } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';
// import { confirmDelete, showError, showSuccess } from '../../utils/sweetAlerts';
// import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
// import Pagination from '../../utils/Pagination';
// import usePermission from '../../utils/usePermission';
// import SearchTransferModel from './SearchTransferModel';

// const StockTransfer = () => {
//   const [customers, setCustomers] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [outlets, setOutlets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ 
//     keyword: '', 
//     center: '', 
//     outlet: '',
//     status: '',
//     startDate: '',
//     endDate: '',
//     statusStartDate: '',
//     statusEndDate: ''
//   });
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [activeTab, setActiveTab] = useState('open');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const dropdownRefs = useRef({});
//   const navigate = useNavigate();
//   const { hasAnyPermission } = usePermission(); 
  
//   const statusFilters = {
//     open: ['Confirmed', 'Submitted', 'Shipped', 'Incompleted', 'Draft','Admin_Approved'],
//     closed: ['Rejected', 'Completed','Admin_Rejected']
//   };

//   const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();

//       if (!searchParams.status) {
//         const statuses = statusFilters[tab];
//         statuses.forEach(status => {
//           params.append('status', status);
//         });
//       } else {
//         params.append('status', searchParams.status);
//       }
//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
//       if (searchParams.statusStartDate) {
//         params.append('startDate', searchParams.statusStartDate);
//       }
//       if (searchParams.statusEndDate) {
//         params.append('endDate', searchParams.statusEndDate);
//       }
//       if (searchParams.statusChanged) {
//         params.append('status', searchParams.statusChanged);
//       }
      
//       params.append('page', page);
      
//       const url = `/stocktransfer?${params.toString()}`;
//       console.log('API URL:', url);
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setCustomers(response.data.data);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         throw new Error('API returned unsuccessful response');
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
//       const response = await axiosInstance.get('/centers?centerType=Center');
//       if (response.data.success) {
//         setCenters(response.data.data);
//         const outletCenters = response.data.data.filter(center => 
//           center.centerType === 'Outlet' || center.centerType === 'outlet'
//         );
//         setOutlets(outletCenters);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, activeTab, page);
//   };

//   useEffect(() => {
//     fetchData(activeSearch, activeTab);
//   }, [activeTab]);
  
//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedCustomers = [...customers].sort((a, b) => {
//       let aValue = a;
//       let bValue = b;
      
//       if (key.includes('.')) {
//         const keys = key.split('.');
//         aValue = keys.reduce((obj, k) => obj && obj[k], a);
//         bValue = keys.reduce((obj, k) => obj && obj[k], b);
//       } else {
//         aValue = a[key];
//         bValue = b[key];
//       }
      
//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });

//     setCustomers(sortedCustomers);
//   };


//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, activeTab, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       keyword: '', 
//       center: '', 
//       outlet: '',
//       status: '',
//       startDate: '',
//       endDate: '',
//       statusStartDate: '',
//       statusEndDate: ''
//     });
//     setSearchTerm('');
//     fetchData({}, activeTab, 1);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setActiveSearch({ 
//       keyword: '', 
//       center: '', 
//       outlet: '',
//       status: '',
//       startDate: '',
//       endDate: '',
//       statusStartDate: '',
//       statusEndDate: ''
//     });
//     setSearchTerm('');
//   };

//   const filteredCustomers = customers.filter(customer => {
//     if (activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet) {
//       return true;
//     }
//     return Object.values(customer).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   const handleDeleteData = async (itemId) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/stocktransfer/${itemId}`);
//         setCustomers((prev) => prev.filter((c) => c._id !== itemId));
//         showSuccess('Data deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting date:', error);
//       }
//     }
//   };
  
//   const handleEditData = (itemId) => {
//     navigate(`/edit-stockTransfer/${itemId}`)
//   };

//   const toggleDropdown = (id) => {
//     setDropdownOpen(prev => {
//       const isCurrentlyOpen = !!prev[id];
//       const newState = {};
//       if (!isCurrentlyOpen) {
//         newState[id] = true;
//       }
//       return newState;
//     });
//   };
  
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
//         Error loading data: {error}
//       </div>
//     );
//   }

//   const handleClick = (itemId) => {
//     navigate(`/stockTransfer-details/${itemId}`);
//   };
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (activeSearch.keyword) {
//         params.append('search', activeSearch.keyword);
//       }
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.outlet) {
//         params.append('outlet', activeSearch.outlet);
//       }
//       if (activeSearch.status) {
//         params.append('status', activeSearch.status);
//       } else {
//         const statuses = statusFilters[activeTab];
//         statuses.forEach(status => {
//           params.append('status', status);
//         });
//       }
//       if (activeSearch.startDate) {
//         params.append('startDate', activeSearch.startDate);
//       }
//       if (activeSearch.endDate) {
//         params.append('endDate', activeSearch.endDate);
//       }
//       if (activeSearch.statusStartDate) {
//         params.append('startDate', activeSearch.statusStartDate);
//       }
//       if (activeSearch.statusEndDate) {
//         params.append('endDate', activeSearch.statusEndDate);
//       }
//       if (activeSearch.statusChanged) {
//         params.append('status', activeSearch.statusChanged);
//       }
//       const exportUrl = `/stocktransfer?${params.toString()}`;
//       console.log('Export URL:', exportUrl);
      
//       const response = await axiosInstance.get(exportUrl);
      
//       if (!response.data.success || !response.data.data || response.data.data.length === 0) {
//         showError('No data available for export with current filters');
//         return;
//       }

//       const allData = response.data.data;
      
//       const headers = [
//         'Transfer Date',
//         'Transfer Number', 
//         'Status',
//         'From Center',
//         'To Center',
//         'Admin Approved At',
//         'Center Approved At',
//         'Shipped At',
//         'Shipped Date',
//         'Completed At',
//         'Product Title',
//         'Product Qty',
//         'Approved Qty',
//         'Approved Remark',
//         'Received Qty',
//         'Received Remark',
//         'Approved Serials',
//         'Transferred Serials'
//       ];

//       const csvData = allData.flatMap(transfer => {
//         if (!transfer.products || transfer.products.length === 0) {
//           return [[
//             formatDate(transfer.date),
//             transfer.transferNumber,
//             transfer.status,
//             transfer.fromCenter?.centerName || 'N/A',
//             transfer.toCenter?.centerName || 'N/A',
//             transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
//             transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
//             transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
//             transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
//             transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
//             'No Product',
//             0,
//             0,
//             '',
//             0,
//             '',
//             '',
//             ''
//           ]];
//         }
  
//         return transfer.products.map(product => [
//           formatDate(transfer.date),
//           transfer.transferNumber,
//           transfer.status,
//           transfer.fromCenter?.centerName || 'N/A',
//           transfer.toCenter?.centerName || 'N/A',
//           transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
//           transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
//           transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
//           transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
//           transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
//           product.product?.productTitle || '',
//           product.quantity || 0,
//           product.approvedQuantity || 0,
//           product.approvedRemark || '',
//           product.receivedQuantity || 0,
//           product.receivedRemark || '',
//           product.approvedSerials?.join(', ') || '',
//           product.transferredSerials?.join(', ') || ''
//         ]);
//       });
      
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row => 
//           row.map(field => {
//             const stringField = String(field || '');
//             return `"${stringField.replace(/"/g, '""')}"`;
//           }).join(',')
//         )
//       ].join('\n');

//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
      
//       link.setAttribute('href', url);
//       link.setAttribute('download', `stock_transfers_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
      
//       showSuccess('CSV exported successfully with applied filters!');
      
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const renderSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === "ascending" ? (
//       <ArrowUp size={14} className="inline-block ml-1" />
//     ) : (
//       <ArrowDown size={14} className="inline-block ml-1" />
//     );
//   };

//   const renderTable = () => (
//     <div className="overflow-x-auto rounded-lg border border-gray-200">
//       <table className="min-w-[1050px] w-full border-collapse text-sm">
//         <thead>
//           <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//             {[
//               ["date", "Date"],
//               ["transferNumber", "Number"],
//               ["fromCenter.centerName", "From"],
//               ["toCenter.centerName", "To"],
//               ["createdBy.email", "Posted By"],
//               ["status", "Status"],
//               ["remark", "Remarks"],
//             ].map(([key, label]) => (
//               <th
//                 key={key}
//                 onClick={() => handleSort(key)}
//                 className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 transition hover:bg-gray-100"
//               >
//                 {label}
//                 {renderSortIcon(key)}
//               </th>
//             ))}
//             <th className="border-b border-gray-200 px-4 py-3">
//               Action
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredCustomers.length > 0 ? (
//             filteredCustomers.map((item) => (
//               <tr
//                 key={item._id}
//                 className={`border-b border-gray-100 transition hover:bg-gray-50 ${
//                   item.status === "Submitted" ? "bg-blue-50/50" : ""
//                 }`}
//               >
//                 <td className="px-4 py-3 text-gray-700">
//                   {formatDate(item.date)}
//                 </td>

//                 <td className="px-4 py-3">
//                   <button
//                     type="button"
//                     onClick={() => handleClick(item._id)}
//                     className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
//                   >
//                     {item.transferNumber}
//                   </button>
//                 </td>

//                 <td className="px-4 py-3 text-gray-700">
//                   {item.fromCenter?.centerName || "N/A"}
//                 </td>

//                 <td className="px-4 py-3 text-gray-700">
//                   {item.toCenter?.centerName || "N/A"}
//                 </td>

//                 <td className="px-4 py-3 text-gray-700">
//                   {item.createdBy?.email || "N/A"}
//                   {item.createdAt &&
//                     ` At ${new Date(item.createdAt).toLocaleTimeString(
//                       "en-US",
//                       {
//                         hour: "numeric",
//                         minute: "numeric",
//                         hour12: true,
//                       }
//                     )}`}
//                 </td>

//                 <td className="px-4 py-3">
//                   {item.status && (
//                     <span
//                       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                         item.status.toLowerCase() === "submitted"
//                           ? "bg-blue-100 text-blue-700"
//                           : item.status.toLowerCase() === "confirmed"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : item.status.toLowerCase() === "shipped"
//                               ? "bg-purple-100 text-purple-700"
//                               : item.status.toLowerCase() === "completed"
//                                 ? "bg-green-100 text-green-700"
//                                 : item.status.toLowerCase() === "rejected"
//                                   ? "bg-red-100 text-red-700"
//                                   : item.status.toLowerCase() === "draft"
//                                     ? "bg-gray-100 text-gray-700"
//                                     : "bg-gray-100 text-gray-700"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   )}
//                 </td>

//                 <td className="max-w-[260px] px-4 py-3 text-gray-700">
//                   <span className="line-clamp-2">
//                     {item.remark || "-"}
//                   </span>
//                 </td>

//                 <td className="relative px-4 py-3">
//                   <div
//                     className="relative inline-block"
//                     ref={(el) => {
//                       dropdownRefs.current[item._id] = el;
//                     }}
//                   >
//                     <button
//                       type="button"
//                       onClick={() => toggleDropdown(item._id)}
//                       className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//                     >
//                       <Settings size={14} />
//                       Options
//                       <MoreVertical size={13} />
//                     </button>

//                     {dropdownOpen[item._id] && (
//                       <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                         {hasAnyPermission("Transfer", [
//                           "manage_stock_transfer_all_center",
//                           "manage_stock_transfer_own_center",
//                         ]) && (
//                           <button
//                             type="button"
//                             className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
//                             onClick={() => handleEditData(item._id)}
//                           >
//                             <Pencil size={15} />
//                             Edit
//                           </button>
//                         )}

//                         {hasAnyPermission("Transfer", [
//                           "delete_transfer_own_center",
//                           "delete_transfer_all_center",
//                         ]) && (
//                           <button
//                             type="button"
//                             className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
//                             onClick={() => handleDeleteData(item._id)}
//                           >
//                             <Trash2 size={15} />
//                             Delete
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan={8}
//                 className="px-4 py-10 text-center text-sm text-gray-500"
//               >
//                 No {activeTab} stock transfers found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
//       <div className="mb-5">
//         <h1 className="text-xl font-semibold text-gray-800">
//           Stock Transfer Request List
//         </h1>
//       </div>

//       <SearchTransferModel
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         outlets={outlets}
//       />

//       <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {hasAnyPermission("Transfer", [
//               "manage_stock_transfer_own_center",
//               "manage_stock_transfer_all_center",
//             ]) && (
//               <Link to="/add-stockTransfer">
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                 >
//                   <FilePlus2 size={16} />
//                   Add
//                 </button>
//               </Link>
//             )}

//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {(
//               activeSearch.keyword ||
//               activeSearch.center ||
//               activeSearch.status ||
//               activeSearch.outlet ||
//               activeSearch.startDate ||
//               activeSearch.endDate ||
//               activeSearch.statusStartDate ||
//               activeSearch.statusEndDate
//             ) && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={generateDetailExport}
//               disabled={customers.length === 0}
//               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Detail Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         <div className="p-5">
//           <div className="mb-5 flex border-b border-gray-200">
//             <button
//               type="button"
//               onClick={() => handleTabChange("open")}
//               className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
//                 activeTab === "open"
//                   ? "border-blue-600 text-gray-900"
//                   : "border-transparent text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               Open
//             </button>

//             <button
//               type="button"
//               onClick={() => handleTabChange("closed")}
//               className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
//                 activeTab === "closed"
//                   ? "border-blue-600 text-gray-900"
//                   : "border-transparent text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               Closed
//             </button>
//           </div>

//           <div className="mb-4 flex justify-end">
//             <div className="relative w-full sm:w-[350px]">
//               <Search
//                 size={15}
//                 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />

//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 disabled={
//                   !!(
//                     activeSearch.keyword ||
//                     activeSearch.center ||
//                     activeSearch.status ||
//                     activeSearch.outlet
//                   )
//                 }
//                 placeholder={
//                   activeSearch.keyword ||
//                   activeSearch.center ||
//                   activeSearch.status ||
//                   activeSearch.outlet
//                     ? "Disabled during advanced search"
//                     : "Search..."
//                 }
//                 className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
//               />
//             </div>
//           </div>

//           {renderTable()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockTransfer;


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FilePlus2,
//   MoreVertical,
//   Pencil,
//   RotateCcw,
//   Search,
//   Settings,
//   Trash2,
// } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';
// import { confirmDelete, showError, showSuccess } from '../../utils/sweetAlerts';
// import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
// import Pagination from '../../utils/Pagination';
// import usePermission from '../../utils/usePermission';
// import SearchTransferModel from './SearchTransferModel';

// const StockTransfer = () => {
//   const [customers, setCustomers] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [outlets, setOutlets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ 
//     keyword: '', 
//     center: '', 
//     outlet: '',
//     status: '',
//     startDate: '',
//     endDate: '',
//     statusStartDate: '',
//     statusEndDate: ''
//   });
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [activeTab, setActiveTab] = useState('open');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const dropdownRefs = useRef({});
//   const navigate = useNavigate();
//   const { hasAnyPermission } = usePermission(); 
  
//   const statusFilters = {
//     open: ['Confirmed', 'Submitted', 'Shipped', 'Incompleted', 'Draft','Admin_Approved'],
//     closed: ['Rejected', 'Completed','Admin_Rejected']
//   };

//   const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();

//       if (!searchParams.status) {
//         const statuses = statusFilters[tab];
//         statuses.forEach(status => {
//           params.append('status', status);
//         });
//       } else {
//         params.append('status', searchParams.status);
//       }
//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
//       if (searchParams.statusStartDate) {
//         params.append('startDate', searchParams.statusStartDate);
//       }
//       if (searchParams.statusEndDate) {
//         params.append('endDate', searchParams.statusEndDate);
//       }
//       if (searchParams.statusChanged) {
//         params.append('status', searchParams.statusChanged);
//       }
      
//       params.append('page', page);
      
//       const url = `/stocktransfer?${params.toString()}`;
//       console.log('API URL:', url);
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setCustomers(response.data.data);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         throw new Error('API returned unsuccessful response');
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
//       const response = await axiosInstance.get('/centers?centerType=Center');
//       if (response.data.success) {
//         setCenters(response.data.data);
//         const outletCenters = response.data.data.filter(center => 
//           center.centerType === 'Outlet' || center.centerType === 'outlet'
//         );
//         setOutlets(outletCenters);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, activeTab, page);
//   };

//   useEffect(() => {
//     fetchData(activeSearch, activeTab);
//   }, [activeTab]);
  
//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedCustomers = [...customers].sort((a, b) => {
//       let aValue = a;
//       let bValue = b;
      
//       if (key.includes('.')) {
//         const keys = key.split('.');
//         aValue = keys.reduce((obj, k) => obj && obj[k], a);
//         bValue = keys.reduce((obj, k) => obj && obj[k], b);
//       } else {
//         aValue = a[key];
//         bValue = b[key];
//       }
      
//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });

//     setCustomers(sortedCustomers);
//   };


//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, activeTab, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       keyword: '', 
//       center: '', 
//       outlet: '',
//       status: '',
//       startDate: '',
//       endDate: '',
//       statusStartDate: '',
//       statusEndDate: ''
//     });
//     setSearchTerm('');
//     fetchData({}, activeTab, 1);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setActiveSearch({ 
//       keyword: '', 
//       center: '', 
//       outlet: '',
//       status: '',
//       startDate: '',
//       endDate: '',
//       statusStartDate: '',
//       statusEndDate: ''
//     });
//     setSearchTerm('');
//   };

//   const filteredCustomers = customers.filter(customer => {
//     if (activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet) {
//       return true;
//     }
//     return Object.values(customer).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   const handleDeleteData = async (itemId) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/stocktransfer/${itemId}`);
//         setCustomers((prev) => prev.filter((c) => c._id !== itemId));
//         showSuccess('Data deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting date:', error);
//       }
//     }
//   };
  
//   const handleEditData = (itemId) => {
//     navigate(`/edit-stockTransfer/${itemId}`)
//   };

//   const toggleDropdown = (id) => {
//     setDropdownOpen(prev => {
//       const isCurrentlyOpen = !!prev[id];
//       const newState = {};
//       if (!isCurrentlyOpen) {
//         newState[id] = true;
//       }
//       return newState;
//     });
//   };
  
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
//         Error loading data: {error}
//       </div>
//     );
//   }

//   const handleClick = (itemId) => {
//     navigate(`/stockTransfer-details/${itemId}`);
//   };
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (activeSearch.keyword) {
//         params.append('search', activeSearch.keyword);
//       }
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.outlet) {
//         params.append('outlet', activeSearch.outlet);
//       }
//       if (activeSearch.status) {
//         params.append('status', activeSearch.status);
//       } else {
//         const statuses = statusFilters[activeTab];
//         statuses.forEach(status => {
//           params.append('status', status);
//         });
//       }
//       if (activeSearch.startDate) {
//         params.append('startDate', activeSearch.startDate);
//       }
//       if (activeSearch.endDate) {
//         params.append('endDate', activeSearch.endDate);
//       }
//       if (activeSearch.statusStartDate) {
//         params.append('startDate', activeSearch.statusStartDate);
//       }
//       if (activeSearch.statusEndDate) {
//         params.append('endDate', activeSearch.statusEndDate);
//       }
//       if (activeSearch.statusChanged) {
//         params.append('status', activeSearch.statusChanged);
//       }
//       const exportUrl = `/stocktransfer?${params.toString()}`;
//       console.log('Export URL:', exportUrl);
      
//       const response = await axiosInstance.get(exportUrl);
      
//       if (!response.data.success || !response.data.data || response.data.data.length === 0) {
//         showError('No data available for export with current filters');
//         return;
//       }

//       const allData = response.data.data;
      
//       const headers = [
//         'Transfer Date',
//         'Transfer Number', 
//         'Status',
//         'From Center',
//         'To Center',
//         'Admin Approved At',
//         'Center Approved At',
//         'Shipped At',
//         'Shipped Date',
//         'Completed At',
//         'Product Title',
//         'Product Qty',
//         'Approved Qty',
//         'Approved Remark',
//         'Received Qty',
//         'Received Remark',
//         'Approved Serials',
//         'Transferred Serials'
//       ];

//       const csvData = allData.flatMap(transfer => {
//         if (!transfer.products || transfer.products.length === 0) {
//           return [[
//             formatDate(transfer.date),
//             transfer.transferNumber,
//             transfer.status,
//             transfer.fromCenter?.centerName || 'N/A',
//             transfer.toCenter?.centerName || 'N/A',
//             transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
//             transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
//             transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
//             transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
//             transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
//             'No Product',
//             0,
//             0,
//             '',
//             0,
//             '',
//             '',
//             ''
//           ]];
//         }
  
//         return transfer.products.map(product => [
//           formatDate(transfer.date),
//           transfer.transferNumber,
//           transfer.status,
//           transfer.fromCenter?.centerName || 'N/A',
//           transfer.toCenter?.centerName || 'N/A',
//           transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
//           transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
//           transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
//           transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
//           transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
//           product.product?.productTitle || '',
//           product.quantity || 0,
//           product.approvedQuantity || 0,
//           product.approvedRemark || '',
//           product.receivedQuantity || 0,
//           product.receivedRemark || '',
//           product.approvedSerials?.join(', ') || '',
//           product.transferredSerials?.join(', ') || ''
//         ]);
//       });
      
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row => 
//           row.map(field => {
//             const stringField = String(field || '');
//             return `"${stringField.replace(/"/g, '""')}"`;
//           }).join(',')
//         )
//       ].join('\n');

//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
      
//       link.setAttribute('href', url);
//       link.setAttribute('download', `stock_transfers_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
      
//       showSuccess('CSV exported successfully with applied filters!');
      
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const renderSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === "ascending" ? (
//       <ArrowUp size={14} className="inline-block ml-1" />
//     ) : (
//       <ArrowDown size={14} className="inline-block ml-1" />
//     );
//   };

//   const renderTable = () => (
//     <div className="overflow-x-auto rounded-lg border border-gray-200">
//       <table className="min-w-[1050px] w-full border-collapse text-sm">
//         <thead>
//           <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//             {[
//               ["date", "Date"],
//               ["transferNumber", "Number"],
//               ["fromCenter.centerName", "From"],
//               ["toCenter.centerName", "To"],
//               ["createdBy.email", "Posted By"],
//               ["status", "Status"],
//               ["remark", "Remarks"],
//             ].map(([key, label]) => (
//               <th
//                 key={key}
//                 onClick={() => handleSort(key)}
//                 className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 transition hover:bg-gray-100"
//               >
//                 {label}
//                 {renderSortIcon(key)}
//               </th>
//             ))}
//             <th className="border-b border-gray-200 px-4 py-3">
//               Action
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredCustomers.length > 0 ? (
//             filteredCustomers.map((item) => (
//               <tr
//                 key={item._id}
//                 className={`border-b border-gray-100 transition hover:bg-gray-50 ${
//                   item.status === "Submitted" ? "bg-blue-50/50" : ""
//                 }`}
//               >
//                 <td className="px-4 py-3 text-gray-700">
//                   {formatDate(item.date)}
//                 </td>

//                 <td className="px-4 py-3">
//                   <button
//                     type="button"
//                     onClick={() => handleClick(item._id)}
//                     className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
//                   >
//                     {item.transferNumber}
//                   </button>
//                 </td>

//                 <td className="px-4 py-3 text-gray-700">
//                   {item.fromCenter?.centerName || "N/A"}
//                 </td>

//                 <td className="px-4 py-3 text-gray-700">
//                   {item.toCenter?.centerName || "N/A"}
//                 </td>

//                 <td className="px-4 py-3 text-gray-700">
//                   {item.createdBy?.email || "N/A"}
//                   {item.createdAt &&
//                     ` At ${new Date(item.createdAt).toLocaleTimeString(
//                       "en-US",
//                       {
//                         hour: "numeric",
//                         minute: "numeric",
//                         hour12: true,
//                       }
//                     )}`}
//                 </td>

//                 <td className="px-4 py-3">
//                   {item.status && (
//                     <span
//                       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                         item.status.toLowerCase() === "submitted"
//                           ? "bg-blue-100 text-blue-700"
//                           : item.status.toLowerCase() === "confirmed"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : item.status.toLowerCase() === "shipped"
//                               ? "bg-purple-100 text-purple-700"
//                               : item.status.toLowerCase() === "completed"
//                                 ? "bg-green-100 text-green-700"
//                                 : item.status.toLowerCase() === "rejected"
//                                   ? "bg-red-100 text-red-700"
//                                   : item.status.toLowerCase() === "draft"
//                                     ? "bg-gray-100 text-gray-700"
//                                     : "bg-gray-100 text-gray-700"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   )}
//                 </td>

//                 <td className="max-w-[260px] px-4 py-3 text-gray-700">
//                   <span className="line-clamp-2">
//                     {item.remark || "-"}
//                   </span>
//                 </td>

//                 <td className="relative px-1 py-3">
//                   <div
//                     className="relative inline-block"
//                     ref={(el) => {
//                       dropdownRefs.current[item._id] = el;
//                     }}
//                   >
//                     <button
//                       type="button"
//                       onClick={() => toggleDropdown(item._id)}
//                       className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-1 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//                     >
//                       <Settings size={14} />
//                       Options
//                       <MoreVertical size={13} />
//                     </button>

//                     {dropdownOpen[item._id] && (
//                       <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                         {hasAnyPermission("Transfer", [
//                           "manage_stock_transfer_all_center",
//                           "manage_stock_transfer_own_center",
//                         ]) && (
//                           <button
//                             type="button"
//                             className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
//                             onClick={() => handleEditData(item._id)}
//                           >
//                             <Pencil size={15} />
//                             Edit
//                           </button>
//                         )}

//                         {hasAnyPermission("Transfer", [
//                           "delete_transfer_own_center",
//                           "delete_transfer_all_center",
//                         ]) && (
//                           <button
//                             type="button"
//                             className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
//                             onClick={() => handleDeleteData(item._id)}
//                           >
//                             <Trash2 size={15} />
//                             Delete
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan={8}
//                 className="px-4 py-10 text-center text-sm text-gray-500"
//               >
//                 No {activeTab} stock transfers found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       <div className="mb-3">
//         <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//           Stock Transfer Request List
//         </h1>
//       </div>

//       <SearchTransferModel
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         outlets={outlets}
//       />

//       <div className="mt-4 overflow-hidden rounded-[2px] border border-[#e1e4e8] border-t-[4px] border-t-[#2759a2] bg-white shadow-none">
//         <div className="flex flex-col gap-3 border-b border-[#d9dde3] bg-white px-4 py-2 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {hasAnyPermission("Transfer", [
//               "manage_stock_transfer_own_center",
//               "manage_stock_transfer_all_center",
//             ]) && (
//               <Link to="/add-stockTransfer">
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 py-[7px] text-[14px] font-semibold text-white transition hover:bg-[#1f4b89]"
//                 >
//                   <FilePlus2 size={16} />
//                   Add
//                 </button>
//               </Link>
//             )}

//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 py-[7px] text-[14px] font-semibold text-white transition hover:bg-[#1f4b89]"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {(
//               activeSearch.keyword ||
//               activeSearch.center ||
//               activeSearch.status ||
//               activeSearch.outlet ||
//               activeSearch.startDate ||
//               activeSearch.endDate ||
//               activeSearch.statusStartDate ||
//               activeSearch.statusEndDate
//             ) && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#c8cdd4] bg-white px-3 py-[7px] text-[14px] font-medium text-[#374151] transition hover:bg-[#f3f4f6]"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={generateDetailExport}
//               disabled={customers.length === 0}
//               className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 py-[7px] text-[14px] font-semibold text-white transition hover:bg-[#1f4b89] disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Detail Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         <div className="px-4 pb-4 pt-0">
//           <div className="mb-4 flex border-b border-[#d9dde3]">
//             <button
//               type="button"
//               onClick={() => handleTabChange("open")}
//               className={`relative -mb-px border-b-[4px] px-[18px] py-[13px] text-[15px] font-normal transition ${
//                 activeTab === "open"
//                   ? "rounded-t-[5px] border-[#2759a2] bg-white text-black"
//                   : "border-transparent text-black hover:text-[#2759a2]"
//               }`}
//             >
//               Open
//             </button>

//             <button
//               type="button"
//               onClick={() => handleTabChange("closed")}
//               className={`relative -mb-px border-b-[4px] px-[18px] py-[13px] text-[15px] font-normal transition ${
//                 activeTab === "closed"
//                   ? "rounded-t-[5px] border-[#2759a2] bg-white text-black"
//                   : "border-transparent text-black hover:text-[#2759a2]"
//               }`}
//             >
//               Closed
//             </button>
//           </div>

//           <div className="mb-4 flex justify-end">
//             <div className="relative w-full sm:w-[237px]">
//               <Search
//                 size={15}
//                 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />

//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 disabled={
//                   !!(
//                     activeSearch.keyword ||
//                     activeSearch.center ||
//                     activeSearch.status ||
//                     activeSearch.outlet
//                   )
//                 }
//                 placeholder={
//                   activeSearch.keyword ||
//                   activeSearch.center ||
//                   activeSearch.status ||
//                   activeSearch.outlet
//                     ? "Disabled during advanced search"
//                     : "Search..."
//                 }
//                 className="h-[34px] w-full rounded-[2px] border border-[#d5d9df] bg-white py-1.5 pl-9 pr-3 text-[14px] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2] disabled:cursor-not-allowed disabled:bg-gray-100"
//               />
//             </div>
//           </div>

//           {renderTable()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockTransfer;



import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  FilePlus2,
  MoreVertical,
  Pencil,
  RotateCcw,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { confirmDelete, showError, showSuccess } from '../../utils/sweetAlerts';
import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
import Pagination from '../../utils/Pagination';
import usePermission from '../../utils/usePermission';
import SearchTransferModel from './SearchTransferModel';

const StockTransfer = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    center: '', 
    outlet: '',
    status: '',
    startDate: '',
    endDate: '',
    statusStartDate: '',
    statusEndDate: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeTab, setActiveTab] = useState('open');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const { hasAnyPermission } = usePermission(); 
  
  const statusFilters = {
    open: ['Confirmed', 'Submitted', 'Shipped', 'Incompleted', 'Draft','Admin_Approved'],
    closed: ['Rejected', 'Completed','Admin_Rejected']
  };

  const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (!searchParams.status) {
        const statuses = statusFilters[tab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      } else {
        params.append('status', searchParams.status);
      }
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      if (searchParams.statusStartDate) {
        params.append('startDate', searchParams.statusStartDate);
      }
      if (searchParams.statusEndDate) {
        params.append('endDate', searchParams.statusEndDate);
      }
      if (searchParams.statusChanged) {
        params.append('status', searchParams.statusChanged);
      }
      
      params.append('page', page);
      
      const url = `/stocktransfer?${params.toString()}`;
      console.log('API URL:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setCustomers(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers?centerType=Center');
      if (response.data.success) {
        setCenters(response.data.data);
        const outletCenters = response.data.data.filter(center => 
          center.centerType === 'Outlet' || center.centerType === 'outlet'
        );
        setOutlets(outletCenters);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, activeTab, page);
  };

  useEffect(() => {
    fetchData(activeSearch, activeTab);
  }, [activeTab]);
  
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...customers].sort((a, b) => {
      let aValue = a;
      let bValue = b;
      
      if (key.includes('.')) {
        const keys = key.split('.');
        aValue = keys.reduce((obj, k) => obj && obj[k], a);
        bValue = keys.reduce((obj, k) => obj && obj[k], b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setCustomers(sortedCustomers);
  };


  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, activeTab, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      keyword: '', 
      center: '', 
      outlet: '',
      status: '',
      startDate: '',
      endDate: '',
      statusStartDate: '',
      statusEndDate: ''
    });
    setSearchTerm('');
    fetchData({}, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSearch({ 
      keyword: '', 
      center: '', 
      outlet: '',
      status: '',
      startDate: '',
      endDate: '',
      statusStartDate: '',
      statusEndDate: ''
    });
    setSearchTerm('');
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet) {
      return true;
    }
    return Object.values(customer).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const handleDeleteData = async (itemId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/stocktransfer/${itemId}`);
        setCustomers((prev) => prev.filter((c) => c._id !== itemId));
        showSuccess('Data deleted successfully!');
      } catch (error) {
        console.error('Error deleting date:', error);
      }
    }
  };
  
  const handleEditData = (itemId) => {
    navigate(`/edit-stockTransfer/${itemId}`)
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => {
      const isCurrentlyOpen = !!prev[id];
      const newState = {};
      if (!isCurrentlyOpen) {
        newState[id] = true;
      }
      return newState;
    });
  };
  
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
        Error loading data: {error}
      </div>
    );
  }

  const handleClick = (itemId) => {
    navigate(`/stockTransfer-details/${itemId}`);
  };
  const generateDetailExport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword);
      }
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.outlet) {
        params.append('outlet', activeSearch.outlet);
      }
      if (activeSearch.status) {
        params.append('status', activeSearch.status);
      } else {
        const statuses = statusFilters[activeTab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      }
      if (activeSearch.startDate) {
        params.append('startDate', activeSearch.startDate);
      }
      if (activeSearch.endDate) {
        params.append('endDate', activeSearch.endDate);
      }
      if (activeSearch.statusStartDate) {
        params.append('startDate', activeSearch.statusStartDate);
      }
      if (activeSearch.statusEndDate) {
        params.append('endDate', activeSearch.statusEndDate);
      }
      if (activeSearch.statusChanged) {
        params.append('status', activeSearch.statusChanged);
      }
      const exportUrl = `/stocktransfer?${params.toString()}`;
      console.log('Export URL:', exportUrl);
      
      const response = await axiosInstance.get(exportUrl);
      
      if (!response.data.success || !response.data.data || response.data.data.length === 0) {
        showError('No data available for export with current filters');
        return;
      }

      const allData = response.data.data;
      
      const headers = [
        'Transfer Date',
        'Transfer Number', 
        'Status',
        'From Center',
        'To Center',
        'Admin Approved At',
        'Center Approved At',
        'Shipped At',
        'Shipped Date',
        'Completed At',
        'Product Title',
        'Product Qty',
        'Approved Qty',
        'Approved Remark',
        'Received Qty',
        'Received Remark',
        'Approved Serials',
        'Transferred Serials'
      ];

      const csvData = allData.flatMap(transfer => {
        if (!transfer.products || transfer.products.length === 0) {
          return [[
            formatDate(transfer.date),
            transfer.transferNumber,
            transfer.status,
            transfer.fromCenter?.centerName || 'N/A',
            transfer.toCenter?.centerName || 'N/A',
            transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
            transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
            transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
            transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
            transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
            'No Product',
            0,
            0,
            '',
            0,
            '',
            '',
            ''
          ]];
        }
  
        return transfer.products.map(product => [
          formatDate(transfer.date),
          transfer.transferNumber,
          transfer.status,
          transfer.fromCenter?.centerName || 'N/A',
          transfer.toCenter?.centerName || 'N/A',
          transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
          transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
          transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
          transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
          transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
          product.product?.productTitle || '',
          product.quantity || 0,
          product.approvedQuantity || 0,
          product.approvedRemark || '',
          product.receivedQuantity || 0,
          product.receivedRemark || '',
          product.approvedSerials?.join(', ') || '',
          product.transferredSerials?.join(', ') || ''
        ]);
      });
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            const stringField = String(field || '');
            return `"${stringField.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `stock_transfers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess('CSV exported successfully with applied filters!');
      
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };


  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className="inline-block ml-1" />
    ) : (
      <ArrowDown size={14} className="inline-block ml-1" />
    );
  };

  const renderTable = () => (
    <div className="max-h-[430px] w-full overflow-auto rounded-md border border-[#e1e5eb] bg-white shadow-sm">
      <table className="min-w-[1050px] w-full border-collapse text-sm text-[#212529]">
        <thead>
          <tr className="bg-[#f1f4f8] text-left text-[13px] font-bold text-[#202938]">
            {[
              ["date", "Date"],
              ["transferNumber", "Number"],
              ["fromCenter.centerName", "From"],
              ["toCenter.centerName", "To"],
              ["createdBy.email", "Posted By"],
              ["status", "Status"],
              ["remark", "Remarks"],
            ].map(([key, label]) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="sticky top-0 z-20 cursor-pointer whitespace-nowrap border-b border-[#dfe4eb] bg-[#f1f4f8] px-4 py-3.5 transition hover:bg-[#e8edf5]"
              >
                {label}
                {renderSortIcon(key)}
              </th>
            ))}
            <th className="sticky top-0 z-20 border-b border-[#dfe4eb] bg-[#f1f4f8] px-4 py-3.5">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((item) => (
              <tr
                key={item._id}
                className={`border-b border-[#e8ebf0] transition-colors hover:bg-[#f4f7fb] ${
                  item.status === "Submitted" ? "bg-blue-50/50" : ""
                }`}
              >
                <td className="px-4 py-3.5 align-top text-[14px] text-[#303846]">
                  {formatDate(item.date)}
                </td>

                <td className="px-4 py-3.5 align-top">
                  <button
                    type="button"
                    onClick={() => handleClick(item._id)}
                    className="font-medium text-[#2874c8] hover:text-[#174f91] hover:underline"
                  >
                    {item.transferNumber}
                  </button>
                </td>

                <td className="px-4 py-3.5 align-top text-[14px] text-[#303846]">
                  {item.fromCenter?.centerName || "N/A"}
                </td>

                <td className="px-4 py-3.5 align-top text-[14px] text-[#303846]">
                  {item.toCenter?.centerName || "N/A"}
                </td>

                <td className="px-4 py-3.5 align-top text-[14px] text-[#303846]">
                  {item.createdBy?.email || "N/A"}
                  {item.createdAt &&
                    ` At ${new Date(item.createdAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}`}
                </td>

                <td className="px-4 py-3.5 align-top">
                  {item.status && (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status.toLowerCase() === "submitted"
                          ? "bg-blue-100 text-blue-700"
                          : item.status.toLowerCase() === "confirmed"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status.toLowerCase() === "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : item.status.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-700"
                                : item.status.toLowerCase() === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : item.status.toLowerCase() === "draft"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </td>

                <td className="max-w-[260px] px-4 py-3.5 align-top text-[14px] text-[#303846]">
                  <span className="line-clamp-2">
                    {item.remark || "-"}
                  </span>
                </td>

                <td className="relative whitespace-nowrap px-2 py-3.5 align-top">
                  <div
                    className="relative inline-block"
                    ref={(el) => {
                      dropdownRefs.current[item._id] = el;
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item._id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-1 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                      <Settings size={14} />
                      Options
                      <MoreVertical size={13} />
                    </button>

                    {dropdownOpen[item._id] && (
                      <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        {hasAnyPermission("Transfer", [
                          "manage_stock_transfer_all_center",
                          "manage_stock_transfer_own_center",
                        ]) && (
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                            onClick={() => handleEditData(item._id)}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        )}

                        {hasAnyPermission("Transfer", [
                          "delete_transfer_own_center",
                          "delete_transfer_all_center",
                        ]) && (
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                            onClick={() => handleDeleteData(item._id)}
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                No {activeTab} stock transfers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mb-3">
        
        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          Stock Transfer Request List
        </h1>
      </div>

      <SearchTransferModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        outlets={outlets}
      />

      <div className="mt-4 overflow-hidden rounded-md border border-[#dce2ea] border-t-[4px] border-t-[#2759a2] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#d9dde3] bg-white px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {hasAnyPermission("Transfer", [
              "manage_stock_transfer_own_center",
              "manage_stock_transfer_all_center",
            ]) && (
              <Link to="/add-stockTransfer">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 py-[7px] text-[14px] font-semibold text-white transition hover:bg-[#1f4b89]"
                >
                  <FilePlus2 size={16} />
                  Add
                </button>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 py-[7px] text-[14px] font-semibold text-white transition hover:bg-[#1f4b89]"
            >
              <Search size={16} />
              Search
            </button>

            {(
              activeSearch.keyword ||
              activeSearch.center ||
              activeSearch.status ||
              activeSearch.outlet ||
              activeSearch.startDate ||
              activeSearch.endDate ||
              activeSearch.statusStartDate ||
              activeSearch.statusEndDate
            ) && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#c8cdd4] bg-white px-3 py-[7px] text-[14px] font-medium text-[#374151] transition hover:bg-[#f3f4f6]"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              disabled={customers.length === 0}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 py-[7px] text-[14px] font-semibold text-white transition hover:bg-[#1f4b89] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Detail Export
            </button>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="px-4 pb-4 pt-2">
          <div className="mb-4 flex border-b border-[#d9dde3]">
            <button
              type="button"
              onClick={() => handleTabChange("open")}
              className={`relative -mb-px border-b-[4px] px-[18px] py-[13px] text-[15px] font-normal transition ${
                activeTab === "open"
                  ? "rounded-t-[5px] border-[#2759a2] bg-white text-black"
                  : "border-transparent text-black hover:text-[#2759a2]"
              }`}
            >
              Open
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("closed")}
              className={`relative -mb-px border-b-[4px] px-[18px] py-[13px] text-[15px] font-normal transition ${
                activeTab === "closed"
                  ? "rounded-t-[5px] border-[#2759a2] bg-white text-black"
                  : "border-transparent text-black hover:text-[#2759a2]"
              }`}
            >
              Closed
            </button>
          </div>

          <div className="mb-3 flex justify-end">
            <div className="relative w-full sm:w-[237px]">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={
                  !!(
                    activeSearch.keyword ||
                    activeSearch.center ||
                    activeSearch.status ||
                    activeSearch.outlet
                  )
                }
                placeholder={
                  activeSearch.keyword ||
                  activeSearch.center ||
                  activeSearch.status ||
                  activeSearch.outlet
                    ? "Disabled during advanced search"
                    : "Search..."
                }
                className="h-[34px] w-full rounded-[2px] border border-[#d5d9df] bg-white py-1.5 pl-9 pr-3 text-[14px] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2] disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default StockTransfer;
