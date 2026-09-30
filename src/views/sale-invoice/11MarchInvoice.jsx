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
  Download,
  FileText,
  LoaderCircle,
  Search,
  Settings,
  X,
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
import { numToWords } from '../../utils/NumToWords';
import html2pdf from 'html2pdf.js';

import CancelInvoiceModal from './CancelInvoiceModal';
import InvoiceDetailsModal from './InvoiceDetailsModal';

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
      startDate: '',
      endDate: '',
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

  const navigate =
    useNavigate();

  /* =========================================================
     ALERT
  ========================================================== */

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

  /* =========================================================
     FETCH STOCK REQUESTS
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

      params.append(
        'page',
        page
      );

      const url =
        `/stockrequest?${params.toString()}`;

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
        setCustomers(
          response.data.data || []
        );

        setCurrentPage(
          response.data.pagination?.currentPage ||
            1
        );

        setTotalPages(
          response.data.pagination?.totalPages ||
            1
        );
      } else {
        throw new Error(
          'API returned unsuccessful response'
        );
      }
    } catch (err) {
      setError(
        err.message ||
          'Error fetching stock requests'
      );

      console.error(
        'Error fetching data:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH INVOICES
  ========================================================== */

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

      params.append(
        'page',
        page
      );

      /*
       * Preserve source API behaviour.
       * The original component builds params but
       * calls /invoice directly.
       */
      const response =
        await axiosInstance.get(
          '/invoice'
        );

      if (response.data.success) {
        setInvoices(
          response.data.data || []
        );

        setInvoiceCurrentPage(
          response.data.pagination?.currentPage ||
            1
        );

        setInvoiceTotalPages(
          response.data.pagination?.totalPages ||
            1
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
    } finally {
      setInvoiceLoading(false);
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
          response.data.data || []
        );
      }
    } catch (error) {
      console.error(
        'Error fetching centers:',
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
          response.data.data || []
        );
      }
    } catch (error) {
      console.error(
        'Error fetching resellers:',
        error
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
    } catch (error) {
      console.error(
        'Error fetching repair costs:',
        error
      );

      return new Map();
    }
  };

  /* =========================================================
     SAVE INVOICE
  ========================================================== */

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
            (p) => ({
              productId:
                p.productId,
              productTitle:
                p.productTitle,
              hsnCode:
                p.hsnCode,
              quantity:
                p.quantity,
              outletQty:
                p.outletQty,
              damageRepairQty:
                p.damageRepairQty,
              centerReturnQty:
                p.centerReturnQty,
              outletRate:
                p.outletRate,
              repairRate:
                p.repairRate,
              centerReturnRate:
                p.centerReturnRate,
              outletAmount:
                p.outletAmount,
              damageRepairAmount:
                p.damageRepairAmount,
              centerReturnAmount:
                p.centerReturnAmount,
              totalAmount:
                p.totalAmount,
              unit:
                p.unit,
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
            (h) => ({
              hsnCode:
                h.hsnCode,
              taxableValue:
                h.taxableValue,
              cgstAmount:
                h.cgstAmount,
              sgstAmount:
                h.sgstAmount,
              totalTax:
                h.totalTax,
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
        return response.data;
      }

      throw new Error(
        response.data.message ||
          'Failed to mark as invoiced'
      );
    } catch (error) {
      console.error(
        'Error marking as invoiced:',
        error
      );

      if (
        error.response?.data?.message
      ) {
        throw new Error(
          error.response.data.message
        );
      }

      throw error;
    }
  };

  /* =========================================================
     CANCEL INVOICE
  ========================================================== */

  const handleCancelInvoice =
    async (cancelData) => {
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
      } catch (error) {
        console.error(
          'Error cancelling invoice:',
          error
        );

        const errorMessage =
          error.response?.data
            ?.message ||
          error.message ||
          'Failed to cancel invoice';

        showAlert(
          errorMessage,
          'danger'
        );

        throw error;
      }
    };

  /* =========================================================
     DOWNLOAD INVOICE PDF
  ========================================================== */

  const handleDownloadInvoice =
    async (invoice) => {
      try {
        if (
          !invoice.invoiceHtml
        ) {
          alert(
            'Invoice HTML not available for download'
          );

          return;
        }

        const tempDiv =
          document.createElement(
            'div'
          );

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
      } catch (error) {
        console.error(
          'Error generating PDF:',
          error
        );

        alert(
          `Error downloading PDF: ${error.message}`
        );

        if (
          invoice.invoiceHtml
        ) {
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

          const a =
            document.createElement(
              'a'
            );

          a.href = url;

          a.download =
            `Invoice_${invoice.invoiceNumber.replace(
              /\//g,
              '_'
            )}.html`;

          document.body.appendChild(
            a
          );

          a.click();

          document.body.removeChild(
            a
          );

          URL.revokeObjectURL(
            url
          );
        }
      }
    };

  /* =========================================================
     MENUS
  ========================================================== */

  const handleMenuClick = (
    event,
    invoiceId
  ) => {
    event.stopPropagation();

    setOpenMenuId(
      (current) =>
        current === invoiceId
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
        if (
          !Object.values(
            dropdownRefs.current
          ).some(
            (ref) =>
              ref &&
              ref.contains(
                event.target
              )
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
  }, []);

  /* =========================================================
     CHALLAN SELECTION
  ========================================================== */

  const handleSelectChallan = (
    id
  ) => {
    setSelectedChallans(
      (prev) =>
        prev.includes(id)
          ? prev.filter(
              (c) => c !== id
            )
          : [...prev, id]
    );
  };

  const handleSelectAll = (
    event
  ) => {
    if (event.target.checked) {
      const nonInvoicedIds =
        filteredCustomers
          .filter(
            (customer) =>
              !customer.invoiceInfo
                ?.invoiceRaised
          )
          .map(
            (customer) =>
              customer._id
          );

      setSelectedChallans(
        nonInvoicedIds
      );
    } else {
      setSelectedChallans([]);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================== */

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

  /* =========================================================
     SORTING
  ========================================================== */

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

  const handleInvoiceSearch = (
    searchData
  ) => {
    setInvoiceSearch(
      searchData
    );

    fetchInvoices(
      searchData,
      1
    );
  };

  const handleResetSearch =
    () => {
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
        startDate: '',
        endDate: '',
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

  /* =========================================================
     FILTERED DATA
  ========================================================== */

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

        if (
          !searchTerm.trim()
        ) {
          return true;
        }

        const lowerSearch =
          searchTerm.toLowerCase();

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
                    lowerSearch
                  )
            );
          }

          return (
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(
                lowerSearch
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
          invoiceSearch.endDate
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

        return (
          invoice.invoiceNumber
            ?.toLowerCase()
            .includes(
              searchLower
            ) ||
          invoice.reseller?.businessName
            ?.toLowerCase()
            .includes(
              searchLower
            ) ||
          invoice.reseller?.gstNumber
            ?.toLowerCase()
            .includes(
              searchLower
            )
        );
      }
    );

  /* =========================================================
     NAVIGATION
  ========================================================== */

  const handleClick = (
    itemId
  ) => {
    navigate(
      `/stockRequest-profile/${itemId}`
    );
  };

  const handleGenerateChallan = (
    item
  ) => {
    setSelectedChallan(item);
    setShowChallanModal(true);
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

  /* =========================================================
     TAB CHANGE
  ========================================================== */

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
      startDate: '',
      endDate: '',
    });

    setSearchTerm('');
    setInvoiceSearchTerm('');
    setSelectedChallans([]);
  };

  /* =========================================================
     GENERATE INVOICE
  ========================================================== */

  const handleGenerateInvoice =
    async (metaData = {}) => {
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
          selectedData.length === 0
        ) {
          return;
        }

        const invoiceNumber =
          `STEL/${new Date().getFullYear()}-${(
            new Date().getFullYear() +
            1
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

        const allProductIds =
          [];

        selectedData.forEach(
          (challan) => {
            challan.products?.forEach(
              (product) => {
                if (
                  product.product?._id
                ) {
                  allProductIds.push(
                    product.product._id.toString()
                  );
                }
              }
            );
          }
        );

        const repairCostMap =
          await fetchRepairCosts(
            allProductIds
          );

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
            challan.products?.forEach(
              (product) => {
                const productId =
                  product.product?._id ||
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

                const resellerQty =
                  sourceBreakdown
                    .fromReseller
                    ?.quantity || 0;

                const outletQty =
                  sourceBreakdown
                    .fromOutlet
                    ?.quantity || 0;

                const resellerStock =
                  product.resellerStock ||
                  {};

                const availableBreakdown =
                  resellerStock
                    .availableBreakdown ||
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

                const outletAmount =
                  outletQty *
                  salePrice;

                const damageRepairAmount =
                  damageRepairQty *
                  repairCostPerUnit;

                const centerReturnAmount =
                  0;

                if (
                  productMap.has(
                    productId
                  )
                ) {
                  const existing =
                    productMap.get(
                      productId
                    );

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

                      centerReturnRate:
                        0,

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

        const totalOutletAmount =
          combinedProducts.reduce(
            (sum, product) =>
              sum +
              product.outletAmount,
            0
          );

        const totalDamageRepairAmount =
          combinedProducts.reduce(
            (sum, product) =>
              sum +
              product.damageRepairAmount,
            0
          );

        const totalCenterReturnAmount =
          combinedProducts.reduce(
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
          totalBeforeTax * 0.09;

        const sgst =
          totalBeforeTax * 0.09;

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

        /* ---------------- HSN SUMMARY ---------------- */

        const hsnMap =
          new Map();

        combinedProducts.forEach(
          (product) => {
            const hsn =
              product.hsnCode;

            const taxableValue =
              product.totalAmount;

            const cgstAmount =
              taxableValue * 0.09;

            const sgstAmount =
              taxableValue * 0.09;

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

        /* ---------------- PDF HTML ---------------- */

        const productsPerPage = 8;

        const pages = [];

        for (
          let i = 0;
          i <
          combinedProducts.length;
          i += productsPerPage
        ) {
          pages.push(
            combinedProducts.slice(
              i,
              i + productsPerPage
            )
          );
        }

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

              .invoice-info {
                background-color: #f8f9fa;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #dee2e6;
                border-radius: 4px;
              }

              @media print {
                .page-break {
                  page-break-before: always;
                }

                .no-print {
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
                (
                  pageProducts,
                  pageIndex
                ) => `
                  <table class="main-border">
                    <tr>
                      <td style="width:50%;">
                        <div style="
                          border-bottom:1px solid #000;
                          padding-bottom:6px;
                          margin-bottom:6px;
                        ">
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
                        </span><br/>

                        ${
                          reseller?.businessName ||
                          'SSV Alpha Broadband LLP'
                        }<br/>

                        ${
                          centersList ||
                          'All Alpha Area'
                        }<br/><br/>

                        GSTIN/UIN:
                        ${
                          reseller?.gstNumber ||
                          '27AEGFS1650E1Z6'
                        }<br/>

                        State Name :
                        ${
                          reseller?.state ||
                          'Maharashtra'
                        },
                        Code : 27

                        <hr/>

                        <span class="label">
                          Buyer (Bill to)
                        </span><br/>

                        ${
                          reseller?.businessName ||
                          'SSV Alpha Broadband LLP'
                        }<br/>

                        ${
                          reseller?.address1 ||
                          'A/3, Landmark Soc, Sector-14, Vashi'
                        }<br/>

                        GSTIN/UIN:
                        ${
                          reseller?.gstNumber ||
                          '27AEGFS1650E1Z6'
                        }<br/>

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
                              <span class="label">
                                Invoice No.
                              </span><br/>
                              ${invoiceNumber}
                            </td>

                            <td>
                              <span class="label">
                                Dated
                              </span><br/>
                              ${invoiceDate}
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <span class="label">
                                Delivery Note
                              </span><br/>
                              ${
                                metaData?.deliveryNote ||
                                ''
                              }
                            </td>

                            <td>
                              <span class="label">
                                Mode/Terms of Payment
                              </span><br/>
                              ${
                                metaData?.modeOfPayment ||
                                ''
                              }
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <span class="label">
                                Reference No. & Date
                              </span><br/>
                              ${
                                metaData?.referenceNo ||
                                ''
                              }
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
                              </span><br/>
                              ${
                                metaData?.otherReferences ||
                                ''
                              }
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <span class="label">
                                Buyer's Order No.
                              </span><br/>
                              ${
                                metaData?.buyerOrderNo ||
                                ''
                              }
                            </td>

                            <td>
                              <span class="label">
                                Dated
                              </span><br/>
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
                              </span><br/>
                              ${
                                metaData?.dispatchDocNo ||
                                '16.07-31.07.25'
                              }
                            </td>

                            <td>
                              <span class="label">
                                Delivery Note Date
                              </span><br/>
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
                              </span><br/>
                              ${
                                metaData?.dispatchedThrough ||
                                ''
                              }
                            </td>

                            <td>
                              <span class="label">
                                Destination
                              </span><br/>
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
                              </span><br/>
                              ${
                                metaData?.termsOfDelivery ||
                                ''
                              }
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
                      ${pageProducts
                        .map(
                          (
                            product,
                            index
                          ) => {
                            const productIndex =
                              pageIndex *
                                productsPerPage +
                              index +
                              1;

                            const rows = [];

                            if (
                              product.outletQty >
                              0
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
                                    ${product.outletRate.toFixed(
                                      2
                                    )}
                                  </td>

                                  <td>
                                    ${product.unit}
                                  </td>

                                  <td class="right">
                                    ${product.outletAmount.toFixed(
                                      2
                                    )}
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
                                      (Damage Repair -
                                      Charged @₹${
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
                                    ${product.repairRate.toFixed(
                                      2
                                    )}
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

                            return rows.join(
                              ''
                            );
                          }
                        )
                        .join('')}

                      ${
                        pageIndex ===
                        pages.length - 1
                          ? `
                            <tr>
                              <td colspan="4"></td>

                              <td colspan="2">
                                <b>
                                  Subtotal (New Stock from Outlet)
                                </b>
                              </td>

                              <td class="right">
                                ${totalOutletAmount.toFixed(
                                  2
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colspan="4"></td>

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
                              <td colspan="4"></td>

                              <td colspan="2">
                                <b>
                                  Total Before Tax
                                </b>
                              </td>

                              <td class="right">
                                ${totalBeforeTax.toFixed(
                                  2
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colspan="4"></td>
                              <td colspan="2">
                                <b>
                                  Output CGST @9%
                                </b>
                              </td>
                              <td class="right">
                                ${cgst.toFixed(
                                  2
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colspan="4"></td>
                              <td colspan="2">
                                <b>
                                  Output SGST @9%
                                </b>
                              </td>
                              <td class="right">
                                ${sgst.toFixed(
                                  2
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colspan="4"></td>
                              <td colspan="2">
                                <b>
                                  Round Off
                                </b>
                              </td>
                              <td class="right">
                                ${roundOff.toFixed(
                                  2
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colspan="4"></td>
                              <td colspan="2">
                                <b>Total</b>
                              </td>
                              <td class="right">
                                ${total.toFixed(
                                  2
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colspan="7">
                                <b>
                                  Amount Chargeable (in words):
                                </b>
                                <i>
                                  ${numToWords(
                                    total
                                  )}
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

            <div style="
              display:flex;
              justify-content:space-between;
              margin-top:10px;
            ">
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
                Vashi, Navi Mumbai
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

                A/3, Landmark Soc,
                Sector-14, Vashi
                <br/>

                Navi Mumbai
                <br/>

                GSTIN/UIN:
                27AEGFS1650E1Z6
                <br/>

                State Name: Maharashtra,
                Code : 27
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
                  <th colspan="2">CGST</th>
                  <th colspan="2">SGST</th>
                  <th>Total Tax Amount</th>
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
                          ${hsn.taxableValue.toFixed(
                            2
                          )}
                        </td>

                        <td>9%</td>

                        <td class="right">
                          ${hsn.cgstAmount.toFixed(
                            2
                          )}
                        </td>

                        <td>9%</td>

                        <td class="right">
                          ${hsn.sgstAmount.toFixed(
                            2
                          )}
                        </td>

                        <td class="right">
                          ${hsn.totalTax.toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    `
                  )
                  .join('')}

                <tr>
                  <td>
                    <b>Total</b>
                  </td>

                  <td class="right">
                    ${totalBeforeTax.toFixed(
                      2
                    )}
                  </td>

                  <td></td>

                  <td class="right">
                    ${cgst.toFixed(
                      2
                    )}
                  </td>

                  <td></td>

                  <td class="right">
                    ${sgst.toFixed(
                      2
                    )}
                  </td>

                  <td class="right">
                    ${(
                      cgst +
                      sgst
                    ).toFixed(2)}
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
                            cgst +
                            sgst
                          ).toFixed(2)
                        )
                      )}
                    </i>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
          </html>
        `;

        const invoiceData = {
          resellerId:
            reseller?._id,

          centers:
            allCenters,

          products:
            combinedProducts,

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
          const response =
            await markAsInvoiced(
              selectedChallans,
              invoiceNumber,
              new Date().toISOString(),
              invoiceData
            );

          if (
            response.success
          ) {
            saveSuccess =
              true;
          }
        } catch (
          saveError
        ) {
          console.error(
            'Error saving invoice:',
            saveError
          );
        }

        invoiceWindow =
          window.open(
            '',
            '_blank'
          );

        if (
          invoiceWindow
        ) {
          const printHTML =
            invoiceHTML.replace(
              '</body>',
              `
                <script>
                  window.onload = () => {
                    setTimeout(() => {
                      window.print();
                    }, 1000);
                  };
                </script>
              </body>
              `
            );

          invoiceWindow.document.write(
            printHTML
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

        if (
          saveSuccess
        ) {
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
      } catch (error) {
        console.error(
          'Error generating invoice:',
          error
        );

        if (
          invoiceWindow &&
          invoiceWindow.document
        ) {
          invoiceWindow.document.write(
            `
              <html>
                <body>
                  <h2>
                    Error Generating Invoice
                  </h2>

                  <p>
                    ${
                      error.message ||
                      'Unknown error occurred'
                    }
                  </p>

                  <button
                    onclick="window.close()"
                  >
                    Close
                  </button>
                </body>
              </html>
            `
          );

          invoiceWindow.document.close();
        }

        alert(
          `Error generating invoice: ${
            error.message ||
            'Please try again'
          }`
        );
      }
    };

  /* =========================================================
     LOADING / ERROR
  ========================================================== */

  if (
    loading &&
    activeTab === 'stockRequests'
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <LoaderCircle
            size={36}
            className="animate-spin text-blue-600"
          />

          <span className="text-sm">
            Loading stock requests...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  /* =========================================================
     STOCK REQUEST TABLE
  ========================================================== */

  const renderStockRequestTable =
    () => (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[1250px] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedChallans.length ===
                      filteredCustomers.filter(
                        (customer) =>
                          !customer
                            .invoiceInfo
                            ?.invoiceRaised
                      ).length &&
                    filteredCustomers.filter(
                      (customer) =>
                        !customer
                          .invoiceInfo
                          ?.invoiceRaised
                    ).length > 0
                  }
                  onChange={
                    handleSelectAll
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>

              {[
                [
                  'date',
                  'Order Date',
                ],
                [
                  'orderNumber',
                  'Order Number',
                ],
                [
                  'challanNo',
                  'Challan No',
                ],
                [
                  'challanDate',
                  'Challan Date',
                ],
                [
                  'warehouse.centerName',
                  'Warehouse',
                ],
                [
                  'center.centerName',
                  'Branch',
                ],
                [
                  'createdBy.email',
                  'Posted By',
                ],
                [
                  'completionInfo.completedOn',
                  'Completed At',
                ],
              ].map(
                ([key, label]) => (
                  <th
                    key={key}
                    onClick={() =>
                      handleSort(key)
                    }
                    className="cursor-pointer border-b px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    {label}
                    {getSortIcon(
                      key
                    )}
                  </th>
                )
              )}

              <th className="border-b px-4 py-3 font-semibold text-gray-700">
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
                      className={`border-b transition hover:bg-gray-50 ${
                        isInvoiceRaised
                          ? 'bg-green-50'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        {!isInvoiceRaised && (
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
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        )}
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
                          className="font-medium text-blue-600 hover:underline"
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

                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {item.challanNo ||
                          'N/A'}
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
                          item
                            .warehouse
                            ?.centerName
                        }
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {
                          item.center
                            ?.centerName
                        }
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {
                          item.createdBy
                            ?.email
                        }

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
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                          <FileText
                            size={15}
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
                  className="px-4 py-12 text-center text-gray-500"
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

  /* =========================================================
     INVOICE TABLE
  ========================================================== */

  const renderInvoiceTable =
    () => (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[950px] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b px-4 py-3 font-semibold text-gray-700">
                Invoice Number
              </th>

              <th className="border-b px-4 py-3 font-semibold text-gray-700">
                Invoice Date
              </th>

              <th className="border-b px-4 py-3 font-semibold text-gray-700">
                Reseller
              </th>

              <th className="border-b px-4 py-3 font-semibold text-gray-700">
                Status
              </th>

              <th className="border-b px-4 py-3 font-semibold text-gray-700">
                Created At
              </th>

              <th className="border-b px-4 py-3 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {invoiceLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircle
                      size={18}
                      className="animate-spin text-blue-600"
                    />
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

                  const menuOpen =
                    openMenuId ===
                    invoice._id;

                  return (
                    <tr
                      key={
                        invoice._id
                      }
                      className={`border-b transition hover:bg-gray-50 ${
                        isCancelled
                          ? 'bg-red-50'
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
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {
                            invoice.invoiceNumber
                          }
                        </button>

                        {invoice
                          .stockRequestIds
                          ?.length >
                          0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            Stock Requests:{' '}
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
                        {
                          invoice
                            .reseller
                            ?.businessName
                        }
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
                                Cancelled on:{' '}
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

                      <td className="relative px-4 py-3">
                        <div
                          ref={(element) => {
                            dropdownRefs.current[
                              invoice._id
                            ] = element;
                          }}
                          className="relative inline-block"
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
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            <Settings
                              size={15}
                            />
                            Options
                            <ChevronDown
                              size={14}
                            />
                          </button>

                          {menuOpen && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
                              <button
                                type="button"
                                onClick={() => {
                                  handleCloseMenu();
                                  handleDownloadInvoice(
                                    invoice
                                  );
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Download
                                  size={16}
                                />
                                Download PDF
                              </button>

                              {!isCancelled && (
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
                                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
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
                  className="px-4 py-12 text-center text-gray-500"
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

  /* =========================================================
     UI
  ========================================================== */

  const stockAdvancedSearchActive =
    Boolean(
      activeSearch.reseller ||
        activeSearch.center ||
        activeSearch.startDate ||
        activeSearch.endDate
    );

  const invoiceAdvancedSearchActive =
    Boolean(
      invoiceSearch.invoiceNumber ||
        invoiceSearch.reseller ||
        invoiceSearch.startDate ||
        invoiceSearch.endDate
    );

  const canGenerateInvoice =
    stockAdvancedSearchActive &&
    selectedChallans.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1700px]">
        {/* PAGE TITLE */}

        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-800">
            Sale Invoices
          </h1>
        </div>

        {/* ALERT */}

        {alertVisible && (
          <div
            className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
              alertColor ===
              'success'
                ? 'border-green-200 bg-green-50 text-green-700'
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
                <X
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
              className="rounded p-1 hover:bg-black/5"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* SEARCH MODAL */}

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
            activeTab ===
            'stockRequests'
              ? handleSearch
              : handleInvoiceSearch
          }
          centers={centers}
          resellers={resellers}
          defaultStatus="Completed"
          isInvoiceTab={
            activeTab ===
            'invoices'
          }
        />

        {/* CHALLAN MODAL */}

        <ChallanModal
          visible={
            showChallanModal
          }
          onClose={() =>
            setShowChallanModal(
              false
            )
          }
          data={
            selectedChallan
          }
        />

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* CARD HEADER */}

          <div className="flex flex-col gap-4 border-b bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
            {/* TABS */}

            <div className="flex">
              <button
                type="button"
                onClick={() =>
                  handleTabChange(
                    'stockRequests'
                  )
                }
                className={`border-t-4 px-5 py-3 text-sm font-medium transition ${
                  activeTab ===
                  'stockRequests'
                    ? 'border-blue-600 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Stock Requests
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTabChange(
                    'invoices'
                  )
                }
                className={`border-t-4 px-5 py-3 text-sm font-medium transition ${
                  activeTab ===
                  'invoices'
                    ? 'border-blue-600 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Invoices
              </button>
            </div>

            {/* PAGINATION */}

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

          {/* CONTENT */}

          <div className="p-5">
            {/* =================================================
                STOCK REQUESTS TAB
            ================================================== */}

            {activeTab ===
              'stockRequests' && (
              <>
                <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSearchModalVisible(
                          true
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Search
                        size={16}
                      />
                      Search
                    </button>

                    {stockAdvancedSearchActive && (
                      <button
                        type="button"
                        onClick={
                          handleResetSearch
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <ZoomOut
                          size={16}
                        />
                        Reset Search
                      </button>
                    )}

                    {canGenerateInvoice && (
                      <button
                        type="button"
                        onClick={() =>
                          handleGenerateInvoice(
                            invoiceMetaData ||
                              {}
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        <FileText
                          size={16}
                        />
                        Generate Invoice
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="stock-search"
                      className="text-sm font-medium text-gray-600"
                    >
                      Search:
                    </label>

                    <input
                      id="stock-search"
                      type="text"
                      value={
                        searchTerm
                      }
                      onChange={(e) =>
                        setSearchTerm(
                          e.target
                            .value
                        )
                      }
                      disabled={Boolean(
                        activeSearch.keyword ||
                          activeSearch.center ||
                          activeSearch.outlet
                      )}
                      placeholder={
                        activeSearch.keyword ||
                        activeSearch.center ||
                        activeSearch.outlet
                          ? 'Disabled during advanced search'
                          : ''
                      }
                      className="h-9 w-full max-w-[350px] rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {renderStockRequestTable()}
              </>
            )}

            {/* =================================================
                INVOICES TAB
            ================================================== */}

            {activeTab ===
              'invoices' && (
              <>
                <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSearchModalVisible(
                          true
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Search
                        size={16}
                      />
                      Search
                    </button>

                    {invoiceAdvancedSearchActive && (
                      <button
                        type="button"
                        onClick={
                          handleResetInvoiceSearch
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <ZoomOut
                          size={16}
                        />
                        Reset Search
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="invoice-search"
                      className="text-sm font-medium text-gray-600"
                    >
                      Search:
                    </label>

                    <input
                      id="invoice-search"
                      type="text"
                      value={
                        invoiceSearchTerm
                      }
                      onChange={(e) =>
                        setInvoiceSearchTerm(
                          e.target
                            .value
                        )
                      }
                      disabled={Boolean(
                        invoiceSearch.invoiceNumber ||
                          invoiceSearch.reseller
                      )}
                      className="h-9 w-full max-w-[350px] rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {renderInvoiceTable()}
              </>
            )}
          </div>
        </div>

        {/* CANCEL INVOICE */}

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

        {/* INVOICE DETAILS */}

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
    </div>
  );
};

export default SaleInvoices;