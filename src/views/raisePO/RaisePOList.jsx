// import React, { useEffect, useRef, useState } from 'react'
// import {
//   ArrowDown,
//   ArrowLeft,
//   ArrowUp,
//   Check,
//   ChevronDown,
//   Plus,
//   Printer,
//   RotateCcw,
//   Search,
//   Settings,
//   X,
// } from 'lucide-react'
// import { Link, useNavigate } from 'react-router-dom'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import usePermission from '../../utils/usePermission'
// import SearchStockPurchase from '../stockPurchase/SearchStockPurchase'

// const StockPurchase = () => {
//   const [customers, setCustomers] = useState([])
//   const [centers, setCenters] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   })

//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchModalVisible, setSearchModalVisible] = useState(false)
//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [activeSearch, setActiveSearch] = useState({
//     keyword: '',
//     outlet: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [selectedPO, setSelectedPO] = useState(null)

//   const user = JSON.parse(localStorage.getItem('user')) || {}
//   const userRole = (user?.role?.roleTitle || '').toLowerCase()

//   const dropdownRefs = useRef({})
//   const navigate = useNavigate()
//   const { hasPermission } = usePermission()

//   const numToWords = (num) => {
//     const ones = [
//       '',
//       'One',
//       'Two',
//       'Three',
//       'Four',
//       'Five',
//       'Six',
//       'Seven',
//       'Eight',
//       'Nine',
//     ]

//     const teens = [
//       'Ten',
//       'Eleven',
//       'Twelve',
//       'Thirteen',
//       'Fourteen',
//       'Fifteen',
//       'Sixteen',
//       'Seventeen',
//       'Eighteen',
//       'Nineteen',
//     ]

//     const tens = [
//       '',
//       '',
//       'Twenty',
//       'Thirty',
//       'Forty',
//       'Fifty',
//       'Sixty',
//       'Seventy',
//       'Eighty',
//       'Ninety',
//     ]

//     if (num === 0) return 'Zero'

//     if (num < 10) {
//       return ones[Math.floor(num)]
//     }

//     if (num < 20) {
//       return teens[Math.floor(num) - 10]
//     }

//     if (num < 100) {
//       return (
//         tens[Math.floor(num / 10)] +
//         (num % 10 !== 0 ? ` ${ones[num % 10]}` : '')
//       )
//     }

//     if (num < 1000) {
//       return (
//         ones[Math.floor(num / 100)] +
//         ' Hundred' +
//         (num % 100 !== 0
//           ? ` and ${numToWords(num % 100)}`
//           : '')
//       )
//     }

//     if (num < 100000) {
//       return (
//         numToWords(Math.floor(num / 1000)) +
//         ' Thousand' +
//         (num % 1000 !== 0
//           ? ` ${numToWords(num % 1000)}`
//           : '')
//       )
//     }

//     if (num < 10000000) {
//       return (
//         numToWords(Math.floor(num / 100000)) +
//         ' Lakh' +
//         (num % 100000 !== 0
//           ? ` ${numToWords(num % 100000)}`
//           : '')
//       )
//     }

//     return (
//       numToWords(Math.floor(num / 10000000)) +
//       ' Crore' +
//       (num % 10000000 !== 0
//         ? ` ${numToWords(num % 10000000)}`
//         : '')
//     )
//   }

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true)

//       const params = new URLSearchParams()

//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword)
//       }

//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/raisePO?${params.toString()}`
//         : '/raisePO'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setCustomers(response.data.data)
//         setCurrentPage(
//           response.data.pagination.currentPage,
//         )
//         setTotalPages(
//           response.data.pagination.totalPages,
//         )
//       } else {
//         throw new Error(
//           'API returned unsuccessful response',
//         )
//       }
//     } catch (err) {
//       setError(err.message)
//       console.error('Error fetching customers:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get(
//         '/centers/?centerType=Outlet',
//       )

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//     fetchCenters()
//   }, [])

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return

//     fetchData(activeSearch, page)
//   }

//   const handleSort = (key) => {
//     let direction = 'ascending'

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending'
//     }

//     setSortConfig({
//       key,
//       direction,
//     })

//     const sortedCustomers = [...customers].sort((a, b) => {
//       let aValue = a
//       let bValue = b

//       if (key.includes('.')) {
//         const keys = key.split('.')

//         aValue = keys.reduce(
//           (obj, currentKey) =>
//             obj && obj[currentKey],
//           a,
//         )

//         bValue = keys.reduce(
//           (obj, currentKey) =>
//             obj && obj[currentKey],
//           b,
//         )
//       } else {
//         aValue = a[key]
//         bValue = b[key]
//       }

//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
//       }

//       return 0
//     })

//     setCustomers(sortedCustomers)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null
//     }

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     )
//   }

//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }))
//   }

//   const closeAllDropdowns = () => {
//     setDropdownOpen({})
//   }

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     fetchData(searchData, 1)
//   }

//   const handleResetSearch = () => {
//     setActiveSearch({
//       keyword: '',
//       outlet: '',
//       startDate: '',
//       endDate: '',
//     })

//     setSearchTerm('')
//     fetchData({}, 1)
//   }

//   const handleSelectPO = (po) => {
//     if (selectedPO?._id === po._id) {
//       setSelectedPO(null)
//     } else {
//       setSelectedPO(po)
//     }
//   }

//   const generateInvoice = () => {
//     if (!selectedPO) {
//       showError('Please select a PO first')
//       return
//     }

//     const invoiceDate = new Date()
//       .toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: '2-digit',
//       })
//       .replace(/\//g, '-')

//     const totalBeforeTax =
//       selectedPO.products.reduce(
//         (sum, product) =>
//           sum +
//           product.price * product.purchasedQuantity,
//         0,
//       )

//     const vendorState =
//       selectedPO.vendor?.state || ''

//     const isIntraState = vendorState
//       .toLowerCase()
//       .includes('maharashtra')

//     let cgst = 0
//     let sgst = 0
//     let igst = 0
//     const taxRate = 0.18

//     if (isIntraState) {
//       cgst = totalBeforeTax * (taxRate / 2)
//       sgst = totalBeforeTax * (taxRate / 2)
//     } else {
//       igst = totalBeforeTax * taxRate
//     }

//     const roundOff =
//       Math.round(
//         totalBeforeTax +
//           cgst +
//           sgst +
//           igst,
//       ) -
//       (totalBeforeTax +
//         cgst +
//         sgst +
//         igst)

//     const total =
//       totalBeforeTax +
//       cgst +
//       sgst +
//       igst +
//       roundOff

//     const productsPerPage = 8
//     const pages = []

//     for (
//       let i = 0;
//       i < selectedPO.products.length;
//       i += productsPerPage
//     ) {
//       pages.push(
//         selectedPO.products.slice(
//           i,
//           i + productsPerPage,
//         ),
//       )
//     }

