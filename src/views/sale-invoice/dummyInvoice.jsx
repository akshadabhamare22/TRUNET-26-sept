import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  RotateCcw,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
import ChallanModal from "../stockRequest/ChallanModal";
import SearchSaleInvoice from "./SearchSaleInvoice";
import { numToWords } from "../../utils/NumToWords";

const SaleInvoices = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedChallans, setSelectedChallans] = useState([]);
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    center: '', 
    reseller: '',
    status: 'Completed',
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);

  const [invoiceMetaData, setInvoiceMetaData] = useState(null);
  const navigate = useNavigate();

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'Completed');
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }

      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller);
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
  
      params.append('page', page);
      
      const url = `/stockrequest?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setCustomers(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);

        console.log('Fetched data:', response.data.data.length, 'items');
        console.log('Pagination:', response.data.pagination);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers');
      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchRepairCosts = async (productIds) => {
    try {
      const response = await axiosInstance.get('/repaired-cost');
      
      if (response.data.success) {
        const repairCostMap = new Map();
        response.data.data.forEach(item => {
          if (item.product && item.product._id) {
            repairCostMap.set(item.product._id, item.repairCost);
          }
        });
        console.log('Repair cost map:', repairCostMap);
        return repairCostMap;
      }
      return new Map();
    } catch (error) {
      console.error('Error fetching repair costs:', error);
      return new Map();
    }
  };  
  
 
  const handleSelectChallan = (id) => {
    setSelectedChallans((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedChallans(filteredCustomers.map((c) => c._id));
    } else {
      setSelectedChallans([]);
    }
  };
  
  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchResellers();
    fetchRepairCosts();
  }, []);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === 'ascending'
      ? <ArrowUp size={14} className="ml-1 inline-block" />
      : <ArrowDown size={14} className="ml-1 inline-block" />;
  };

  const handleSearch = (searchData) => {
    const searchWithCompleted = { ...searchData, status: 'Completed' };
    setActiveSearch(searchWithCompleted);
    fetchData(searchWithCompleted, 1);
  };

 const handleResetSearch = () => {
  const resetSearch = { 
    center: '', 
    reseller: '',
    startDate: '',
    endDate: '',
  };
  setActiveSearch(resetSearch);
  setSearchTerm('');
  fetchData(resetSearch, 1);
};

  const handleClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`);
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.outlet) {
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
  
  const handleGenerateChallan = (item) => {
    setSelectedChallan(item);
    setShowChallanModal(true);
  };
  const handleGenerateInvoice = async (metaData) => {
    setInvoiceMetaData(metaData);
  
    const selectedData = customers.filter(c => selectedChallans.includes(c._id));
    if (selectedData.length === 0) return;
    const allProductIds = [];
    selectedData.forEach(challan => {
      challan.products.forEach(product => {
        if (product.product?._id) {
          allProductIds.push(product.product._id.toString());
        }
      });
    });
    const repairCostMap = await fetchRepairCosts(allProductIds);
    
    console.log('Product IDs:', allProductIds);
    console.log('Repair cost map size:', repairCostMap.size);
  
    const reseller = selectedData[0]?.center?.reseller;
    const invoiceNumber = `STEL/25-26/${Math.floor(Math.random() * 100)}`;
    const invoiceDate = '31-Jul-25';
  
    const allCenters = [
      ...new Set(selectedData.map(c => c.center?.centerName).filter(Boolean))
    ];
    const centersList = allCenters.join(', ');
  
    const productMap = new Map();
    
    selectedData.forEach(challan => {
      challan.products.forEach(product => {
        const productId = product.product?._id || product.product?.productTitle;
        const productTitle = product.product?.productTitle || '';
        const hsnCode = product.product?.hsnCode || '85176990';
        const salePrice = product.product?.salePrice || product.rate || 0;
        
  
        const repairCostPerUnit = repairCostMap.get(product.product?._id?.toString()) || 150;
        
        const sourceBreakdown = product.sourceBreakdown || {};
        const resellerQty = sourceBreakdown.fromReseller?.quantity || 0;
        const outletQty = sourceBreakdown.fromOutlet?.quantity || 0;
        
        const resellerStock = product.resellerStock || {};
        const availableBreakdown = resellerStock.availableBreakdown || {};
        
        let damageRepairQty = 0;
        let centerReturnQty = 0;
        
        if (resellerQty > 0) {
          const totalDamageRepairInStock = availableBreakdown.damageRepair || 0;
          const totalCenterReturnInStock = availableBreakdown.centerReturn || 0;
          const totalResellerStockAvailable = totalDamageRepairInStock + totalCenterReturnInStock;
          
          if (totalResellerStockAvailable > 0) {
            const damageRepairRatio = totalDamageRepairInStock / totalResellerStockAvailable;
            const centerReturnRatio = totalCenterReturnInStock / totalResellerStockAvailable;
            
            damageRepairQty = Math.min(
              Math.round(resellerQty * damageRepairRatio),
              totalDamageRepairInStock
            );
            centerReturnQty = Math.min(
              resellerQty - damageRepairQty,
              totalCenterReturnInStock
            );
            
            if (damageRepairQty + centerReturnQty !== resellerQty) {
              const remaining = resellerQty - damageRepairQty - centerReturnQty;
              if (remaining > 0) {
                if (totalDamageRepairInStock - damageRepairQty > totalCenterReturnInStock - centerReturnQty) {
                  damageRepairQty += remaining;
                } else {
                  centerReturnQty += remaining;
                }
              }
            }
          } else {
            // If no breakdown data, assume 50/50 split
            damageRepairQty = Math.round(resellerQty / 2);
            centerReturnQty = resellerQty - damageRepairQty;
          }
        }
  
        console.log(`Product ${productTitle}:`, {
          resellerQty,
          outletQty,
          damageRepairQty,
          centerReturnQty,
          repairCost: repairCostPerUnit,
          availableBreakdown
        });
  
        if (productMap.has(productId)) {
          const existing = productMap.get(productId);
         
          const outletAmount = outletQty * salePrice;
          const damageRepairAmount = damageRepairQty * repairCostPerUnit;
          const centerReturnAmount = centerReturnQty * 0;
          
          existing.quantity += (resellerQty + outletQty);
          existing.outletQty += outletQty;
          existing.damageRepairQty += damageRepairQty;
          existing.centerReturnQty += centerReturnQty;
          
          existing.outletAmount += outletAmount;
          existing.damageRepairAmount += damageRepairAmount;
          existing.centerReturnAmount += centerReturnAmount;
          existing.totalAmount += outletAmount + damageRepairAmount + centerReturnAmount;
        } else {
          
          const outletAmount = outletQty * salePrice;
          const damageRepairAmount = damageRepairQty * repairCostPerUnit;
          const centerReturnAmount = centerReturnQty * 0;
          
          productMap.set(productId, {
            productTitle: productTitle,
            hsnCode: hsnCode,
            quantity: resellerQty + outletQty,
           
            outletQty: outletQty, 
            damageRepairQty: damageRepairQty,
            centerReturnQty: centerReturnQty, 
            
            outletRate: salePrice,
            repairRate: repairCostPerUnit,
            centerReturnRate: 0, 
  
            outletAmount: outletAmount,
            damageRepairAmount: damageRepairAmount,
            centerReturnAmount: centerReturnAmount,
            totalAmount: outletAmount + damageRepairAmount + centerReturnAmount,
            
            unit: 'Nos'
          });
        }
      });
    });
  
    const combinedProducts = Array.from(productMap.values());
  
    const totalOutletAmount = combinedProducts.reduce((sum, p) => sum + p.outletAmount, 0);
    const totalDamageRepairAmount = combinedProducts.reduce((sum, p) => sum + p.damageRepairAmount, 0);
    const totalCenterReturnAmount = combinedProducts.reduce((sum, p) => sum + p.centerReturnAmount, 0);
    
    const totalBeforeTax = totalOutletAmount + totalDamageRepairAmount + totalCenterReturnAmount;
    
    const cgst = totalBeforeTax * 0.09;
    const sgst = totalBeforeTax * 0.09;
    const roundOff = Math.round(totalBeforeTax + cgst + sgst) - (totalBeforeTax + cgst + sgst);
    const total = totalBeforeTax + cgst + sgst + roundOff;
  
    const hsnMap = new Map();
    combinedProducts.forEach(product => {
      const hsn = product.hsnCode;
      const taxableValue = product.totalAmount;
      const cgstAmount = taxableValue * 0.09;
      const sgstAmount = taxableValue * 0.09;
      const totalTax = cgstAmount + sgstAmount;
      
      if (hsnMap.has(hsn)) {
        const existing = hsnMap.get(hsn);
        existing.taxableValue += taxableValue;
        existing.cgstAmount += cgstAmount;
        existing.sgstAmount += sgstAmount;
        existing.totalTax += totalTax;
      } else {
        hsnMap.set(hsn, {
          hsnCode: hsn,
          taxableValue: taxableValue,
          cgstAmount: cgstAmount,
          sgstAmount: sgstAmount,
          totalTax: totalTax
        });
      }
    });
  
    const hsnSummary = Array.from(hsnMap.values());
  
    const productsPerPage = 8;
    const pages = [];
    for (let i = 0; i < combinedProducts.length; i += productsPerPage) {
      pages.push(combinedProducts.slice(i, i + productsPerPage));
    }
  
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
      <html>
      <head>
        <title>Invoice - ${reseller?.businessName || 'SSV Alpha Broadband LLP'}</title>
        <style>
          @page { size: A4; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0;}
          .title { text-align: center; font-weight: bold; font-size: 16px; margin: 6px 0; }
          .main-border { border: 1px solid #000; width: 100%; border-collapse: collapse; }
          .main-border td, .main-border th { border: 1px solid #000; padding: 5px; vertical-align: top; }
          .meta-table { width: 100%; border-collapse: collapse; }
          .meta-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
          .label { font-weight: bold; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .footer-note { font-style: italic; text-align: right; margin-top: 4px; }
          .repair-note { color: #666; font-size: 0.9em; }
          .free-note { color: green; font-size: 0.9em; }
          @media print { .page-break { page-break-before: always; } }
        </style>
      </head>
      <body>
        <div class="title">Tax Invoice</div>
  
        ${pages.map((products, pageIndex) => `
          <table class="main-border">
            <tr>
              <td style="width:50%;">
                <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
                  <div class="bold">SSV Telecom Private Limited FY 22-23</div>
                  A-1, Landmark CHS, Sector 14<br/>
                  Vashi, Navi Mumbai<br/>
                  27ABECS3422Q1ZX<br/>
                  GSTIN/UIN: 27ABECS3422Q1ZX
                </div>
  
                <span class="label">Consignee (Ship to)</span><br/>
                ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
                ${centersList || 'All Alpha Area'}<br/><br/>
                GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
                State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
                <hr/>
  
                <span class="label">Buyer (Bill to)</span><br/>
                ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
                ${reseller?.address1 || 'A/3, Landmark Soc, Sector-14, Vashi'}<br/>
                GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
                State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
              </td>
  
              <td style="width:50%; padding:0;">
                <table class="meta-table">
                  <tr>
                    <td><span class="label">Invoice No.</span><br/>${invoiceNumber}</td>
                    <td><span class="label">Dated</span><br/>${invoiceDate}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Delivery Note</span><br/>${metaData?.deliveryNote || ''}</td>
                    <td><span class="label">Mode/Terms of Payment</span><br/>${metaData?.modeOfPayment || ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Reference No. & Date</span><br/>${metaData?.referenceNo || ''} ${metaData?.referenceDate ? new Date(metaData.referenceDate).toLocaleDateString() : ''}</td>
                    <td><span class="label">Other References</span><br/>${metaData?.otherReferences || ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Buyer's Order No.</span><br/>${metaData?.buyerOrderNo || ''}</td>
                    <td><span class="label">Dated</span><br/>${metaData?.buyerOrderDate ? new Date(metaData.buyerOrderDate).toLocaleDateString() : ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Dispatch Doc No.</span><br/>${metaData?.dispatchDocNo || '16.07-31.07.25'}</td>
                    <td><span class="label">Delivery Note Date</span><br/>${metaData?.deliveryNoteDate ? new Date(metaData.deliveryNoteDate).toLocaleDateString() : ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Dispatched through</span><br/>${metaData?.dispatchedThrough || ''}</td>
                    <td><span class="label">Destination</span><br/><b>${metaData?.destination || 'All Alpha Area'}</b></td>
                  </tr>
                  <tr>
                    <td colspan="2"><span class="label">Terms of Delivery</span><br/>${metaData?.termsOfDelivery || ''}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
  
          <table class="main-border" style="margin-top:10px;">
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
              ${products.map((p, i) => {
                const productIndex = pageIndex * productsPerPage + i + 1;
                let rows = [];
                let rowCount = 0;
                
                if (p.outletQty > 0) {
                  rows.push(`
                    <tr>
                      <td${rowCount > 0 ? ' rowspan="' + rowCount + '"' : ''}>${productIndex}</td>
                      <td>${p.productTitle}</td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.outletQty}</td>
                      <td class="right">${p.outletRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.outletAmount.toFixed(2)}</td>
                    </tr>
                  `);
                  rowCount++;
                }
                
                if (p.damageRepairQty > 0) {
                  rows.push(`
                    <tr>
                      <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
                      <td>${p.productTitle} <span class="repair-note">(Damage Repair - Charged @₹${p.repairRate}/unit)</span></td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.damageRepairQty}</td>
                      <td class="right">${p.repairRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.damageRepairAmount.toFixed(2)}</td>
                    </tr>
                  `);
                  rowCount++;
                }
                
                if (p.centerReturnQty > 0) {
                  rows.push(`
                    <tr>
                      <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
                      <td>${p.productTitle} <span class="free-note">(Center Return - Free)</span></td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.centerReturnQty}</td>
                      <td class="right">${p.centerReturnRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.centerReturnAmount.toFixed(2)}</td>
                    </tr>
                  `);
                  rowCount++;
                }
                
                return rows.join('');
              }).join('')}
              ${pageIndex === pages.length - 1 ? `
              <tr>
                <td colspan="4" rowspan="7"></td>
                <td colspan="2"><b>Subtotal (New Stock from Outlet)</b></td>
                <td class="right">${totalOutletAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2"><b>Subtotal (Damage Repair)</b></td>
                <td class="right">${totalDamageRepairAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2"><b>Total Before Tax</b></td>
                <td class="right">${totalBeforeTax.toFixed(2)}</td>
              </tr>
              <tr><td colspan="2"><b>Output CGST @9%</b></td><td class="right">${cgst.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Output SGST @9%</b></td><td class="right">${sgst.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Round Off</b></td><td class="right">${roundOff.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Total</b></td><td class="right">${total.toFixed(2)}</td></tr>
              <tr><td colspan="7"><b>Amount Chargeable (in words):</b><i>${numToWords(total)}</i></td></tr>` : ''}
            </tbody>
          </table>
          ${pageIndex < pages.length - 1 ? '<div class="footer-note">continued ...</div><div class="page-break"></div>' : ''}
        `).join('')}
  
        <!-- Tax Summary Page -->
        <div class="page-break"></div>
  
        <div class="analysis-header" style="display:flex; justify-content:space-between; margin-top:10px;">
          <div>Invoice No. <strong>${invoiceNumber}</strong></div>
          <div>Dated <strong>${invoiceDate}</strong></div>
        </div>
  
        <div style="text-align:center;">
          <p><strong>SSV Telecom Private Limited</strong><br/>
            A-1, Landmark CHS, Sector 14<br/>
            Vashi , Navi Mumbai<br/>
            27ABECS3422Q1ZX<br/>
            GSTIN/UIN: 27ABECS3422Q1ZX<br/><br/>
            Party: <strong>SSV Telecom Private Limited</strong><br/>
            A/3, Landmark Soc, Sector-14 , Vashi<br/>
            Navi Mumbai<br/>
            GSTIN/UIN : 27AEGFS1650E1Z6<br/>
            State Name : Maharashtra, Code : 27
          </p>
        </div>
  
        <table class="main-border" style="margin-top:10px;">
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
            ${hsnSummary.map(hsn => `
              <tr>
                <td>${hsn.hsnCode}</td>
                <td class="right">${hsn.taxableValue.toFixed(2)}</td>
                <td>9%</td>
                <td class="right">${hsn.cgstAmount.toFixed(2)}</td>
                <td>9%</td>
                <td class="right">${hsn.sgstAmount.toFixed(2)}</td>
                <td class="right">${hsn.totalTax.toFixed(2)}</td>
              </tr>`).join('')}
             <tr class="bold">
              <td><b>Total</b></td>
              <td class="right">${totalBeforeTax.toFixed(2)}</td>
              <td></td>
              <td class="right">${cgst.toFixed(2)}</td>
              <td></td>
              <td class="right">${sgst.toFixed(2)}</td>
              <td class="right">${(cgst + sgst).toFixed(2)}</td>
            </tr>
             <tr>
           <td colspan="7"><b>Taxable Amount (in words):</b> <i>${numToWords(parseFloat((cgst + sgst).toFixed(2)))}
          </i></td>
           </tr>
          </tbody>
        </table>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
  
    invoiceWindow.document.close();
  };
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const renderTable = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-[1100px] w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
          <tr>
            <th className="w-10 px-3 py-3">
              <input
                type="checkbox"
                checked={
                  filteredCustomers.length > 0 &&
                  selectedChallans.length === filteredCustomers.length
                }
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            {[
              ["date", "Order Date"],
              ["orderNumber", "Order Number"],
              ["challanNo", "Challan No"],
              ["challanDate", "Challan Date"],
              ["warehouse.centerName", "Warehouse"],
              ["center.centerName", "Branch"],
              ["createdBy.email", "Posted By"],
              ["completionInfo.completedOn", "Completed At"],
            ].map(([key, label]) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="cursor-pointer whitespace-nowrap px-3 py-3 font-semibold transition hover:bg-gray-100"
              >
                {label}
                {getSortIcon(key)}
              </th>
            ))}
            <th className="px-3 py-3 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((item) => (
              <tr key={item._id} className="transition hover:bg-gray-50">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedChallans.includes(item._id)}
                    onChange={() => handleSelectChallan(item._id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-gray-700">
                  {formatDate(item.date)}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => handleClick(item._id)}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {item.orderNumber}
                  </button>
                </td>
                <td className="px-3 py-3 font-semibold text-gray-700">
                  {item.challanNo || "N/A"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-gray-700">
                  {item.challanDate ? formatDate(item.challanDate) : "N/A"}
                </td>
                <td className="px-3 py-3 text-gray-700">
                  {item.warehouse?.centerName || ""}
                </td>
                <td className="px-3 py-3 text-gray-700">
                  {item.center?.centerName || "N/A"}
                </td>
                <td className="px-3 py-3 text-gray-700">
                  {item.createdBy?.email || "N/A"}
                  {item.createdAt &&
                    ` At ${new Date(item.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}`}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-gray-700">
                  {item.completionInfo?.completedOn
                    ? formatDateTime(item.completionInfo.completedOn)
                    : "N/A"}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => handleGenerateChallan(item)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                  >
                    <FileText size={14} />
                    Challan
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-500">
                No completed stock requests found for invoice generation
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Sale Invoices</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchModalVisible(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>

          {(activeSearch.reseller ||
            activeSearch.center ||
            activeSearch.startDate ||
            activeSearch.endDate) && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <RotateCcw size={16} />
              Reset Search
            </button>
          )}

          {(activeSearch.reseller ||
            activeSearch.startDate ||
            activeSearch.endDate ||
            activeSearch.center) &&
            selectedChallans.length > 0 && (
              <button
                type="button"
                onClick={handleGenerateInvoice}
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <FileText size={16} />
                Generate Invoice
              </button>
            )}
        </div>
      </div>

      <SearchSaleInvoice
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        resellers={resellers}
        defaultStatus="Completed"
      />

      <ChallanModal
        visible={showChallanModal}
        onClose={() => setShowChallanModal(false)}
        data={selectedChallan}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-gray-500">Completed stock requests</div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="flex justify-end border-b border-gray-100 px-4 py-3">
          <div className="flex w-full max-w-sm items-center gap-2">
            <label
              htmlFor="sale-invoice-search"
              className="whitespace-nowrap text-sm font-medium text-gray-700"
            >
              Search:
            </label>
            <input
              id="sale-invoice-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  ? "Disabled during advanced search"
                  : "Search..."
              }
              className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="p-4">{renderTable()}</div>
      </div>
    </div>
  );
};

export default SaleInvoices;
