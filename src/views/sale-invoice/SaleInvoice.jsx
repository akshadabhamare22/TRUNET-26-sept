import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowDown,
  ArrowUp,
  Ban,
  Check,
  ChevronDown,
  CloudDownload,
  FileText,
  FileSpreadsheet,
  Search,
  Settings,
  TriangleAlert,
  ZoomOut,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import Pagination from '../../utils/Pagination';
import {
  formatDate,
  formatDateTime,
} from '../../utils/FormatDateTime';

import ChallanModal from '../stockRequest/ChallanModal';
import SearchSaleInvoice from './SearchSaleInvoice';
import InvoiceSearch from './InvoiceSearch';
import CancelInvoiceModal from './CancelInvoiceModal';
import InvoiceDetailsModal from './InvoiceDetailsModal';

import { numToWords } from '../../utils/NumToWords';
import html2pdf from 'html2pdf.js';
import { exportToCSV } from '../../utils/ExportToCSV';
import usePermission from '../../utils/usePermission';

const SaleInvoices = () => {
  const [customers, setCustomers] =
    useState([]);

  const [invoices, setInvoices] =
    useState([]);

  const [centers, setCenters] =
    useState([]);

  const [resellers, setResellers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [invoiceLoading, setInvoiceLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: 'ascending',
    });

  const [searchTerm, setSearchTerm] =
    useState('');

  const [invoiceSearchTerm, setInvoiceSearchTerm] =
    useState('');

  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [invoiceSearchModalVisible, setInvoiceSearchModalVisible] =
    useState(false);

  const [selectedChallans, setSelectedChallans] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState('stockRequests');

  const [activeSearch, setActiveSearch] =
    useState({
      keyword: '',
      center: '',
      reseller: '',
      status: 'Completed',
      startDate: '',
      endDate: '',
    });

  const [invoiceSearch, setInvoiceSearch] =
    useState({
      invoiceNumber: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: '',
      status: '',
      cancelWithCreditNote: '',
    });

  const [currentPage, setCurrentPage] =
    useState(1);

  const [invoiceCurrentPage, setInvoiceCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [invoiceTotalPages, setInvoiceTotalPages] =
    useState(1);

  const [showChallanModal, setShowChallanModal] =
    useState(false);

  const [selectedChallan, setSelectedChallan] =
    useState(null);

  const [invoiceMetaData, setInvoiceMetaData] =
    useState(null);

  const [cancelModalVisible, setCancelModalVisible] =
    useState(false);

  const [selectedInvoiceForCancel, setSelectedInvoiceForCancel] =
    useState(null);

  const [invoiceDetailsModalVisible, setInvoiceDetailsModalVisible] =
    useState(false);

  const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] =
    useState(null);

  const [alertVisible, setAlertVisible] =
    useState(false);

  const [alertMessage, setAlertMessage] =
    useState('');

  const [alertColor, setAlertColor] =
    useState('success');

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const dropdownRefs =
    useRef({});

  const navigate = useNavigate();

  const { hasPermission } =
    usePermission();

  /* -------------------------------------------------------------------------- */
  /* ALERT                                                                      */
  /* -------------------------------------------------------------------------- */

  const showAlert = (
    message,
    color = 'success'
  ) => {
    setAlertMessage(message);
    setAlertColor(color);
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  /* -------------------------------------------------------------------------- */
  /* FETCH STOCK REQUESTS                                                       */
  /* -------------------------------------------------------------------------- */

  const fetchData = async (
    searchParams = {},
    page = 1
  ) => {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      params.append(
        'status',
        'Completed'
      );

      if (searchParams.center) {
        params.append(
          'center',
          searchParams.center
        );
      }

      if (searchParams.reseller) {
        params.append(
          'reseller',
          searchParams.reseller
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

      params.append('page', page);

      const url =
        `/stockrequest?${params.toString()}`;

      console.log(
        'API URL:',
        url
      );

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
        setCustomers(
          response.data.data
        );

        setCurrentPage(
          response.data.pagination
            .currentPage
        );

        setTotalPages(
          response.data.pagination
            .totalPages
        );
      } else {
        throw new Error(
          'API returned unsuccessful response'
        );
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

  /* -------------------------------------------------------------------------- */
  /* FETCH INVOICES                                                             */
  /* -------------------------------------------------------------------------- */

  const fetchInvoices = async (
    searchParams = {},
    page = 1
  ) => {
    try {
      setInvoiceLoading(true);

      const params =
        new URLSearchParams();

      if (searchParams.invoiceNumber) {
        params.append(
          'invoiceNumber',
          searchParams.invoiceNumber
        );
      }

      if (searchParams.reseller) {
        params.append(
          'resellerId',
          searchParams.reseller
        );
      }

      if (searchParams.center) {
        params.append(
          'center',
          searchParams.center
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

      if (searchParams.status) {
        params.append(
          'status',
          searchParams.status
        );
      }

      if (
        searchParams.cancelWithCreditNote
      ) {
        params.append(
          'cancelWithCreditNote',
          searchParams.cancelWithCreditNote
        );
      }

      params.append(
        'page',
        page
      );

      const url =
        `/invoice?${params.toString()}`;

      console.log(
        'Fetching invoices URL:',
        url
      );

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
        setInvoices(
          response.data.data || []
        );

        setInvoiceCurrentPage(
          response.data.pagination
            ?.currentPage || 1
        );

        setInvoiceTotalPages(
          response.data.pagination
            ?.totalPages || 1
        );
      } else {
        throw new Error(
          'API returned unsuccessful response'
        );
      }
    } catch (err) {
      console.error(
        'Error fetching invoices:',
        err
      );

      setInvoices([]);

      showAlert(
        `Error fetching invoices: ${
          err.message ||
          'Please try again'
        }`,
        'danger'
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* MASTER DATA                                                                */
  /* -------------------------------------------------------------------------- */

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
    } catch (err) {
      console.error(
        'Error fetching centers:',
        err
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
    } catch (err) {
      console.error(
        'Error fetching resellers:',
        err
      );
    }
  };

  const fetchRepairCosts = async () => {
    try {
      const response =
        await axiosInstance.get(
          '/repaired-cost'
        );

      if (response.data.success) {
        const repairCostMap =
          new Map();

        response.data.data.forEach(
          (item) => {
            if (
              item.product &&
              item.product._id
            ) {
              repairCostMap.set(
                item.product._id,
                item.repairCost
              );
            }
          }
        );

        return repairCostMap;
      }

      return new Map();
    } catch (err) {
      console.error(
        'Error fetching repair costs:',
        err
      );

      return new Map();
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SEARCH HELPERS                                                             */
  /* -------------------------------------------------------------------------- */

  const isSearchActive = () => {
    return !!(
      activeSearch.reseller ||
      activeSearch.center ||
      activeSearch.startDate ||
      activeSearch.endDate
    );
  };

  /* -------------------------------------------------------------------------- */
  /* MARK AS INVOICED                                                           */
  /* -------------------------------------------------------------------------- */

  const markAsInvoiced = async (
    stockRequestIds,
    invoiceNumber,
    invoiceDate,
    invoiceData
  ) => {
    try {
      const cleanInvoiceData = {
        resellerId:
          invoiceData.resellerId,

        centers:
          invoiceData.centers,

        products:
          invoiceData.products.map(
            (product) => ({
              productId:
                product.productId,

              productTitle:
                product.productTitle,

              hsnCode:
                product.hsnCode,

              quantity:
                product.quantity,

              outletQty:
                product.outletQty,

              damageRepairQty:
                product.damageRepairQty,

              centerReturnQty:
                product.centerReturnQty,

              outletRate:
                product.outletRate,

              repairRate:
                product.repairRate,

              centerReturnRate:
                product.centerReturnRate,

              outletAmount:
                product.outletAmount,

              damageRepairAmount:
                product.damageRepairAmount,

              centerReturnAmount:
                product.centerReturnAmount,

              totalAmount:
                product.totalAmount,

              unit:
                product.unit,
            })
          ),

        totalOutletAmount:
          invoiceData.totalOutletAmount,

        totalDamageRepairAmount:
          invoiceData.totalDamageRepairAmount,

        totalCenterReturnAmount:
          invoiceData.totalCenterReturnAmount,

        totalBeforeTax:
          invoiceData.totalBeforeTax,

        cgst:
          invoiceData.cgst,

        sgst:
          invoiceData.sgst,

        roundOff:
          invoiceData.roundOff,

        totalAmount:
          invoiceData.total,

        hsnSummary:
          invoiceData.hsnSummary.map(
            (item) => ({
              hsnCode:
                item.hsnCode,

              taxableValue:
                item.taxableValue,

              cgstAmount:
                item.cgstAmount,

              sgstAmount:
                item.sgstAmount,

              totalTax:
                item.totalTax,
            })
          ),

        metadata:
          invoiceData.metadata || {},

        invoiceHtml:
          invoiceData.invoiceHtml,
      };

      const response =
        await axiosInstance.post(
          '/invoice/mark-invoiced',
          {
            stockRequestIds,
            invoiceNumber,
            invoiceDate:
              invoiceDate ||
              new Date().toISOString(),
            invoiceData:
              cleanInvoiceData,
          }
        );

      if (response.data.success) {
        console.log(
          'Invoice saved to database:',
          response.data
        );

        return response.data;
      }

      throw new Error(
        response.data.message ||
          'Failed to mark as invoiced'
      );
    } catch (err) {
      console.error(
        'Error marking as invoiced:',
        err
      );

      if (
        err.response?.data?.message
      ) {
        throw new Error(
          err.response.data.message
        );
      }

      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* CANCEL INVOICE                                                             */
  /* -------------------------------------------------------------------------- */

  const handleCancelInvoice = async (
    cancelData
  ) => {
    try {
      if (
        !selectedInvoiceForCancel
      ) {
        return;
      }

      const response =
        await axiosInstance.put(
          `/invoice/${selectedInvoiceForCancel._id}/cancel`,
          {
            cancelReason:
              cancelData.cancelReason,

            cancelWithCreditNote:
              cancelData.cancelWithCreditNote,
          }
        );

      if (response.data.success) {
        showAlert(
          response.data.message,
          'success'
        );

        fetchInvoices(
          invoiceSearch,
          invoiceCurrentPage
        );

        setCancelModalVisible(
          false
        );

        setSelectedInvoiceForCancel(
          null
        );
      } else {
        throw new Error(
          response.data.message ||
            'Failed to cancel invoice'
        );
      }
    } catch (err) {
      console.error(
        'Error cancelling invoice:',
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to cancel invoice';

      showAlert(
        errorMessage,
        'danger'
      );

      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* DOWNLOAD INVOICE                                                           */
  /* -------------------------------------------------------------------------- */

  const handleDownloadInvoice = async (
    invoice
  ) => {
    try {
      if (!invoice.invoiceHtml) {
        alert(
          'Invoice HTML not available for download'
        );
        return;
      }

      const activeButton =
        document.activeElement;

      const originalButtonText =
        activeButton?.innerHTML;

      if (activeButton) {
        activeButton.innerHTML =
          '<span>Downloading PDF...</span>';

        activeButton.disabled = true;
      }

      const tempDiv =
        document.createElement('div');

      tempDiv.innerHTML =
        invoice.invoiceHtml;

      const scripts =
        tempDiv.getElementsByTagName(
          'script'
        );

      for (
        const script of scripts
      ) {
        if (
          script.textContent.includes(
            'window.print()'
          )
        ) {
          script.remove();
        }
      }

      const opt = {
        margin: [
          12,
          12,
          12,
          12,
        ],

        filename:
          `Invoice_${invoice.invoiceNumber.replace(
            /\//g,
            '_'
          )}.pdf`,

        image: {
          type: 'jpeg',
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
        },

        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
        },

        pagebreak: {
          mode: [
            'avoid-all',
            'css',
            'legacy',
          ],
        },
      };

      await html2pdf()
        .set(opt)
        .from(tempDiv)
        .save();

      if (activeButton) {
        activeButton.innerHTML =
          originalButtonText;

        activeButton.disabled = false;
      }
    } catch (err) {
      console.error(
        'Error generating PDF:',
        err
      );

      alert(
        `Error downloading PDF: ${
          err.message
        }`
      );

      if (invoice.invoiceHtml) {
        const blob =
          new Blob(
            [invoice.invoiceHtml],
            {
              type: 'text/html',
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const anchor =
          document.createElement(
            'a'
          );

        anchor.href = url;

        anchor.download =
          `Invoice_${invoice.invoiceNumber.replace(
            /\//g,
            '_'
          )}.html`;

        document.body.appendChild(
          anchor
        );

        anchor.click();

        document.body.removeChild(
          anchor
        );

        URL.revokeObjectURL(url);
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /* EXPORT INVOICES                                                            */
  /* -------------------------------------------------------------------------- */

  const handleExportInvoices =
    async () => {
      try {
        setInvoiceLoading(true);

        const params =
          new URLSearchParams();

        if (
          invoiceSearch.invoiceNumber
        ) {
          params.append(
            'invoiceNumber',
            invoiceSearch.invoiceNumber
          );
        }

        if (
          invoiceSearch.reseller
        ) {
          params.append(
            'resellerId',
            invoiceSearch.reseller
          );
        }

        if (
          invoiceSearch.center
        ) {
          params.append(
            'center',
            invoiceSearch.center
          );
        }

        if (
          invoiceSearch.startDate
        ) {
          params.append(
            'startDate',
            invoiceSearch.startDate
          );
        }

        if (
          invoiceSearch.endDate
        ) {
          params.append(
            'endDate',
            invoiceSearch.endDate
          );
        }

        if (
          invoiceSearch.status
        ) {
          params.append(
            'status',
            invoiceSearch.status
          );
        }

        if (
          invoiceSearch.cancelWithCreditNote
        ) {
          params.append(
            'cancelWithCreditNote',
            invoiceSearch.cancelWithCreditNote
          );
        }

        const url =
          `/invoice?${params.toString()}`;

        console.log(
          'Export URL:',
          url
        );

        const response =
          await axiosInstance.get(
            url
          );

        if (!response.data.success) {
          throw new Error(
            'Failed to fetch invoices for export'
          );
        }

        const invoiceList =
          response.data.data || [];

        if (
          invoiceList.length === 0
        ) {
          showAlert(
            'No invoices found to export',
            'warning'
          );
          return;
        }

        const headers = [
          {
            key: 'invoiceNumber',
            label: 'Invoice Number',
          },
          {
            key: 'invoiceDate',
            label: 'Invoice Date',
          },
          {
            key: 'resellerName',
            label: 'Reseller Name',
          },
          {
            key: 'resellerGST',
            label: 'Reseller GST',
          },
          {
            key: 'centerName',
            label: 'Branch/Center',
          },
          {
            key: 'challanNo',
            label: 'Challan No',
          },
          {
            key: 'productName',
            label: 'Product Description',
          },
          {
            key: 'hsnCode',
            label: 'HSN Code',
          },
          {
            key: 'quantity',
            label: 'Quantity',
          },
          {
            key: 'rate',
            label: 'Rate (₹)',
          },
          {
            key: 'totalAmount',
            label: 'Total (₹)',
          },
          {
            key: 'gstRate',
            label: 'GST Rate (%)',
          },
          {
            key: 'cgstAmount',
            label: 'CGST (₹)',
          },
          {
            key: 'sgstAmount',
            label: 'SGST (₹)',
          },
          {
            key: 'totalWithGST',
            label: 'Total with GST (₹)',
          },
          {
            key: 'status',
            label: 'Invoice Status',
          },
        ];

        const lineItems = [];

        invoiceList.forEach(
          (invoice) => {
            const invoiceDate =
              invoice.invoiceDate
                ? new Date(
                    invoice.invoiceDate
                  ).toLocaleDateString(
                    'en-GB'
                  )
                : '';

            const resellerName =
              invoice.reseller
                ?.businessName || '';

            const resellerGST =
              invoice.reseller
                ?.gstNumber || '';

            const centerNames =
              invoice.centers
                ?.map(
                  (center) =>
                    center.centerName
                )
                .join(', ') || '';

            const invoiceStatus =
              invoice.status ||
              'generated';

            const formattedStatus =
              invoiceStatus
                .charAt(0)
                .toUpperCase() +
              invoiceStatus.slice(1);

            const gstRate = 18;

            const challanNumbers =
              invoice.stockRequestIds
                ?.map(
                  (request) =>
                    request.challanNo
                )
                .filter(Boolean)
                .join(', ') || '';

            if (
              invoice.products &&
              invoice.products.length > 0
            ) {
              invoice.products.forEach(
                (product) => {
                  const productTotal =
                    product.totalAmount ||
                    0;

                  const cgstAmount =
                    productTotal *
                    0.09;

                  const sgstAmount =
                    productTotal *
                    0.09;

                  const totalWithGST =
                    productTotal +
                    cgstAmount +
                    sgstAmount;

                  const rate =
                    product.outletRate ||
                    product.repairRate ||
                    0;

                  lineItems.push({
                    invoiceNumber:
                      invoice.invoiceNumber ||
                      '',

                    invoiceDate,

                    resellerName,

                    resellerGST,

                    centerName:
                      centerNames,

                    challanNo:
                      challanNumbers,

                    productName:
                      product.productTitle ||
                      '',

                    hsnCode:
                      product.hsnCode ||
                      '',

                    quantity:
                      product.quantity ||
                      0,

                    rate:
                      rate.toFixed(2),

                    totalAmount:
                      productTotal.toFixed(
                        2
                      ),

                    gstRate,

                    cgstAmount:
                      cgstAmount.toFixed(
                        2
                      ),

                    sgstAmount:
                      sgstAmount.toFixed(
                        2
                      ),

                    totalWithGST:
                      totalWithGST.toFixed(
                        2
                      ),

                    status:
                      formattedStatus,
                  });
                }
              );
            } else {
              lineItems.push({
                invoiceNumber:
                  invoice.invoiceNumber ||
                  '',

                invoiceDate,

                resellerName,

                resellerGST,

                centerName:
                  centerNames,

                challanNo:
                  challanNumbers,

                productName:
                  'Multiple Products',

                hsnCode: '',

                quantity: '',

                rate: '',

                totalAmount:
                  invoice.totalBeforeTax
                    ?.toFixed(2) ||
                  '0.00',

                gstRate,

                cgstAmount:
                  invoice.cgst?.toFixed(
                    2
                  ) || '0.00',

                sgstAmount:
                  invoice.sgst?.toFixed(
                    2
                  ) || '0.00',

                totalWithGST:
                  invoice.totalAmount?.toFixed(
                    2
                  ) || '0.00',

                status:
                  formattedStatus,
              });
            }
          }
        );

        if (
          lineItems.length === 0
        ) {
          showAlert(
            'No line items found to export',
            'warning'
          );
          return;
        }

        let filename =
          'invoice_details';

        if (
          invoiceSearch.startDate &&
          invoiceSearch.endDate
        ) {
          filename +=
            `_${invoiceSearch.startDate}_to_${invoiceSearch.endDate}`;
        }

        if (
          invoiceSearch.reseller
        ) {
          const reseller =
            resellers.find(
              (item) =>
                item._id ===
                invoiceSearch.reseller
            );

          if (reseller) {
            filename +=
              `_${reseller.businessName.replace(
                /\s+/g,
                '_'
              )}`;
          }
        }

        const headerLabels =
          headers.map(
            (header) =>
              header.label
          );

        exportToCSV(
          lineItems,
          filename,
          headerLabels
        );

        showAlert(
          `Successfully exported ${lineItems.length} line items from ${invoiceList.length} invoices`,
          'success'
        );
      } catch (err) {
        console.error(
          'Error exporting invoices:',
          err
        );

        showAlert(
          `Error exporting invoices: ${
            err.message ||
            'Please try again'
          }`,
          'danger'
        );
      } finally {
        setInvoiceLoading(false);
      }
    };

  /* -------------------------------------------------------------------------- */
  /* MENU                                                                       */
  /* -------------------------------------------------------------------------- */

  const handleMenuClick = (
    event,
    invoiceId
  ) => {
    event.stopPropagation();

    setOpenMenuId(
      (previous) =>
        previous === invoiceId
          ? null
          : invoiceId
    );
  };

  const handleCloseMenu = () => {
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleOutsideClick =
      (event) => {
        if (!openMenuId) {
          return;
        }

        const menuElement =
          dropdownRefs.current[
            openMenuId
          ];

        if (
          menuElement &&
          !menuElement.contains(
            event.target
          )
        ) {
          setOpenMenuId(null);
        }
      };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, [openMenuId]);

  /* -------------------------------------------------------------------------- */
  /* SELECTION                                                                  */
  /* -------------------------------------------------------------------------- */

  const handleSelectChallan = (
    id
  ) => {
    if (isSearchActive()) {
      setSelectedChallans(
        (previous) => {
          if (
            previous.includes(id)
          ) {
            return previous.filter(
              (itemId) =>
                itemId !== id
            );
          }

          return [
            ...previous,
            id,
          ];
        }
      );
    } else {
      setSelectedChallans([
        id,
      ]);
    }
  };

  const handleSelectAll = (
    event
  ) => {
    if (!isSearchActive()) {
      return;
    }

    const nonInvoicedItems =
      filteredCustomers.filter(
        (customer) =>
          !customer.invoiceInfo
            ?.invoiceRaised
      );

    if (
      event.target.checked &&
      nonInvoicedItems.length > 0
    ) {
      const ids =
        nonInvoicedItems.map(
          (item) =>
            item._id
        );

      setSelectedChallans(ids);
    } else {
      setSelectedChallans([]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* INITIAL LOAD                                                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchResellers();

    if (
      activeTab === 'invoices'
    ) {
      fetchInvoices();
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* PAGINATION                                                                 */
  /* -------------------------------------------------------------------------- */

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

  const handleInvoicePageChange =
    (page) => {
      if (
        page < 1 ||
        page > invoiceTotalPages
      ) {
        return;
      }

      fetchInvoices(
        invoiceSearch,
        page
      );
    };

  /* -------------------------------------------------------------------------- */
  /* SORTING                                                                    */
  /* -------------------------------------------------------------------------- */

  const getNestedValue = (
    object,
    path
  ) => {
    return path
      .split('.')
      .reduce(
        (current, key) =>
          current?.[key],
        object
      );
  };

  const handleSort = (
    key
  ) => {
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

    const sortedCustomers =
      [...customers].sort(
        (a, b) => {
          const aValue =
            getNestedValue(
              a,
              key
            );

          const bValue =
            getNestedValue(
              b,
              key
            );

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

    setCustomers(
      sortedCustomers
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
        className="inline-block"
      />
    ) : (
      <ArrowDown
        size={14}
        className="inline-block"
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /* SEARCH                                                                     */
  /* -------------------------------------------------------------------------- */

  const handleStockRequestSearch =
    (searchData) => {
      const searchWithCompleted = {
        ...searchData,
        status: 'Completed',
      };

      setActiveSearch(
        searchWithCompleted
      );

      fetchData(
        searchWithCompleted,
        1
      );
    };

  const handleInvoiceSearch =
    (searchData) => {
      setInvoiceSearch(
        searchData
      );

      fetchInvoices(
        searchData,
        1
      );
    };

  const handleResetSearch = () => {
    const resetSearch = {
      center: '',
      reseller: '',
      startDate: '',
      endDate: '',
    };

    setActiveSearch(
      resetSearch
    );

    setSearchTerm('');

    setSelectedChallans([]);

    fetchData(
      resetSearch,
      1
    );
  };

  const handleResetInvoiceSearch =
    () => {
      const resetSearch = {
        invoiceNumber: '',
        reseller: '',
        center: '',
        startDate: '',
        endDate: '',
        status: '',
        cancelWithCreditNote:
          '',
      };

      setInvoiceSearch(
        resetSearch
      );

      setInvoiceSearchTerm('');

      fetchInvoices(
        resetSearch,
        1
      );
    };

  /* -------------------------------------------------------------------------- */
  /* FILTERED DATA                                                              */
  /* -------------------------------------------------------------------------- */

  const filteredCustomers =
    customers.filter(
      (customer) => {
        if (
          activeSearch.keyword ||
          activeSearch.center ||
          activeSearch.outlet
        ) {
          return true;
        }

        return Object.values(
          customer
        ).some((value) => {
          if (
            typeof value ===
              'object' &&
            value !== null
          ) {
            return Object.values(
              value
            ).some(
              (nestedValue) =>
                nestedValue &&
                nestedValue
                  .toString()
                  .toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  )
            );
          }

          return (
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
          );
        });
      }
    );

  const filteredInvoices =
    invoices.filter(
      (invoice) => {
        if (
          invoiceSearch.invoiceNumber ||
          invoiceSearch.reseller ||
          invoiceSearch.startDate ||
          invoiceSearch.endDate ||
          invoiceSearch.status ||
          invoiceSearch.cancelWithCreditNote
        ) {
          return true;
        }

        if (
          !invoiceSearchTerm.trim()
        ) {
          return true;
        }

        const searchLower =
          invoiceSearchTerm.toLowerCase();

        if (
          invoice.invoiceNumber
            ?.toLowerCase()
            .includes(searchLower)
        ) {
          return true;
        }

        if (
          invoice.reseller
            ?.businessName
            ?.toLowerCase()
            .includes(searchLower)
        ) {
          return true;
        }

        if (
          invoice.reseller
            ?.gstNumber
            ?.toLowerCase()
            .includes(searchLower)
        ) {
          return true;
        }

        return false;
      }
    );

  /* -------------------------------------------------------------------------- */
  /* CHALLAN                                                                    */
  /* -------------------------------------------------------------------------- */

  const handleGenerateChallan =
    (item) => {
      setSelectedChallan(item);
      setShowChallanModal(
        true
      );
    };

  const handleClick = (
    itemId
  ) => {
    navigate(
      `/SaleInvoice-profile/${itemId}`
    );
  };

  /* -------------------------------------------------------------------------- */
  /* GENERATE INVOICE                                                           */
  /* -------------------------------------------------------------------------- */

  const handleGenerateInvoice =
    async (metaData) => {
      let invoiceWindow = null;

      try {
        setInvoiceMetaData(
          metaData
        );

        const selectedData =
          customers.filter(
            (customer) =>
              selectedChallans.includes(
                customer._id
              )
          );

        if (
          selectedData.length ===
          0
        ) {
          return;
        }

        const currentYear =
          new Date().getFullYear();

        const invoiceNumber =
          `STEL/${currentYear}-${(
            currentYear + 1
          )
            .toString()
            .slice(2)}/${Math.floor(
            Math.random() * 1000
          )}`;

        const invoiceDate =
          new Date().toLocaleDateString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            }
          );

        const repairCostMap =
          await fetchRepairCosts();

        const reseller =
          selectedData[0]?.center
            ?.reseller;

        const allCenters = [
          ...new Set(
            selectedData
              .map(
                (item) =>
                  item.center?._id
              )
              .filter(Boolean)
          ),
        ];

        const centerNames = [
          ...new Set(
            selectedData
              .map(
                (item) =>
                  item.center
                    ?.centerName
              )
              .filter(Boolean)
          ),
        ];

        const centersList =
          centerNames.join(', ');

        const productMap =
          new Map();

        selectedData.forEach(
          (challan) => {
            challan.products.forEach(
              (product) => {
                const productId =
                  product.product
                    ?._id ||
                  product.product
                    ?.productTitle;

                const productTitle =
                  product.product
                    ?.productTitle ||
                  '';

                const hsnCode =
                  product.product
                    ?.hsnCode ||
                  '85176990';

                const salePrice =
                  product.product
                    ?.salePrice ||
                  product.rate ||
                  0;

                const repairCostPerUnit =
                  repairCostMap.get(
                    product.product?._id?.toString()
                  ) || 150;

                const sourceBreakdown =
                  product.sourceBreakdown ||
                  {};

                const hasValidSourceBreakdown =
                  sourceBreakdown.totalApproved >
                  0;

                let resellerQty =
                  0;

                let outletQty =
                  0;

                if (
                  hasValidSourceBreakdown
                ) {
                  resellerQty =
                    sourceBreakdown
                      .fromReseller
                      ?.quantity ||
                    0;

                  outletQty =
                    sourceBreakdown
                      .fromOutlet
                      ?.quantity ||
                    0;
                } else {
                  outletQty =
                    product.receivedQuantity ||
                    0;

                  resellerQty = 0;
                }

                const resellerStock =
                  product.resellerStock ||
                  {};

                const availableBreakdown =
                  resellerStock.availableBreakdown ||
                  {};

                let damageRepairQty =
                  0;

                let centerReturnQty =
                  0;

                if (
                  resellerQty > 0
                ) {
                  const totalDamageRepairInStock =
                    availableBreakdown.damageRepair ||
                    0;

                  const totalCenterReturnInStock =
                    availableBreakdown.centerReturn ||
                    0;

                  const totalResellerStockAvailable =
                    totalDamageRepairInStock +
                    totalCenterReturnInStock;

                  if (
                    totalResellerStockAvailable >
                    0
                  ) {
                    const damageRepairRatio =
                      totalDamageRepairInStock /
                      totalResellerStockAvailable;

                    damageRepairQty =
                      Math.min(
                        Math.round(
                          resellerQty *
                            damageRepairRatio
                        ),
                        totalDamageRepairInStock
                      );

                    centerReturnQty =
                      Math.min(
                        resellerQty -
                          damageRepairQty,
                        totalCenterReturnInStock
                      );

                    if (
                      damageRepairQty +
                        centerReturnQty !==
                      resellerQty
                    ) {
                      const remaining =
                        resellerQty -
                        damageRepairQty -
                        centerReturnQty;

                      if (
                        remaining > 0
                      ) {
                        if (
                          totalDamageRepairInStock -
                            damageRepairQty >
                          totalCenterReturnInStock -
                            centerReturnQty
                        ) {
                          damageRepairQty +=
                            remaining;
                        } else {
                          centerReturnQty +=
                            remaining;
                        }
                      }
                    }
                  } else {
                    damageRepairQty =
                      Math.round(
                        resellerQty / 2
                      );

                    centerReturnQty =
                      resellerQty -
                      damageRepairQty;
                  }
                }

                if (
                  !hasValidSourceBreakdown
                ) {
                  damageRepairQty = 0;
                  centerReturnQty = 0;
                }

                if (
                  productMap.has(
                    productId
                  )
                ) {
                  const existing =
                    productMap.get(
                      productId
                    );

                  const outletAmount =
                    outletQty *
                    salePrice;

                  const damageRepairAmount =
                    damageRepairQty *
                    repairCostPerUnit;

                  const centerReturnAmount =
                    centerReturnQty *
                    0;

                  existing.quantity +=
                    resellerQty +
                    outletQty;

                  existing.outletQty +=
                    outletQty;

                  existing.damageRepairQty +=
                    damageRepairQty;

                  existing.centerReturnQty +=
                    centerReturnQty;

                  existing.outletAmount +=
                    outletAmount;

                  existing.damageRepairAmount +=
                    damageRepairAmount;

                  existing.centerReturnAmount +=
                    centerReturnAmount;

                  existing.totalAmount +=
                    outletAmount +
                    damageRepairAmount +
                    centerReturnAmount;
                } else {
                  const outletAmount =
                    outletQty *
                    salePrice;

                  const damageRepairAmount =
                    damageRepairQty *
                    repairCostPerUnit;

                  const centerReturnAmount =
                    centerReturnQty *
                    0;

                  productMap.set(
                    productId,
                    {
                      productId:
                        product.product?._id,

                      productTitle,

                      hsnCode,

                      quantity:
                        resellerQty +
                        outletQty,

                      outletQty,

                      damageRepairQty,

                      centerReturnQty,

                      outletRate:
                        salePrice,

                      repairRate:
                        repairCostPerUnit,

                      centerReturnRate: 0,

                      outletAmount,

                      damageRepairAmount,

                      centerReturnAmount,

                      totalAmount:
                        outletAmount +
                        damageRepairAmount +
                        centerReturnAmount,

                      unit: 'Nos',
                    }
                  );
                }
              }
            );
          }
        );

        const combinedProducts =
          Array.from(
            productMap.values()
          );

        const nonZeroProducts =
          combinedProducts.filter(
            (product) =>
              product.quantity > 0
          );

        if (
          nonZeroProducts.length ===
          0
        ) {
          alert(
            'No products with quantity > 0 found in selected stock requests'
          );
          return;
        }

        const totalOutletAmount =
          nonZeroProducts.reduce(
            (sum, product) =>
              sum +
              product.outletAmount,
            0
          );

        const totalDamageRepairAmount =
          nonZeroProducts.reduce(
            (sum, product) =>
              sum +
              product.damageRepairAmount,
            0
          );

        const totalCenterReturnAmount =
          nonZeroProducts.reduce(
            (sum, product) =>
              sum +
              product.centerReturnAmount,
            0
          );

        const totalBeforeTax =
          totalOutletAmount +
          totalDamageRepairAmount +
          totalCenterReturnAmount;

        const cgst =
          totalBeforeTax *
          0.09;

        const sgst =
          totalBeforeTax *
          0.09;

        const roundOff =
          Math.round(
            totalBeforeTax +
              cgst +
              sgst
          ) -
          (totalBeforeTax +
            cgst +
            sgst);

        const total =
          totalBeforeTax +
          cgst +
          sgst +
          roundOff;

        const hsnMap =
          new Map();

        nonZeroProducts.forEach(
          (product) => {
            const hsn =
              product.hsnCode;

            const taxableValue =
              product.totalAmount;

            const cgstAmount =
              taxableValue *
              0.09;

            const sgstAmount =
              taxableValue *
              0.09;

            const totalTax =
              cgstAmount +
              sgstAmount;

            if (
              hsnMap.has(hsn)
            ) {
              const existing =
                hsnMap.get(hsn);

              existing.taxableValue +=
                taxableValue;

              existing.cgstAmount +=
                cgstAmount;

              existing.sgstAmount +=
                sgstAmount;

              existing.totalTax +=
                totalTax;
            } else {
              hsnMap.set(
                hsn,
                {
                  hsnCode: hsn,
                  taxableValue,
                  cgstAmount,
                  sgstAmount,
                  totalTax,
                }
              );
            }
          }
        );

        const hsnSummary =
          Array.from(
            hsnMap.values()
          );

        const productsPerPage = 8;

        const pages = [];

        for (
          let i = 0;
          i <
          nonZeroProducts.length;
          i += productsPerPage
        ) {
          pages.push(
            nonZeroProducts.slice(
              i,
              i + productsPerPage
            )
          );
        }

        /* ------------------------------------------------------------------ */
        /* INVOICE HTML                                                        */
        /* ------------------------------------------------------------------ */

        const invoiceHTML = `
<html>
<head>
<title>
Invoice - ${
          reseller?.businessName ||
          'SSV Alpha Broadband LLP'
        }
</title>

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
}

@media print {
  body {
    margin: 0;
    padding: 0;
  }

  @page {
    margin: 12mm;
  }
}

.title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  margin: 6px 0;
}

.main-border {
  border: 1px solid #000;
  width: 100%;
  border-collapse: collapse;
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

.repair-note {
  color: #666;
  font-size: 0.9em;
}

.free-note {
  color: green;
  font-size: 0.9em;
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

@media print {
  .page-break {
    page-break-before: always;
  }

  .no-print {
    display: none;
  }

  .print-button {
    display: none;
  }
}
</style>
</head>

<body>

<div class="title">
Tax Invoice
</div>

${pages
  .map(
    (products, pageIndex) => `
<table class="main-border">

<tr>

<td style="width:50%;">

<div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">

<div class="bold">
SSV Telecom Private Limited FY 22-23
</div>

A-1, Landmark CHS, Sector 14<br/>
Vashi, Navi Mumbai<br/>
27ABECS3422Q1ZX<br/>
GSTIN/UIN: 27ABECS3422Q1ZX

</div>

<span class="label">
Consignee (Ship to)
</span>
<br/>

${
  reseller?.businessName ||
  'SSV Alpha Broadband LLP'
}

<br/>

${centersList || 'All Alpha Area'}

<br/><br/>

GSTIN/UIN:
${
  reseller?.gstNumber ||
  '27AEGFS1650E1Z6'
}

<br/>

State Name :
${
  reseller?.state ||
  'Maharashtra'
},
Code : 27

<hr/>

<span class="label">
Buyer (Bill to)
</span>
<br/>

${
  reseller?.businessName ||
  'SSV Alpha Broadband LLP'
}

<br/>

${
  reseller?.address1 ||
  'A/3, Landmark Soc, Sector-14, Vashi'
}

<br/>

GSTIN/UIN:
${
  reseller?.gstNumber ||
  '27AEGFS1650E1Z6'
}

<br/>

State Name :
${
  reseller?.state ||
  'Maharashtra'
},
Code : 27

</td>

<td style="width:50%; padding:0;">

<table class="meta-table">

<tr>
<td>
<span class="label">Invoice No.</span>
<br/>
${invoiceNumber}
</td>

<td>
<span class="label">Dated</span>
<br/>
${invoiceDate}
</td>
</tr>

<tr>
<td>
<span class="label">Delivery Note</span>
<br/>
${metaData?.deliveryNote || ''}
</td>

<td>
<span class="label">
Mode/Terms of Payment
</span>
<br/>
${metaData?.modeOfPayment || ''}
</td>
</tr>

<tr>
<td>
<span class="label">
Reference No. & Date
</span>
<br/>
${metaData?.referenceNo || ''}
${
  metaData?.referenceDate
    ? new Date(
        metaData.referenceDate
      ).toLocaleDateString()
    : ''
}
</td>

<td>
<span class="label">
Other References
</span>
<br/>
${metaData?.otherReferences || ''}
</td>
</tr>

<tr>
<td>
<span class="label">
Buyer's Order No.
</span>
<br/>
${metaData?.buyerOrderNo || ''}
</td>

<td>
<span class="label">Dated</span>
<br/>
${
  metaData?.buyerOrderDate
    ? new Date(
        metaData.buyerOrderDate
      ).toLocaleDateString()
    : ''
}
</td>
</tr>

<tr>
<td>
<span class="label">
Dispatch Doc No.
</span>
<br/>
${
  metaData?.dispatchDocNo ||
  '16.07-31.07.25'
}
</td>

<td>
<span class="label">
Delivery Note Date
</span>
<br/>
${
  metaData?.deliveryNoteDate
    ? new Date(
        metaData.deliveryNoteDate
      ).toLocaleDateString()
    : ''
}
</td>
</tr>

<tr>
<td>
<span class="label">
Dispatched through
</span>
<br/>
${metaData?.dispatchedThrough || ''}
</td>

<td>
<span class="label">
Destination
</span>
<br/>
<b>
${
  metaData?.destination ||
  'All Alpha Area'
}
</b>
</td>
</tr>

<tr>
<td colspan="2">
<span class="label">
Terms of Delivery
</span>
<br/>
${metaData?.termsOfDelivery || ''}
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
<th>Sl No.</th>
<th>Description of Goods</th>
<th>HSN/SAC</th>
<th>Quantity</th>
<th>Rate</th>
<th>Per</th>
<th>Amount</th>
</tr>

</thead>

<tbody>

${products
  .map(
    (product, index) => {
      const productIndex =
        pageIndex *
          productsPerPage +
        index +
        1;

      let rows = [];

      if (
        product.outletQty > 0
      ) {
        rows.push(`
<tr>

<td>
${productIndex}
</td>

<td>
${product.productTitle}
</td>

<td>
${product.hsnCode}
</td>

<td class="right">
${product.outletQty}
</td>

<td class="right">
${product.outletRate.toFixed(2)}
</td>

<td>
${product.unit}
</td>

<td class="right">
${product.outletAmount.toFixed(2)}
</td>

</tr>
`);
      }

      if (
        product.damageRepairQty >
        0
      ) {
        rows.push(`
<tr>

<td></td>

<td>
${product.productTitle}

<span class="repair-note">
(Damage Repair - Charged @₹${
          product.repairRate
        }/unit)
</span>

</td>

<td>
${product.hsnCode}
</td>

<td class="right">
${product.damageRepairQty}
</td>

<td class="right">
${product.repairRate.toFixed(2)}
</td>

<td>
${product.unit}
</td>

<td class="right">
${product.damageRepairAmount.toFixed(
          2
        )}
</td>

</tr>
`);
      }

      if (
        product.centerReturnQty >
        0
      ) {
        rows.push(`
<tr>

<td></td>

<td>
${product.productTitle}

<span class="free-note">
(Center Return - Free)
</span>

</td>

<td>
${product.hsnCode}
</td>

<td class="right">
${product.centerReturnQty}
</td>

<td class="right">
${product.centerReturnRate.toFixed(
          2
        )}
</td>

<td>
${product.unit}
</td>

<td class="right">
${product.centerReturnAmount.toFixed(
          2
        )}
</td>

</tr>
`);
      }

      return rows.join('');
    }
  )
  .join('')}

${
  pageIndex ===
  pages.length - 1
    ? `

<tr>
<td colspan="4" rowspan="7"></td>

<td colspan="2">
<b>
Subtotal (New Stock from Outlet)
</b>
</td>

<td class="right">
${totalOutletAmount.toFixed(2)}
</td>
</tr>

<tr>
<td colspan="2">
<b>
Subtotal (Damage Repair)
</b>
</td>

<td class="right">
${totalDamageRepairAmount.toFixed(
          2
        )}
</td>
</tr>

<tr>
<td colspan="2">
<b>Total Before Tax</b>
</td>

<td class="right">
${totalBeforeTax.toFixed(2)}
</td>
</tr>

<tr>
<td colspan="2">
<b>Output CGST @9%</b>
</td>

<td class="right">
${cgst.toFixed(2)}
</td>
</tr>

<tr>
<td colspan="2">
<b>Output SGST @9%</b>
</td>

<td class="right">
${sgst.toFixed(2)}
</td>
</tr>

<tr>
<td colspan="2">
<b>Round Off</b>
</td>

<td class="right">
${roundOff.toFixed(2)}
</td>
</tr>

<tr>
<td colspan="2">
<b>Total</b>
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
${numToWords(total)}
</i>

</td>
</tr>

`
    : ''
}

</tbody>

</table>

${
  pageIndex <
  pages.length - 1
    ? `
<div class="footer-note">
continued ...
</div>

<div class="page-break"></div>
`
    : ''
}

`
  )
  .join('')}

<div class="page-break"></div>

<div
  style="
    display:flex;
    justify-content:space-between;
    margin-top:10px;
  "
>

<div>
Invoice No.
<strong>
${invoiceNumber}
</strong>
</div>

<div>
Dated
<strong>
${invoiceDate}
</strong>
</div>

</div>

<div style="text-align:center;">

<p>

<strong>
SSV Telecom Private Limited
</strong>

<br/>

A-1, Landmark CHS, Sector 14
<br/>

Vashi , Navi Mumbai
<br/>

27ABECS3422Q1ZX
<br/>

GSTIN/UIN: 27ABECS3422Q1ZX

<br/><br/>

Party:
<strong>
SSV Telecom Private Limited
</strong>

<br/>

A/3, Landmark Soc, Sector-14 , Vashi
<br/>

Navi Mumbai
<br/>

GSTIN/UIN : 27AEGFS1650E1Z6
<br/>

State Name : Maharashtra, Code : 27

</p>

</div>

<table
  class="main-border"
  style="margin-top:10px;"
>

<thead>

<tr>

<th>HSN/SAC</th>

<th>Taxable Value</th>

<th colspan="2">
CGST
</th>

<th colspan="2">
SGST
</th>

<th>
Total Tax Amount
</th>

</tr>

<tr>

<th></th>
<th></th>

<th>Rate</th>
<th>Amount</th>

<th>Rate</th>
<th>Amount</th>

<th></th>

</tr>

</thead>

<tbody>

${hsnSummary
  .map(
    (hsn) => `
<tr>

<td>
${hsn.hsnCode}
</td>

<td class="right">
${hsn.taxableValue.toFixed(2)}
</td>

<td>
9%
</td>

<td class="right">
${hsn.cgstAmount.toFixed(2)}
</td>

<td>
9%
</td>

<td class="right">
${hsn.sgstAmount.toFixed(2)}
</td>

<td class="right">
${hsn.totalTax.toFixed(2)}
</td>

</tr>
`
  )
  .join('')}

<tr class="bold">

<td>
<b>Total</b>
</td>

<td class="right">
${totalBeforeTax.toFixed(2)}
</td>

<td></td>

<td class="right">
${cgst.toFixed(2)}
</td>

<td></td>

<td class="right">
${sgst.toFixed(2)}
</td>

<td class="right">
${(cgst + sgst).toFixed(2)}
</td>

</tr>

<tr>

<td colspan="7">

<b>
Taxable Amount (in words):
</b>

<i>
${numToWords(
  parseFloat(
    (
      cgst + sgst
    ).toFixed(2)
  )
)}
</i>

</td>

</tr>

</tbody>

</table>

<button
  class="print-button no-print"
  onclick="window.print()"
>
🖨️ Print
</button>

</body>
</html>
`;

        const invoiceData = {
          resellerId:
            reseller?._id,

          centers:
            allCenters,

          products:
            nonZeroProducts,

          totalOutletAmount,

          totalDamageRepairAmount,

          totalCenterReturnAmount,

          totalBeforeTax,

          cgst,

          sgst,

          roundOff,

          total,

          hsnSummary,

          metadata: {
            deliveryNote:
              metaData?.deliveryNote ||
              '',

            modeOfPayment:
              metaData?.modeOfPayment ||
              '',

            referenceNo:
              metaData?.referenceNo ||
              '',

            referenceDate:
              metaData?.referenceDate ||
              null,

            otherReferences:
              metaData?.otherReferences ||
              '',

            buyerOrderNo:
              metaData?.buyerOrderNo ||
              '',

            buyerOrderDate:
              metaData?.buyerOrderDate ||
              null,

            dispatchDocNo:
              metaData?.dispatchDocNo ||
              '',

            deliveryNoteDate:
              metaData?.deliveryNoteDate ||
              null,

            dispatchedThrough:
              metaData?.dispatchedThrough ||
              '',

            destination:
              metaData?.destination ||
              centersList ||
              'All Alpha Area',

            termsOfDelivery:
              metaData?.termsOfDelivery ||
              '',
          },

          invoiceHtml,
        };

        let saveSuccess =
          false;

        try {
          const invoicedResponse =
            await markAsInvoiced(
              selectedChallans,
              invoiceNumber,
              new Date().toISOString(),
              invoiceData
            );

          if (
            invoicedResponse.success
          ) {
            console.log(
              'Successfully saved invoice to database:',
              invoicedResponse.message
            );

            saveSuccess = true;
          } else {
            throw new Error(
              invoicedResponse.message ||
                'Failed to save invoice'
            );
          }
        } catch (
          saveError
        ) {
          console.error(
            'Error saving invoice to database:',
            saveError
          );
        }

        invoiceWindow =
          window.open(
            '',
            '_blank'
          );

        if (invoiceWindow) {
          invoiceWindow.document.write(
            invoiceHTML
          );

          invoiceWindow.document.close();
        } else {
          throw new Error(
            'Could not open invoice window. Please allow popups.'
          );
        }

        fetchData(
          activeSearch,
          currentPage
        );

        setSelectedChallans(
          []
        );

        if (saveSuccess) {
          if (
            activeTab ===
            'invoices'
          ) {
            fetchInvoices(
              invoiceSearch,
              invoiceCurrentPage
            );
          }
        } else {
          alert(
            `Invoice ${invoiceNumber} generated but could not be saved to database. Please contact administrator.`
          );
        }
      } catch (err) {
        console.error(
          'Error generating invoice:',
          err
        );

        if (
          invoiceWindow &&
          invoiceWindow.document
        ) {
          invoiceWindow.document.write(`
<html>
<body>
<h2>Error Generating Invoice</h2>
<p>
${err.message ||
  'Unknown error occurred'}
</p>
<button onclick="window.close()">
Close
</button>
</body>
</html>
`);

          invoiceWindow.document.close();
        }

        alert(
          `Error generating invoice: ${
            err.message ||
            'Please try again'
          }`
        );
      }
    };

  /* -------------------------------------------------------------------------- */
  /* TAB CHANGE                                                                 */
  /* -------------------------------------------------------------------------- */

  const handleTabChange = (
    tab
  ) => {
    setActiveTab(tab);

    if (
      tab === 'invoices'
    ) {
      fetchInvoices();
    } else {
      fetchData();
    }

    setActiveSearch({
      keyword: '',
      center: '',
      reseller: '',
      status: 'Completed',
      startDate: '',
      endDate: '',
    });

    setInvoiceSearch({
      invoiceNumber: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: '',
      status: '',
      cancelWithCreditNote:
        '',
    });

    setSearchTerm('');

    setInvoiceSearchTerm('');

    setSelectedChallans([]);
  };

  const handleViewInvoiceDetails =
    (invoice) => {
      setSelectedInvoiceForDetails(
        invoice
      );

      setInvoiceDetailsModalVisible(
        true
      );
    };

  /* -------------------------------------------------------------------------- */
  /* SORTABLE HEADER                                                            */
  /* -------------------------------------------------------------------------- */

  const SortableHeader = ({
    children,
    sortKey,
  }) => (
    <th
      onClick={() =>
        handleSort(sortKey)
      }
      className="cursor-pointer whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-100"
    >
      <div className="flex items-center gap-1">
        {children}

        {getSortIcon(sortKey)}
      </div>
    </th>
  );

  /* -------------------------------------------------------------------------- */
  /* STOCK REQUEST TABLE                                                        */
  /* -------------------------------------------------------------------------- */

  const renderStockRequestTable =
    () => {
      const searchActive =
        isSearchActive();

      const nonInvoicedItems =
        filteredCustomers.filter(
          (customer) =>
            !customer.invoiceInfo
              ?.invoiceRaised
        );

      const allSelected =
        searchActive &&
        nonInvoicedItems.length >
          0 &&
        nonInvoicedItems.every(
          (item) =>
            selectedChallans.includes(
              item._id
            )
        );

      return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-[1200px] w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left">
                  {searchActive &&
                  nonInvoicedItems.length >
                    0 ? (
                    <input
                      type="checkbox"
                      checked={
                        allSelected
                      }
                      onChange={
                        handleSelectAll
                      }
                      title="Select all non-invoiced items"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      Select
                    </span>
                  )}
                </th>

                <SortableHeader sortKey="date">
                  Order Date
                </SortableHeader>

                <SortableHeader sortKey="orderNumber">
                  Order Number
                </SortableHeader>

                <SortableHeader sortKey="challanNo">
                  Challan No
                </SortableHeader>

                <SortableHeader sortKey="challanDate">
                  Challan Date
                </SortableHeader>

                <SortableHeader sortKey="warehouse.centerName">
                  Warehouse
                </SortableHeader>

                <SortableHeader sortKey="center.centerName">
                  Branch
                </SortableHeader>

                <SortableHeader sortKey="createdBy.email">
                  Posted By
                </SortableHeader>

                <SortableHeader sortKey="completionInfo.completedOn">
                  Completed At
                </SortableHeader>

                <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length >
              0 ? (
                filteredCustomers.map(
                  (item) => {
                    const isInvoiceRaised =
                      item.invoiceInfo
                        ?.invoiceRaised;

                    return (
                      <tr
                        key={
                          item._id
                        }
                        className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                          isInvoiceRaised
                            ? 'bg-gray-50'
                            : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          {!isInvoiceRaised &&
                            (searchActive ? (
                              <input
                                type="checkbox"
                                checked={selectedChallans.includes(
                                  item._id
                                )}
                                onChange={() =>
                                  handleSelectChallan(
                                    item._id
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            ) : (
                              <input
                                type="radio"
                                name="selectedChallan"
                                checked={selectedChallans.includes(
                                  item._id
                                )}
                                onChange={() =>
                                  handleSelectChallan(
                                    item._id
                                  )
                                }
                                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            ))}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {formatDate(
                            item.date
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleClick(
                                item._id
                              )
                            }
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {
                              item.orderNumber
                            }
                          </button>

                          {isInvoiceRaised && (
                            <div className="mt-1 text-xs text-gray-500">
                              Invoice:{' '}
                              {
                                item
                                  .invoiceInfo
                                  ?.invoiceNumber
                              }
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleGenerateChallan(
                                item
                              )
                            }
                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {item.challanNo ||
                              'N/A'}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.challanDate
                            ? formatDate(
                                item.challanDate
                              )
                            : 'N/A'}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {
                            item.warehouse
                              ?.centerName
                          }
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.center
                            ?.centerName ||
                            'N/A'}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {item.createdBy
                            ?.email ||
                            'N/A'}

                          {item.createdAt &&
                            ` At ${new Date(
                              item.createdAt
                            ).toLocaleTimeString(
                              'en-US',
                              {
                                hour: 'numeric',
                                minute:
                                  'numeric',
                                hour12:
                                  true,
                              }
                            )}`}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item
                            .completionInfo
                            ?.completedOn
                            ? formatDateTime(
                                item
                                  .completionInfo
                                  .completedOn
                              )
                            : 'N/A'}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleGenerateChallan(
                                item
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                          >
                            <FileText
                              size={14}
                            />
                            Challan
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No completed stock
                    requests found for
                    invoice generation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    };

  /* -------------------------------------------------------------------------- */
  /* INVOICE TABLE                                                              */
  /* -------------------------------------------------------------------------- */

  const renderInvoiceTable =
    () => (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-[950px] w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                Invoice Number
              </th>

              <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                Invoice Date
              </th>

              <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                Reseller
              </th>

              <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                Status
              </th>

              <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                Created At
              </th>

              <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {invoiceLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center"
                >
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    Loading invoices...
                  </div>
                </td>
              </tr>
            ) : filteredInvoices.length >
              0 ? (
              filteredInvoices.map(
                (invoice) => {
                  const isCancelled =
                    invoice.status ===
                    'cancelled';

                  return (
                    <tr
                      key={
                        invoice._id
                      }
                      className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                        isCancelled
                          ? 'bg-red-50/40'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewInvoiceDetails(
                              invoice
                            )
                          }
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {
                            invoice.invoiceNumber
                          }
                        </button>

                        {invoice
                          .stockRequestIds &&
                          invoice
                            .stockRequestIds
                            .length >
                            0 && (
                            <div className="mt-1 text-xs text-gray-500">
                              Challan
                              Requests:{' '}
                              {
                                invoice
                                  .stockRequestIds
                                  .length
                              }
                            </div>
                          )}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {invoice.invoiceDate
                          ? formatDate(
                              invoice.invoiceDate
                            )
                          : 'N/A'}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {invoice
                          .reseller
                          ?.businessName ||
                          'N/A'}
                      </td>

                      <td className="px-4 py-3">
                        {isCancelled ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                            Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            {invoice.status ||
                              'Generated'}
                          </span>
                        )}

                        {isCancelled &&
                          invoice.cancellationDetails && (
                            <div className="mt-2 text-xs text-gray-500">
                              <strong>
                                Reason:
                              </strong>{' '}
                              {
                                invoice
                                  .cancellationDetails
                                  .cancelReason
                              }

                              <br />

                              <span>
                                Cancelled
                                on:{' '}
                                {formatDate(
                                  invoice
                                    .cancellationDetails
                                    .cancelledAt
                                )}
                              </span>
                            </div>
                          )}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {invoice.createdAt
                          ? formatDateTime(
                              invoice.createdAt
                            )
                          : 'N/A'}
                      </td>

                      <td className="px-4 py-3">
                        <div
                          ref={(element) => {
                            dropdownRefs.current[
                              invoice._id
                            ] =
                              element;
                          }}
                          className="relative"
                        >
                          <button
                            type="button"
                            onClick={(
                              event
                            ) =>
                              handleMenuClick(
                                event,
                                invoice._id
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                          >
                            <Settings
                              size={14}
                            />
                            Options
                            <ChevronDown
                              size={13}
                            />
                          </button>

                          {openMenuId ===
                            invoice._id && (
                            <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
                              <button
                                type="button"
                                onClick={() => {
                                  handleCloseMenu();

                                  handleDownloadInvoice(
                                    invoice
                                  );
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                              >
                                <CloudDownload
                                  size={16}
                                />

                                Download PDF
                              </button>

                              {hasPermission(
                                'Invoice',
                                [
                                  'cancel_invoice',
                                ]
                              ) &&
                                !isCancelled && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleCloseMenu();

                                      setSelectedInvoiceForCancel(
                                        invoice
                                      );

                                      setCancelModalVisible(
                                        true
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                                  >
                                    <Ban
                                      size={16}
                                    />

                                    Cancel Invoice
                                  </button>
                                )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  {invoices.length ===
                  0
                    ? 'No invoices found. Generate invoices from the Stock Requests tab.'
                    : 'No invoices match your search criteria.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );

  /* -------------------------------------------------------------------------- */
  /* LOADING / ERROR                                                            */
  /* -------------------------------------------------------------------------- */

  if (
    loading &&
    activeTab ===
      'stockRequests'
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* MAIN UI                                                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-full w-full p-4">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Sale Invoices
        </h1>
      </div>

      {/* Alert */}
      {alertVisible && (
        <div
          className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
            alertColor ===
            'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : alertColor ===
                  'warning'
                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertColor ===
            'success' ? (
              <Check
                size={18}
              />
            ) : (
              <TriangleAlert
                size={18}
              />
            )}

            <span>
              {alertMessage}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setAlertVisible(
                false
              )
            }
            className="text-lg leading-none opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Search Modals */}
      <SearchSaleInvoice
        visible={
          searchModalVisible
        }
        onClose={() =>
          setSearchModalVisible(
            false
          )
        }
        onSearch={
          handleStockRequestSearch
        }
        centers={centers}
        resellers={resellers}
      />

      <InvoiceSearch
        visible={
          invoiceSearchModalVisible
        }
        onClose={() =>
          setInvoiceSearchModalVisible(
            false
          )
        }
        onSearch={
          handleInvoiceSearch
        }
        centers={centers}
        resellers={resellers}
      />

      {/* Challan Modal */}
      <ChallanModal
        visible={
          showChallanModal
        }
        onClose={() =>
          setShowChallanModal(
            false
          )
        }
        data={selectedChallan}
      />

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Tabs */}
          <div className="flex">
            <button
              type="button"
              onClick={() =>
                handleTabChange(
                  'stockRequests'
                )
              }
              className={`border-b-2 border-t-4 px-5 py-2.5 text-sm font-medium transition ${
                activeTab ===
                'stockRequests'
                  ? 'border-t-blue-700 border-b-white text-gray-900'
                  : 'border-t-transparent border-b-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Challan Report
            </button>

            <button
              type="button"
              onClick={() =>
                handleTabChange(
                  'invoices'
                )
              }
              className={`border-b-2 border-t-4 px-5 py-2.5 text-sm font-medium transition ${
                activeTab ===
                'invoices'
                  ? 'border-t-blue-700 border-b-white text-gray-900'
                  : 'border-t-transparent border-b-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Invoices
            </button>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={
              activeTab ===
              'stockRequests'
                ? currentPage
                : invoiceCurrentPage
            }
            totalPages={
              activeTab ===
              'stockRequests'
                ? totalPages
                : invoiceTotalPages
            }
            onPageChange={
              activeTab ===
              'stockRequests'
                ? handlePageChange
                : handleInvoicePageChange
            }
          />
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* STOCK REQUEST TAB */}
          {activeTab ===
            'stockRequests' && (
            <>
              <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <button
                    type="button"
                    onClick={() =>
                      setSearchModalVisible(
                        true
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                  >
                    <Search
                      size={15}
                    />
                    Search
                  </button>

                  {/* Reset Search */}
                  {(activeSearch.reseller ||
                    activeSearch.center ||
                    activeSearch.startDate ||
                    activeSearch.endDate) && (
                    <button
                      type="button"
                      onClick={
                        handleResetSearch
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      <ZoomOut
                        size={15}
                      />
                      Reset Search
                    </button>
                  )}

                  {/* Generate Invoice */}
                  {isSearchActive() &&
                    selectedChallans.length >
                      0 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleGenerateInvoice()
                        }
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                      >
                        <FileText
                          size={15}
                        />
                        Generate Invoice (
                        {
                          selectedChallans.length
                        }
                        )
                      </button>
                    )}
                </div>

                {/* Quick Search */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Search:
                  </label>

                  <input
                    type="text"
                    value={
                      searchTerm
                    }
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    disabled={
                      !!(
                        activeSearch.keyword ||
                        activeSearch.center ||
                        activeSearch.outlet
                      )
                    }
                    placeholder={
                      activeSearch.keyword ||
                      activeSearch.center ||
                      activeSearch.outlet
                        ? 'Disabled during advanced search'
                        : ''
                    }
                    className="h-9 w-full max-w-[350px] rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {renderStockRequestTable()}
            </>
          )}

          {/* INVOICE TAB */}
          {activeTab ===
            'invoices' && (
            <>
              <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <button
                    type="button"
                    onClick={() =>
                      setInvoiceSearchModalVisible(
                        true
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                  >
                    <Search
                      size={15}
                    />
                    Search
                  </button>

                  {/* Reset */}
                  {(invoiceSearch.invoiceNumber ||
                    invoiceSearch.reseller ||
                    invoiceSearch.center ||
                    invoiceSearch.startDate ||
                    invoiceSearch.endDate ||
                    invoiceSearch.status ||
                    invoiceSearch.cancelWithCreditNote) && (
                    <button
                      type="button"
                      onClick={
                        handleResetInvoiceSearch
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      <ZoomOut
                        size={15}
                      />
                      Reset Search
                    </button>
                  )}

                  {/* Export */}
                  <button
                    type="button"
                    onClick={
                      handleExportInvoices
                    }
                    disabled={
                      invoiceLoading
                    }
                    className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FileSpreadsheet
                      size={15}
                    />

                    {invoiceLoading
                      ? 'Exporting...'
                      : 'Export'}
                  </button>
                </div>

                {/* Invoice Quick Search */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Search:
                  </label>

                  <input
                    type="text"
                    value={
                      invoiceSearchTerm
                    }
                    onChange={(
                      event
                    ) =>
                      setInvoiceSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Quick search..."
                    className="h-9 w-full max-w-[350px] rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {renderInvoiceTable()}
            </>
          )}
        </div>
      </div>

      {/* Cancel Invoice */}
      <CancelInvoiceModal
        visible={
          cancelModalVisible
        }
        onClose={() => {
          setCancelModalVisible(
            false
          );

          setSelectedInvoiceForCancel(
            null
          );
        }}
        onConfirm={
          handleCancelInvoice
        }
        invoice={
          selectedInvoiceForCancel
        }
      />

      {/* Invoice Details */}
      <InvoiceDetailsModal
        visible={
          invoiceDetailsModalVisible
        }
        onClose={() => {
          setInvoiceDetailsModalVisible(
            false
          );

          setSelectedInvoiceForDetails(
            null
          );
        }}
        invoice={
          selectedInvoiceForDetails
        }
        onDownload={
          handleDownloadInvoice
        }
      />
    </div>
  );
};

export default SaleInvoices;