//     const getStateCodeFromGSTIN = (gstin) => {
//       if (!gstin || gstin.length < 2) return ''

//       return gstin.substring(0, 2)
//     }

//     const buyerGSTIN = '27ABECS3422Q1ZX'
//     const buyerStateCode =
//       getStateCodeFromGSTIN(buyerGSTIN)

//     const vendorGSTIN =
//       selectedPO.vendor?.gstNumber || ''

//     const vendorStateCode =
//       getStateCodeFromGSTIN(vendorGSTIN)

//     const invoiceHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Invoice - ${selectedPO.voucherNo}</title>

//         <style>
//           @page {
//             size: A4;
//             margin: 12mm;
//           }

//           body {
//             font-family: Arial, sans-serif;
//             color: #000;
//             margin: 0;
//             padding: 0;
//           }

//           @media screen {
//             body {
//               margin-left: 100px;
//               margin-right: 100px;
//               margin-top: 20px;
//               margin-bottom: 20px;
//             }

//             .print-button {
//               display: block;
//               margin: 20px auto;
//               padding: 10px 15px;
//               background-color: #3c8dbc;
//               color: white;
//               border: none;
//               font-size: 16px;
//               cursor: pointer;
//               position: sticky;
//               top: 20px;
//               z-index: 1000;
//             }

//             .print-button:hover {
//               background-color: #3c8dbc;
//             }
//           }

//           @media print {
//             body {
//               margin: 0;
//               padding: 0;
//             }

//             .print-button {
//               display: none;
//             }

//             .page-break {
//               page-break-before: always;
//             }
//           }

//           .title {
//             text-align: center;
//             font-weight: bold;
//             font-size: 18px;
//             margin: 10px;
//           }

//           .main-border {
//             border: 1px solid #000;
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 10px;
//           }

//           .main-border td,
//           .main-border th {
//             border: 1px solid #000;
//             padding: 5px;
//             vertical-align: top;
//           }

//           .meta-table {
//             width: 100%;
//             border-collapse: collapse;
//           }

//           .meta-table td {
//             border: 1px solid #000;
//             padding: 6px;
//             vertical-align: top;
//           }

//           .label {
//             font-weight: bold;
//           }

//           .right {
//             text-align: right;
//           }

//           .bold {
//             font-weight: bold;
//           }

//           .footer-note {
//             font-style: italic;
//             text-align: right;
//             margin-top: 4px;
//           }

//           hr {
//             margin: 4px 0;
//             border: none;
//             border-top: 1px solid #000;
//           }

//           i {
//             font-style: italic;
//             margin-left: 10px;
//           }

//           .declaration-section {
//             margin-top: 20px;
//             display: flex;
//             justify-content: space-between;
//           }

//           .declaration-left {
//             width: 48%;
//           }

//           .declaration-right {
//             width: 48%;
//             text-align: center;
//           }

//           .signature-line {
//             margin-top: 60px;
//             border-top: 1px solid #000;
//             padding-top: 5px;
//           }

//           .computer-generated {
//             text-align: center;
//             font-style: italic;
//             margin-top: 50px;
//           }

//           .tax-details {
//             margin-top: 10px;
//             font-size: 12px;
//           }

//           .tax-notice {
//             font-size: 11px;
//             color: #666;
//             margin-top: 5px;
//           }
//         </style>
//       </head>

//       <body>
//         <div class="title">PURCHASE ORDER</div>

//         ${pages
//           .map(
//             (products, pageIndex) => `
//               <table class="main-border">
//                 <tr>
//                   <td style="width:50%;">
//                     <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
//                       <p>Invoice To</p>

//                       <div class="bold">
//                         SSV Telecom Private Limited FY 22-23
//                       </div>

//                       A-1, Landmark CHS, Sector 14<br/>
//                       Vashi, Navi Mumbai<br/>
//                       ${buyerGSTIN}<br/>
//                       GSTIN/UIN: ${buyerGSTIN}<br/>
//                       State Name: Maharashtra, Code: ${buyerStateCode}
//                     </div>

//                     <span class="label">
//                       Consignee (Ship to)
//                     </span>
//                     <br/>

//                     <div class="bold">
//                       SSV Telecom Private Limited FY 22-23
//                     </div>

//                     A-1, Landmark CHS, Sector 14<br/>
//                     Vashi, Navi Mumbai<br/>
//                     ${buyerGSTIN}<br/>
//                     GSTIN/UIN: 27AEGFS1650E1Z6<br/>
//                     State Name: Maharashtra, Code: 27

//                     <hr/>

//                     <span class="label">
//                       Supplier (Bill from)
//                     </span>
//                     <br/>

//                     ${selectedPO.vendor?.businessName || ' '}
//                     <br/>

//                     ${selectedPO.vendor?.address1 || ''},
//                     ${selectedPO.vendor?.city || ''}
//                     <br/>

//                     GSTIN/UIN:
//                     ${selectedPO.vendor?.gstNumber || 'N/A'}
//                     <br/>

//                     State Name:
//                     ${selectedPO.vendor?.state || 'N/A'},
//                     Code: ${vendorStateCode || 'N/A'}

//                     <div class="tax-details">
//                       <b>Transaction Type:</b>
//                       ${
//                         isIntraState
//                           ? 'INTRA-STATE (CGST+SGST)'
//                           : 'INTER-STATE (IGST)'
//                       }
//                     </div>

//                     <div class="tax-notice">
//                       ${
//                         isIntraState
//                           ? `CGST @${(taxRate / 2 * 100).toFixed(0)}% + SGST @${(taxRate / 2 * 100).toFixed(0)}% applicable`
//                           : `IGST @${(taxRate * 100).toFixed(0)}% applicable`
//                       }
//                     </div>
//                   </td>

//                   <td style="width:50%; padding:0;">
//                     <table class="meta-table">
//                       <tr>
//                         <td>
//                           <span class="label">
//                             Voucher No.
//                           </span>
//                           <br/>
//                           ${selectedPO.voucherNo || ''}
//                         </td>

//                         <td>
//                           <span class="label">
//                             Dated
//                           </span>
//                           <br/>
//                           ${invoiceDate}
//                         </td>
//                       </tr>

//                       <tr>
//                         <td></td>

//                         <td>
//                           <span class="label">
//                             Mode/Terms of Payment
//                           </span>
//                           <br/>
//                         </td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <span class="label">
//                             Reference No. & Date
//                           </span>
//                           <br/>
//                         </td>

//                         <td>
//                           <span class="label">
//                             Other References
//                           </span>
//                           <br/>
//                         </td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <span class="label">
//                             Dispatched through
//                           </span>
//                           <br/>
//                         </td>

//                         <td>
//                           <span class="label">
//                             Destination
//                           </span>
//                           <br/>
//                           <b>All Alpha Area</b>
//                         </td>
//                       </tr>

//                       <tr>
//                         <td colspan="2">
//                           <span class="label">
//                             Terms of Delivery
//                           </span>
//                           <br/>
//                         </td>
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>
//               </table>

//               <table
//                 class="main-border"
//                 style="margin-top:10px;"
//               >
//                 <thead>
//                   <tr>
//                     <th style="width: 5%;">Sl No.</th>
//                     <th style="width: 35%;">
//                       Description of Goods
//                     </th>
//                     <th style="width: 10%;">Due on</th>
//                     <th style="width: 10%;">Quantity</th>
//                     <th style="width: 10%;">Rate</th>
//                     <th style="width: 10%;">Per</th>
//                     <th style="width: 20%;">Amount</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   ${products
//                     .map(
//                       (product, i) => `
//                         <tr>
//                           <td>
//                             ${pageIndex * productsPerPage + i + 1}
//                           </td>

//                           <td>
//                             ${
//                               product.product?.productTitle ||
//                               'N/A'
//                             }
//                           </td>

//                           <td>
//                             ${new Date(
//                               selectedPO.date,
//                             ).toLocaleDateString('en-GB')}
//                           </td>

//                           <td class="right">
//                             ${product.purchasedQuantity}
//                           </td>

//                           <td class="right">
//                             ${product.price.toFixed(2)}
//                           </td>

//                           <td>
//                             ${
//                               product.product
//                                 ?.trackSerialNumber === 'Yes'
//                                 ? 'Pcs'
//                                 : 'Nos'
//                             }
//                           </td>

//                           <td class="right">
//                             ${(
//                               product.price *
//                               product.purchasedQuantity
//                             ).toFixed(2)}
//                           </td>
//                         </tr>
//                       `,
//                     )
//                     .join('')}

//                   ${
//                     pageIndex === pages.length - 1
//                       ? `
//                         <tr>
//                           <td
//                             colspan="5"
//                             rowspan="${isIntraState ? '5' : '3'}"
//                           ></td>

//                           <td>
//                             <b>Sub Total</b>
//                           </td>

//                           <td class="right">
//                             ${totalBeforeTax.toFixed(2)}
//                           </td>
//                         </tr>

//                         ${
//                           isIntraState
//                             ? `
//                               <tr>
//                                 <td>
//                                   <b>
//                                     CGST @${(taxRate / 2 * 100).toFixed(0)}%
//                                   </b>
//                                 </td>

//                                 <td class="right">
//                                   ${cgst.toFixed(2)}
//                                 </td>
//                               </tr>

//                               <tr>
//                                 <td>
//                                   <b>
//                                     SGST @${(taxRate / 2 * 100).toFixed(0)}%
//                                   </b>
//                                 </td>

//                                 <td class="right">
//                                   ${sgst.toFixed(2)}
//                                 </td>
//                               </tr>
//                             `
//                             : `
//                               <tr>
//                                 <td>
//                                   <b>
//                                     IGST @${(taxRate * 100).toFixed(0)}%
//                                   </b>
//                                 </td>

//                                 <td class="right">
//                                   ${igst.toFixed(2)}
//                                 </td>
//                               </tr>
//                             `
//                         }

//                         <tr>
//                           <td>
//                             <b>Round Off</b>
//                           </td>

//                           <td class="right">
//                             ${roundOff.toFixed(2)}
//                           </td>
//                         </tr>

//                         <tr>
//                           <td>
//                             <b>Grand Total</b>
//                           </td>

//                           <td class="right">
//                             ${total.toFixed(2)}
//                           </td>
//                         </tr>

//                         <tr>
//                           <td colspan="7">
//                             <b>
//                               Amount Chargeable (in words):
//                             </b>

//                             <i>
//                               INR
//                               ${numToWords(
//                                 Math.floor(total),
//                               )}
//                               Only
//                             </i>
//                           </td>
//                         </tr>
//                       `
//                       : ''
//                   }
//                 </tbody>
//               </table>

//               ${
//                 pageIndex === pages.length - 1
//                   ? `
//                     <div class="declaration-section">
//                       <div class="declaration-left">
//                         <div class="bold">
//                           Declaration
//                         </div>

//                         <div>
//                           Payment Terms & Conditions
//                         </div>

//                         <div>
//                           1. PO valid for 30 days
//                         </div>

//                         <div>
//                           2. Taxes will be applicable
//                         </div>

//                         <div>
//                           3. Default or damaged goods will not be accepted.
//                         </div>
//                       </div>

//                       <div class="declaration-right">
//                         <div class="bold">
//                           For SSV Telecom Private Limited
//                         </div>

//                         ${
//                           selectedPO.status === 'approved'
//                             ? `
//                               <div style="margin-top:20px">
//                                 <b>
//                                   ${
//                                     selectedPO.approvedBy
//                                       ?.fullName || 'N/A'
//                                   },
//                                 </b>

//                                 <p>
//                                   (${formatDate(
//                                     selectedPO.approvedAt,
//                                   )})
//                                 </p>
//                               </div>
//                             `
//                             : ''
//                         }

//                         <div class="signature-line">
//                           Authorised Signatory
//                         </div>
//                       </div>
//                     </div>

//                     <div class="computer-generated">
//                       This is a Computer Generated Document
//                     </div>
//                   `
//                   : ''
//               }

//               ${
//                 pageIndex < pages.length - 1
//                   ? `
//                     <div class="footer-note">
//                       continued ...
//                     </div>

//                     <div class="page-break"></div>
//                   `
//                   : ''
//               }
//             `,
//           )
//           .join('')}

//         <button
//           class="print-button"
//           onclick="window.print()"
//         >
//           🖨️ Print
//         </button>
//       </body>
//       </html>
//     `

//     const newWindow = window.open('', '_blank')

//     if (!newWindow) {
//       showError(
//         'Unable to open invoice window. Please allow pop-ups.',
//       )
//       return
//     }

//     newWindow.document.write(invoiceHTML)
//     newWindow.document.close()
//   }

//   const filteredCustomers = customers.filter(
//     (customer) => {
//       if (
//         activeSearch.keyword ||
//         activeSearch.outlet ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//       ) {
//         return true
//       }

//       return Object.values(customer).some((value) => {
//         if (
//           typeof value === 'object' &&
//           value !== null
//         ) {
//           return Object.values(value).some(
//             (nestedValue) =>
//               nestedValue &&
//               nestedValue
//                 .toString()
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase()),
//           )
//         }

//         return (
//           value &&
//           value
//             .toString()
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())
//         )
//       })
//     },
//   )

//   const approvePO = async (poId, voucherNo) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to approve PO: ${voucherNo}?`,
//     )

//     if (!confirmed) return

//     try {
//       setLoading(true)
//       closeAllDropdowns()

//       const response = await axiosInstance.put(
//         `/raisePO/${poId}/approve`,
//       )

//       if (response.data.success) {
//         showSuccess('PO approved successfully!')
//         fetchData(activeSearch, currentPage)
//       } else {
//         throw new Error(
//           response.data.message ||
//             'Failed to approve PO',
//         )
//       }
//     } catch (error) {
//       console.error(
//         'Error approving PO:',
//         error,
//       )

//       showError(
//         error.response?.data?.message ||
//           'Failed to approve PO',
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const rejectPO = async (poId, voucherNo) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to reject PO: ${voucherNo}?`,
//     )

//     if (!confirmed) return

//     try {
//       setLoading(true)
//       closeAllDropdowns()

//       const response = await axiosInstance.put(
//         `/raisePO/${poId}/reject`,
//       )

//       if (response.data.success) {
//         showSuccess('PO rejected successfully!')
//         fetchData(activeSearch, currentPage)
//       } else {
//         throw new Error(
//           response.data.message ||
//             'Failed to reject PO',
//         )
//       }
//     } catch (error) {
//       console.error(
//         'Error rejecting PO:',
//         error,
//       )

//       showError(
//         error.response?.data?.message ||
//           'Failed to reject PO',
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const revertToPending = async (
//     poId,
//     voucherNo,
//   ) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to revert PO: ${voucherNo} back to pending status?`,
//     )

//     if (!confirmed) return

//     try {
//       setLoading(true)
//       closeAllDropdowns()

//       const response = await axiosInstance.patch(
//         `/raisePO/${poId}/change-to-pending`,
//       )

//       if (response.data.success) {
//         showSuccess(
//           'PO reverted to pending successfully!',
//         )

//         fetchData(activeSearch, currentPage)
//       } else {
//         throw new Error(
//           response.data.message ||
//             'Failed to revert PO',
//         )
//       }
//     } catch (error) {
//       console.error(
//         'Error reverting PO:',
//         error,
//       )

//       showError(
//         error.response?.data?.message ||
//           'Failed to revert PO to pending',
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const hasActiveFilters =
//     activeSearch.keyword ||
//     activeSearch.outlet ||
//     activeSearch.startDate ||
//     activeSearch.endDate

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A'

//     const date = new Date(dateString)

//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex items-center gap-2 text-blue-600">
//           <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//           <span className="text-sm font-medium">
//             Loading...
//           </span>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         Error loading data: {error}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Title */}
//       <h1 className="mb-4 text-2xl font-semibold text-gray-800">
//         Raise PO
//       </h1>

//       {/* Search Modal */}
//       <SearchStockPurchase
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//       />

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {hasPermission(
//               'Purchase',
//               'add_purchase_stock',
//             ) && (
//               <Link to="/add-po">
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                 >
//                   <Plus size={16} />
//                   Add
//                 </button>
//               </Link>
//             )}

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

//             {hasActiveFilters && (
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
//               onClick={generateInvoice}
//               disabled={!selectedPO}
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Printer size={16} />
//               View PO
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* Body */}
//         <div className="p-5">
//           {/* Local Search */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="stockPurchaseSearch"
//                 className="text-sm font-medium text-gray-600"
//               >
//                 Search:
//               </label>

//               <input
//                 id="stockPurchaseSearch"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-8 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-[350px]"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto rounded-lg border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//                     Select
//                   </th>

//                   {[
//                     ['outlet', 'Branch'],
//                     ['date', 'Date'],
//                     ['voucherNo', 'Voucher NO'],
//                     ['vendor.businessName', 'Vendor'],
//                   ].map(([key, label]) => (
//                     <th
//                       key={key}
//                       onClick={() => handleSort(key)}
//                       className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:bg-gray-100"
//                     >
//                       <div className="flex items-center gap-1">
//                         {label}
//                         {getSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}

//                   {(userRole === 'admin' ||
//                     userRole === 'superadmin') && (
//                     <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//                       Action
//                     </th>
//                   )}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {filteredCustomers.length > 0 ? (
//                   filteredCustomers.map((customer) => (
//                     <tr
//                       key={customer._id}
//                       className={`transition ${
//                         customer.status === 'approved'
//                           ? 'bg-green-50'
//                           : customer.status ===
//                               'rejected'
//                             ? 'bg-red-50'
//                             : 'hover:bg-gray-50'
//                       }`}
//                     >
//                       {/* Select */}
//                       <td className="px-4 py-3">
//                         <input
//                           type="checkbox"
//                           name="selectedPO"
//                           checked={
//                             selectedPO?._id ===
//                             customer._id
//                           }
//                           onChange={() =>
//                             handleSelectPO(customer)
//                           }
//                           className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                       </td>

//                       {/* Branch */}
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         {customer.outlet?.centerName ||
//                           ''}
//                       </td>

//                       {/* Date */}
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         {formatDate(customer.date)}
//                       </td>

//                       {/* Voucher */}
//                       <td className="px-4 py-3 text-sm font-medium text-gray-800">
//                         {customer.voucherNo}
//                       </td>

//                       {/* Vendor */}
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         {customer.vendor
//                           ?.businessName || 'N/A'}
//                       </td>

//                       {/* Action */}
//                       {(userRole === 'admin' ||
//                         userRole ===
//                           'superadmin') && (
//                         <td className="px-4 py-3">
//                           <div
//                             className="relative"
//                             ref={(element) => {
//                               dropdownRefs.current[
//                                 customer._id
//                               ] = element
//                             }}
//                           >
//                             {customer.status ===
//                               'pending' && (
//                               <>
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     toggleDropdown(
//                                       customer._id,
//                                     )
//                                   }
//                                   className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//                                 >
//                                   <Settings
//                                     size={14}
//                                   />
//                                   Options
//                                   <ChevronDown
//                                     size={13}
//                                   />
//                                 </button>

//                                 {dropdownOpen[
//                                   customer._id
//                                 ] && (
//                                   <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         approvePO(
//                                           customer._id,
//                                           customer.voucherNo,
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-green-600 transition hover:bg-green-50"
//                                     >
//                                       <Check
//                                         size={15}
//                                       />
//                                       Approve
//                                     </button>

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         rejectPO(
//                                           customer._id,
//                                           customer.voucherNo,
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
//                                     >
//                                       <X size={15} />
//                                       Reject
//                                     </button>
//                                   </div>
//                                 )}
//                               </>
//                             )}

//                             {customer.status ===
//                               'rejected' && (
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   revertToPending(
//                                     customer._id,
//                                     customer.voucherNo,
//                                   )
//                                 }
//                                 className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-yellow-600"
//                               >
//                                 <Settings
//                                   size={14}
//                                 />
//                                 Revert
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={
//                         userRole === 'admin' ||
//                         userRole ===
//                           'superadmin'
//                           ? 6
//                           : 5
//                       }
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
//   )
// }

// export default StockPurchase


import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError, showSuccess } from '../../utils/sweetAlerts'
import usePermission from '../../utils/usePermission'
import SearchStockPurchase from '../stockPurchase/SearchStockPurchase'

const StockPurchase = () => {
  const [customers, setCustomers] = useState([])
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState({})
  const [activeSearch, setActiveSearch] = useState({
    keyword: '',
    outlet: '',
    startDate: '',
    endDate: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPO, setSelectedPO] = useState(null)

  const user = JSON.parse(localStorage.getItem('user')) || {}
  const userRole = (user?.role?.roleTitle || '').toLowerCase()

  const dropdownRefs = useRef({})
  const navigate = useNavigate()
  const { hasPermission } = usePermission()

  const numToWords = (num) => {
    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
    ]

    const teens = [
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ]

    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ]

    if (num === 0) return 'Zero'

    if (num < 10) {
      return ones[Math.floor(num)]
    }

    if (num < 20) {
      return teens[Math.floor(num) - 10]
    }

    if (num < 100) {
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? ` ${ones[num % 10]}` : '')
      )
    }

    if (num < 1000) {
      return (
        ones[Math.floor(num / 100)] +
        ' Hundred' +
        (num % 100 !== 0
          ? ` and ${numToWords(num % 100)}`
          : '')
      )
    }

    if (num < 100000) {
      return (
        numToWords(Math.floor(num / 1000)) +
        ' Thousand' +
        (num % 1000 !== 0
          ? ` ${numToWords(num % 1000)}`
          : '')
      )
    }

    if (num < 10000000) {
      return (
        numToWords(Math.floor(num / 100000)) +
        ' Lakh' +
        (num % 100000 !== 0
          ? ` ${numToWords(num % 100000)}`
          : '')
      )
    }

    return (
      numToWords(Math.floor(num / 10000000)) +
      ' Crore' +
      (num % 10000000 !== 0
        ? ` ${numToWords(num % 10000000)}`
        : '')
    )
  }

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      if (searchParams.keyword) {
        params.append('search', searchParams.keyword)
      }

      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet)
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate)
      }

      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/raisePO?${params.toString()}`
        : '/raisePO'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setCustomers(response.data.data)
        setCurrentPage(
          response.data.pagination.currentPage,
        )
        setTotalPages(
          response.data.pagination.totalPages,
        )
      } else {
        throw new Error(
          'API returned unsuccessful response',
        )
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(
        '/centers/?centerType=Outlet',
      )

      if (response.data.success) {
        setCenters(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCenters()
  }, [])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchData(activeSearch, page)
  }

  const handleSort = (key) => {
    let direction = 'ascending'

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }

    setSortConfig({
      key,
      direction,
    })

    const sortedCustomers = [...customers].sort((a, b) => {
      let aValue = a
      let bValue = b

      if (key.includes('.')) {
        const keys = key.split('.')

        aValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          a,
        )

        bValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
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

    setCustomers(sortedCustomers)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const closeAllDropdowns = () => {
    setDropdownOpen({})
  }

  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    fetchData(searchData, 1)
  }

  const handleResetSearch = () => {
    setActiveSearch({
      keyword: '',
      outlet: '',
      startDate: '',
      endDate: '',
    })

    setSearchTerm('')
    fetchData({}, 1)
  }

  const handleSelectPO = (po) => {
    if (selectedPO?._id === po._id) {
      setSelectedPO(null)
    } else {
      setSelectedPO(po)
    }
  }

  const generateInvoice = () => {
    if (!selectedPO) {
      showError('Please select a PO first')
      return
    }

    const invoiceDate = new Date()
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })
      .replace(/\//g, '-')

    const totalBeforeTax =
      selectedPO.products.reduce(
        (sum, product) =>
          sum +
          product.price * product.purchasedQuantity,
        0,
      )

    const vendorState =
      selectedPO.vendor?.state || ''

    const isIntraState = vendorState
      .toLowerCase()
      .includes('maharashtra')

    let cgst = 0
    let sgst = 0
    let igst = 0
    const taxRate = 0.18

    if (isIntraState) {
      cgst = totalBeforeTax * (taxRate / 2)
      sgst = totalBeforeTax * (taxRate / 2)
    } else {
      igst = totalBeforeTax * taxRate
    }

    const roundOff =
      Math.round(
        totalBeforeTax +
          cgst +
          sgst +
          igst,
      ) -
      (totalBeforeTax +
        cgst +
        sgst +
        igst)

    const total =
      totalBeforeTax +
      cgst +
      sgst +
      igst +
      roundOff

    const productsPerPage = 8
    const pages = []

    for (
      let i = 0;
      i < selectedPO.products.length;
      i += productsPerPage
    ) {
      pages.push(
        selectedPO.products.slice(
          i,
          i + productsPerPage,
        ),
      )
    }

    const getStateCodeFromGSTIN = (gstin) => {
      if (!gstin || gstin.length < 2) return ''

      return gstin.substring(0, 2)
    }

    const buyerGSTIN = '27ABECS3422Q1ZX'
    const buyerStateCode =
      getStateCodeFromGSTIN(buyerGSTIN)

    const vendorGSTIN =
      selectedPO.vendor?.gstNumber || ''

    const vendorStateCode =
      getStateCodeFromGSTIN(vendorGSTIN)

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${selectedPO.voucherNo}</title>

        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            font-family: Arial, sans-serif;
            color: #000;
            margin: 0;
            padding: 0;
          }

          @media screen {
            body {
              margin-left: 100px;
              margin-right: 100px;
              margin-top: 20px;
              margin-bottom: 20px;
            }

            .print-button {
              display: block;
              margin: 20px auto;
              padding: 10px 15px;
              background-color: #3c8dbc;
              color: white;
              border: none;
              font-size: 16px;
              cursor: pointer;
              position: sticky;
              top: 20px;
              z-index: 1000;
            }

            .print-button:hover {
              background-color: #3c8dbc;
            }
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
            }

            .print-button {
              display: none;
            }

            .page-break {
              page-break-before: always;
            }
          }

          .title {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin: 10px;
          }

          .main-border {
            border: 1px solid #000;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }

          .main-border td,
          .main-border th {
            border: 1px solid #000;
            padding: 5px;
            vertical-align: top;
          }

          .meta-table {
            width: 100%;
            border-collapse: collapse;
          }

          .meta-table td {
            border: 1px solid #000;
            padding: 6px;
            vertical-align: top;
          }

          .label {
            font-weight: bold;
          }

          .right {
            text-align: right;
          }

          .bold {
            font-weight: bold;
          }

          .footer-note {
            font-style: italic;
            text-align: right;
            margin-top: 4px;
          }

          hr {
            margin: 4px 0;
            border: none;
            border-top: 1px solid #000;
          }

          i {
            font-style: italic;
            margin-left: 10px;
          }

          .declaration-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          }

          .declaration-left {
            width: 48%;
          }

          .declaration-right {
            width: 48%;
            text-align: center;
          }

          .signature-line {
            margin-top: 60px;
            border-top: 1px solid #000;
            padding-top: 5px;
          }

          .computer-generated {
            text-align: center;
            font-style: italic;
            margin-top: 50px;
          }

          .tax-details {
            margin-top: 10px;
            font-size: 12px;
          }

          .tax-notice {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
          }
        </style>
      </head>

      <body>
        <div class="title">PURCHASE ORDER</div>

        ${pages
          .map(
            (products, pageIndex) => `
              <table class="main-border">
                <tr>
                  <td style="width:50%;">
                    <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
                      <p>Invoice To</p>

                      <div class="bold">
                        SSV Telecom Private Limited FY 22-23
                      </div>

                      A-1, Landmark CHS, Sector 14<br/>
                      Vashi, Navi Mumbai<br/>
                      ${buyerGSTIN}<br/>
                      GSTIN/UIN: ${buyerGSTIN}<br/>
                      State Name: Maharashtra, Code: ${buyerStateCode}
                    </div>

                    <span class="label">
                      Consignee (Ship to)
                    </span>
                    <br/>

                    <div class="bold">
                      SSV Telecom Private Limited FY 22-23
                    </div>

                    A-1, Landmark CHS, Sector 14<br/>
                    Vashi, Navi Mumbai<br/>
                    ${buyerGSTIN}<br/>
                    GSTIN/UIN: 27AEGFS1650E1Z6<br/>
                    State Name: Maharashtra, Code: 27

                    <hr/>

                    <span class="label">
                      Supplier (Bill from)
                    </span>
                    <br/>

                    ${selectedPO.vendor?.businessName || ' '}
                    <br/>

                    ${selectedPO.vendor?.address1 || ''},
                    ${selectedPO.vendor?.city || ''}
                    <br/>

                    GSTIN/UIN:
                    ${selectedPO.vendor?.gstNumber || 'N/A'}
                    <br/>

                    State Name:
                    ${selectedPO.vendor?.state || 'N/A'},
                    Code: ${vendorStateCode || 'N/A'}

                    <div class="tax-details">
                      <b>Transaction Type:</b>
                      ${
                        isIntraState
                          ? 'INTRA-STATE (CGST+SGST)'
                          : 'INTER-STATE (IGST)'
                      }
                    </div>

                    <div class="tax-notice">
                      ${
                        isIntraState
                          ? `CGST @${(taxRate / 2 * 100).toFixed(0)}% + SGST @${(taxRate / 2 * 100).toFixed(0)}% applicable`
                          : `IGST @${(taxRate * 100).toFixed(0)}% applicable`
                      }
                    </div>
                  </td>

                  <td style="width:50%; padding:0;">
                    <table class="meta-table">
                      <tr>
                        <td>
                          <span class="label">
                            Voucher No.
                          </span>
                          <br/>
                          ${selectedPO.voucherNo || ''}
                        </td>

                        <td>
                          <span class="label">
                            Dated
                          </span>
                          <br/>
                          ${invoiceDate}
                        </td>
                      </tr>

                      <tr>
                        <td></td>

                        <td>
                          <span class="label">
                            Mode/Terms of Payment
                          </span>
                          <br/>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span class="label">
                            Reference No. & Date
                          </span>
                          <br/>
                        </td>

                        <td>
                          <span class="label">
                            Other References
                          </span>
                          <br/>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span class="label">
                            Dispatched through
                          </span>
                          <br/>
                        </td>

                        <td>
                          <span class="label">
                            Destination
                          </span>
                          <br/>
                          <b>All Alpha Area</b>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="2">
                          <span class="label">
                            Terms of Delivery
                          </span>
                          <br/>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table
                class="main-border"
                style="margin-top:10px;"
              >
                <thead>
                  <tr>
                    <th style="width: 5%;">Sl No.</th>
                    <th style="width: 35%;">
                      Description of Goods
                    </th>
                    <th style="width: 10%;">Due on</th>
                    <th style="width: 10%;">Quantity</th>
                    <th style="width: 10%;">Rate</th>
                    <th style="width: 10%;">Per</th>
                    <th style="width: 20%;">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  ${products
                    .map(
                      (product, i) => `
                        <tr>
                          <td>
                            ${pageIndex * productsPerPage + i + 1}
                          </td>

                          <td>
                            ${
                              product.product?.productTitle ||
                              'N/A'
                            }
                          </td>

                          <td>
                            ${new Date(
                              selectedPO.date,
                            ).toLocaleDateString('en-GB')}
                          </td>

                          <td class="right">
                            ${product.purchasedQuantity}
                          </td>

                          <td class="right">
                            ${product.price.toFixed(2)}
                          </td>

                          <td>
                            ${
                              product.product
                                ?.trackSerialNumber === 'Yes'
                                ? 'Pcs'
                                : 'Nos'
                            }
                          </td>

                          <td class="right">
                            ${(
                              product.price *
                              product.purchasedQuantity
                            ).toFixed(2)}
                          </td>
                        </tr>
                      `,
                    )
                    .join('')}

                  ${
                    pageIndex === pages.length - 1
                      ? `
                        <tr>
                          <td
                            colspan="5"
                            rowspan="${isIntraState ? '5' : '3'}"
                          ></td>

                          <td>
                            <b>Sub Total</b>
                          </td>

                          <td class="right">
                            ${totalBeforeTax.toFixed(2)}
                          </td>
                        </tr>

                        ${
                          isIntraState
                            ? `
                              <tr>
                                <td>
                                  <b>
                                    CGST @${(taxRate / 2 * 100).toFixed(0)}%
                                  </b>
                                </td>

                                <td class="right">
                                  ${cgst.toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td>
                                  <b>
                                    SGST @${(taxRate / 2 * 100).toFixed(0)}%
                                  </b>
                                </td>

                                <td class="right">
                                  ${sgst.toFixed(2)}
                                </td>
                              </tr>
                            `
                            : `
                              <tr>
                                <td>
                                  <b>
                                    IGST @${(taxRate * 100).toFixed(0)}%
                                  </b>
                                </td>

                                <td class="right">
                                  ${igst.toFixed(2)}
                                </td>
                              </tr>
                            `
                        }

                        <tr>
                          <td>
                            <b>Round Off</b>
                          </td>

                          <td class="right">
                            ${roundOff.toFixed(2)}
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <b>Grand Total</b>
                          </td>

                          <td class="right">
                            ${total.toFixed(2)}
                          </td>
                        </tr>

                        <tr>
                          <td colspan="7">
                            <b>
                              Amount Chargeable (in words):
                            </b>

                            <i>
                              INR
                              ${numToWords(
                                Math.floor(total),
                              )}
                              Only
                            </i>
                          </td>
                        </tr>
                      `
                      : ''
                  }
                </tbody>
              </table>

              ${
                pageIndex === pages.length - 1
                  ? `
                    <div class="declaration-section">
                      <div class="declaration-left">
                        <div class="bold">
                          Declaration
                        </div>

                        <div>
                          Payment Terms & Conditions
                        </div>

                        <div>
                          1. PO valid for 30 days
                        </div>

                        <div>
                          2. Taxes will be applicable
                        </div>

                        <div>
                          3. Default or damaged goods will not be accepted.
                        </div>
                      </div>

                      <div class="declaration-right">
                        <div class="bold">
                          For SSV Telecom Private Limited
                        </div>

                        ${
                          selectedPO.status === 'approved'
                            ? `
                              <div style="margin-top:20px">
                                <b>
                                  ${
                                    selectedPO.approvedBy
                                      ?.fullName || 'N/A'
                                  },
                                </b>

                                <p>
                                  (${formatDate(
                                    selectedPO.approvedAt,
                                  )})
                                </p>
                              </div>
                            `
                            : ''
                        }

                        <div class="signature-line">
                          Authorised Signatory
                        </div>
                      </div>
                    </div>

                    <div class="computer-generated">
                      This is a Computer Generated Document
                    </div>
                  `
                  : ''
              }

              ${
                pageIndex < pages.length - 1
                  ? `
                    <div class="footer-note">
                      continued ...
                    </div>

                    <div class="page-break"></div>
                  `
                  : ''
              }
            `,
          )
          .join('')}

        <button
          class="print-button"
          onclick="window.print()"
        >
          🖨️ Print
        </button>
      </body>
      </html>
    `

    const newWindow = window.open('', '_blank')

    if (!newWindow) {
      showError(
        'Unable to open invoice window. Please allow pop-ups.',
      )
      return
    }

    newWindow.document.write(invoiceHTML)
    newWindow.document.close()
  }

  const filteredCustomers = customers.filter(
    (customer) => {
      if (
        activeSearch.keyword ||
        activeSearch.outlet ||
        activeSearch.startDate ||
        activeSearch.endDate
      ) {
        return true
      }

      return Object.values(customer).some((value) => {
        if (
          typeof value === 'object' &&
          value !== null
        ) {
          return Object.values(value).some(
            (nestedValue) =>
              nestedValue &&
              nestedValue
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          )
        }

        return (
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      })
    },
  )

  const approvePO = async (poId, voucherNo) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve PO: ${voucherNo}?`,
    )

    if (!confirmed) return

    try {
      setLoading(true)
      closeAllDropdowns()

      const response = await axiosInstance.put(
        `/raisePO/${poId}/approve`,
      )

      if (response.data.success) {
        showSuccess('PO approved successfully!')
        fetchData(activeSearch, currentPage)
      } else {
        throw new Error(
          response.data.message ||
            'Failed to approve PO',
        )
      }
    } catch (error) {
      console.error(
        'Error approving PO:',
        error,
      )

      showError(
        error.response?.data?.message ||
          'Failed to approve PO',
      )
    } finally {
      setLoading(false)
    }
  }

  const rejectPO = async (poId, voucherNo) => {
    const confirmed = window.confirm(
      `Are you sure you want to reject PO: ${voucherNo}?`,
    )

    if (!confirmed) return

    try {
      setLoading(true)
      closeAllDropdowns()

      const response = await axiosInstance.put(
        `/raisePO/${poId}/reject`,
      )

      if (response.data.success) {
        showSuccess('PO rejected successfully!')
        fetchData(activeSearch, currentPage)
      } else {
        throw new Error(
          response.data.message ||
            'Failed to reject PO',
        )
      }
    } catch (error) {
      console.error(
        'Error rejecting PO:',
        error,
      )

      showError(
        error.response?.data?.message ||
          'Failed to reject PO',
      )
    } finally {
      setLoading(false)
    }
  }

  const revertToPending = async (
    poId,
    voucherNo,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to revert PO: ${voucherNo} back to pending status?`,
    )

    if (!confirmed) return

    try {
      setLoading(true)
      closeAllDropdowns()

      const response = await axiosInstance.patch(
        `/raisePO/${poId}/change-to-pending`,
      )

      if (response.data.success) {
        showSuccess(
          'PO reverted to pending successfully!',
        )

        fetchData(activeSearch, currentPage)
      } else {
        throw new Error(
          response.data.message ||
            'Failed to revert PO',
        )
      }
    } catch (error) {
      console.error(
        'Error reverting PO:',
        error,
      )

      showError(
        error.response?.data?.message ||
          'Failed to revert PO to pending',
      )
    } finally {
      setLoading(false)
    }
  }

  const hasActiveFilters =
    activeSearch.keyword ||
    activeSearch.outlet ||
    activeSearch.startDate ||
    activeSearch.endDate

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

    const date = new Date(dateString)

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <span className="text-sm font-medium">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Error loading data: {error}
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page title */}
      <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Raise PO
      </h1>

      {/* Search Modal */}
      <SearchStockPurchase
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />

      {/* Main content card */}
      <div className="w-full overflow-hidden rounded-none border-0 bg-white shadow-none">
        {/* Blue top border + action bar */}
        <div className="border-t-[4px] border-[#2759A2] bg-white">
          <div className="flex min-h-[52px] items-center justify-between border-b border-[#e2e5e8] px-4 py-2.5">
            <div className="flex items-center gap-1">
              {hasPermission('Purchase', 'add_purchase_stock') && (
                <Link to="/add-po">
                  <button
                    type="button"
                    className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] border border-[#2759A2] bg-[#2759A2] px-3 text-[15px] font-semibold text-white shadow-none transition-colors hover:bg-[#1f4f91] focus:outline-none"
                  >
                    <Plus size={17} strokeWidth={2} />
                    Add
                  </button>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSearchModalVisible(true)}
                className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] border border-[#2759A2] bg-[#2759A2] px-3 text-[15px] font-semibold text-white shadow-none transition-colors hover:bg-[#1f4f91] focus:outline-none"
              >
                <Search size={17} strokeWidth={2} />
                Search
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] border border-[#2759A2] bg-[#2759A2] px-3 text-[15px] font-semibold text-white shadow-none transition-colors hover:bg-[#1f4f91] focus:outline-none"
                >
                  <RotateCcw size={16} strokeWidth={2} />
                  Reset Search
                </button>
              )}

              <button
                type="button"
                onClick={generateInvoice}
                disabled={!selectedPO}
className={`inline-flex h-[36px] items-center gap-1.5 rounded-[4px] border px-3 text-[15px] font-semibold shadow-none transition-colors focus:outline-none ${
  selectedPO
    ? 'border-[#2759a2] bg-[#2759a2] text-white hover:bg-[#1f4f91]'
    : 'cursor-not-allowed border-[#b7bcc2] bg-white text-[#777] hover:bg-[#f5f5f5] disabled:opacity-60'
}`}              >
                <Printer size={17} strokeWidth={1.8} />
                View PO
              </button>
            </div>

            <div className="shrink-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="px-4 pb-4 pt-3">
          {/* Local search */}
          <div className="mb-4 flex h-[45px] items-center justify-end border-b border-[#e5e7eb]">
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="stockPurchaseSearch"
                className="text-[15px] font-bold text-[#202124]"
              >
                Search:
              </label>

              <input
                id="stockPurchaseSearch"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[34px] w-[237px] rounded-[2px] border border-[#d6dce2] bg-white px-2.5 text-[14px] text-[#212529] outline-none transition-shadow focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
              />
            </div>
          </div>

          {/* Scrollable table - vertical scrolling only */}
          <div className="max-h-[520px] overflow-y-auto overflow-x-hidden border-0">
            <table className="w-full table-fixed border-collapse">
              <thead className="sticky top-0 z-10 bg-white">
                <tr>
                  <th
                    className="w-[6%] whitespace-nowrap border-b border-r border-[#e5e7eb] bg-white px-2 py-3 text-left text-[16px] font-bold text-[#111]"
                  >
                    Select
                  </th>

                  {[
                    ['outlet', 'Branch'],
                    ['date', 'Date'],
                    ['voucherNo', 'Voucher NO'],
                    ['vendor.businessName', 'Vendor'],
                  ].map(([key, label], index) => {
                    const widths = ['18%', '10%', '12%', '29%']

                    return (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        style={{ width: widths[index] }}
                        className="cursor-pointer whitespace-nowrap border-b border-r border-[#e5e7eb] bg-white px-2 py-3 text-left text-[16px] font-bold text-[#111] transition-colors hover:bg-[#f8f9fa]"
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          {getSortIcon(key)}
                        </div>
                      </th>
                    )
                  })}

                  {(userRole === 'admin' || userRole === 'superadmin') && (
                    <th className="w-[12%] whitespace-nowrap border-b border-[#e5e7eb] bg-white px-2 py-3 text-left text-[16px] font-bold text-[#111]">
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      className={`border-b border-[#e5e7eb] transition-colors ${
                        customer.status === 'approved'
                          ? 'bg-[#e7f3e2]'
                          : customer.status === 'rejected'
                            ? 'bg-[#efdada]'
                            : 'hover:bg-[#f7f7f7]'
                      }`}
                      style={
                        customer.status === 'approved' ||
                        customer.status === 'rejected'
                          ? undefined
                          : {
                              backgroundColor:
                                customers.indexOf(customer) % 2 === 0
                                  ? '#f1f1f1'
                                  : '#ffffff',
                            }
                      }
                    >
                      {/* Select */}
                      <td className="border-r border-[#e5e7eb] px-2 py-[10px] align-middle">
                        <input
                          type="checkbox"
                          name="selectedPO"
                          checked={selectedPO?._id === customer._id}
                          onChange={() => handleSelectPO(customer)}
className="h-[18px] w-[18px] cursor-pointer rounded-[3px] border border-[#d2d8de] accent-[#2759a2] focus:ring-1 focus:ring-[#2759a2]"                        />
                      </td>

                      {/* Branch */}
                      <td className="border-r border-[#e5e7eb] px-2 py-[10px] text-[16px] leading-6 text-[#111]">
                        {customer.outlet?.centerName || ''}
                      </td>

                      {/* Date */}
                      <td className="border-r border-[#e5e7eb] px-2 py-[10px] text-[16px] leading-6 text-[#111]">
                        {formatDate(customer.date)}
                      </td>

                      {/* Voucher */}
                      <td className="border-r border-[#e5e7eb] px-2 py-[10px] text-[16px] font-normal leading-6 text-[#111]">
                        {customer.voucherNo}
                      </td>

                      {/* Vendor */}
                      <td className="border-r border-[#e5e7eb] px-2 py-[10px] text-[16px] leading-6 text-[#111]">
                        {customer.vendor?.businessName || 'N/A'}
                      </td>

                      {/* Action */}
                      {(userRole === 'admin' || userRole === 'superadmin') && (
                        <td className="px-2 py-[10px] align-middle">
                          <div
                            className="relative"
                            ref={(element) => {
                              dropdownRefs.current[customer._id] = element
                            }}
                          >
                            {customer.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => toggleDropdown(customer._id)}
                                  className="inline-flex h-[34px] items-center gap-1.5 rounded-[5px] border border-[#b9bec5] bg-white px-2.5 text-[15px] font-normal text-[#30353b] shadow-none transition-colors hover:bg-[#f4f4f4] focus:outline-none"
                                >
                                  <Settings size={15} strokeWidth={1.8} />
                                  Options
                                  <ChevronDown size={14} strokeWidth={1.8} />
                                </button>

                                {dropdownOpen[customer._id] && (
                                  <div className="absolute right-0 z-30 mt-1 w-[145px] overflow-hidden rounded-[4px] border border-[#d8dde3] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        approvePO(
                                          customer._id,
                                          customer.voucherNo,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-green-600 transition-colors hover:bg-green-50"
                                    >
                                      <Check size={15} />
                                      Approve
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        rejectPO(
                                          customer._id,
                                          customer.voucherNo,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-red-600 transition-colors hover:bg-red-50"
                                    >
                                      <X size={15} />
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </>
                            )}

                            {customer.status === 'rejected' && (
                              <button
                                type="button"
                                onClick={() =>
                                  revertToPending(
                                    customer._id,
                                    customer.voucherNo,
                                  )
                                }
                                className="inline-flex h-[34px] items-center gap-1.5 rounded-[5px] border border-[#b9bec5] bg-white px-2.5 text-[15px] font-normal text-[#202124] shadow-none transition-colors hover:bg-[#f4f4f4] focus:outline-none"
                              >
                                <Settings size={15} strokeWidth={1.8} />
                                Revert
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={
                        userRole === 'admin' || userRole === 'superadmin'
                          ? 6
                          : 5
                      }
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockPurchase