import html2pdf from 'html2pdf.js'

const generateStockPurchasePDF = (purchaseData) => {
        const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          font-size: 13px;
          color: #000000;
        }

        .tax-invoice-header {
          text-align: center;
          padding: 8px;
          margin-bottom: 10px;
        }

        .main-container {
          border: 1px solid #000000;
          padding: 0;
          height: 900px;
          display: flex;
          flex-direction: column;
        }

        .content-section {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .block {
          flex: 1;
          border-bottom: 1px solid #000000;
          display: flex;
        }

        .block:last-child {
          border-bottom: none;
        }

        .address-section {
          display: flex;
          width: 100%;
        }

        .left-address {
          flex: 1;
          border-right: 1px solid #000000;
          display: flex;
          flex-direction: column;
        }

        .right-address {
          flex: 1;
          display: flex;
        }

        .address-part {
          flex: 1;
          padding: 8px;
          border-bottom: 1px solid #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .address-part:last-child {
          border-bottom: none;
        }

        .invoice-details {
          flex: 1;
          display: flex;
        }

        .invoice-left {
          flex: 1;
          border-right: 1px solid #000000;
          padding: 0;
        }

        .invoice-right {
          flex: 1;
          padding: 0;
        }

        .detail-item {
          padding: 4px 8px;
          border-bottom: 1px solid #000000;
          min-height: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: bold;
          color: #000000;
          margin-bottom: 2px;
          font-size: 12px;
        }

        .detail-value {
          color: #000000;
          font-size: 12px;
          min-height: 15px;
        }

        .table-block {
          flex: 1.5;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          color: #000000;
          table-layout: fixed;
        }

        .items-table th,
        .items-table td {
          border: 1px solid #000000;
          padding: 6px;
          text-align: left;
          color: #000000;
          word-wrap: break-word;
        }

        .items-table th {
          background-color: #f2f2f2;
          font-weight: bold;
          color: #000000;
        }

        .sl-column {
          width: 5%;
        }

        .description-column {
          width: 40%;
        }

        .hsn-column {
          width: 15%;
        }

        .quantity-column {
          width: 10%;
        }

        .rate-column {
          width: 15%;
        }

        .amount-column {
          width: 15%;
        }

        .empty-block {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          font-style: italic;
          height: 100%;
        }

        .company-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 3px;
          color: #000000;
        }

        .gst-info {
          font-size: 11px;
          margin-top: 2px;
          color: #000000;
        }

        strong {
          color: #000000;
          font-weight: bold;
        }

        .table-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 5px;
          box-sizing: border-box;
        }

        .table-content {
          flex: 1;
          overflow: hidden;
        }
      </style>
    </head>

    <body>
      <div class="tax-invoice-header">
        <h2
          style="
            font-size: 16px;
            color: #000000;
            font-weight: bold;
            margin: 0;
          "
        >
          Tax Invoice
        </h2>
      </div>

      <div class="main-container">
        <div class="content-section">

          <!-- First Block -->
          <div class="block">
            <div class="address-section">

              <!-- Left Address -->
              <div class="left-address">

                <div class="address-part">
                  <div class="company-name">
                    SSV Telecom Private Limited
                  </div>

                  <div>
                    A-1, Landmark CHS, Sector 14
                  </div>

                  <div>
                    Vashi, Navi Mumbai
                  </div>

                  <div class="gst-info">
                    GSTIN/UIN: 27ABECS3422Q1ZX
                  </div>
                </div>

                <div class="address-part">
                  <strong>Consignee (Ship to)</strong>
                  <br />

                  SSV Alpha Broadband LLP
                  <br />

                  Mazgaon, Mahalaxmi, Vashi 2 ghansoli
                  <br />

                  Airoli 2, Vashi 1, Ulwe 19
                  <br />

                  Nerul 1, Kamothe-1, Seawoods 1KK10

                  <div class="gst-info">
                    GSTIN/UIN: 27AEGFS1650E1Z6
                  </div>

                  <div class="gst-info">
                    State Name: Maharashtra, Code: 27
                  </div>
                </div>

                <div class="address-part">
                  <strong>Buyer (Bill to)</strong>
                  <br />

                  SSV Alpha Broadband LLP
                  <br />

                  A/3, Landmark Soc, Sector-14
                  <br />

                  Vashi, Navi Mumbai

                  <div class="gst-info">
                    GSTIN/UIN: 27AEGFS1650E1Z6
                  </div>

                  <div class="gst-info">
                    State Name: Maharashtra, Code: 27
                  </div>
                </div>

              </div>

              <!-- Right Invoice Details -->
              <div class="right-address">

                <!-- Left Invoice Details -->
                <div class="invoice-left">

                  <div class="detail-item">
                    <div class="detail-label">
                      Invoice No.
                    </div>

                    <div class="detail-value">
                      ${purchaseData.invoiceNo || 'N/A'}
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Reference No. & Date.
                    </div>

                    <div class="detail-value"></div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Dispatch Doc No.
                    </div>

                    <div class="detail-value">
                      16.07-31.07.25
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Dated
                    </div>

                    <div class="detail-value">
                      31-Jul-25
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Other References
                    </div>

                    <div class="detail-value"></div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Dated
                    </div>

                    <div class="detail-value"></div>
                  </div>

                </div>

                <!-- Right Invoice Details -->
                <div class="invoice-right">

                  <div class="detail-item">
                    <div class="detail-label">
                      Dated
                    </div>

                    <div class="detail-value">
                      31-Jul-25
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Mode/Terms of Payment
                    </div>

                    <div class="detail-value"></div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Other References
                    </div>

                    <div class="detail-value"></div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Dated
                    </div>

                    <div class="detail-value"></div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Delivery Note Date
                    </div>

                    <div class="detail-value"></div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      Destination
                    </div>

                    <div class="detail-value">
                      All Alpha Area.
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          <!-- Second Block - Items Table -->
          <div class="block table-block">

            <div class="table-container">
              <div class="table-content">

                <table class="items-table">

                  <thead>
                    <tr>
                      <th
                        class="sl-column"
                        style="
                          color: #000000;
                          font-weight: bold;
                        "
                      >
                        Sl
                      </th>

                      <th
                        class="description-column"
                        style="
                          color: #000000;
                          font-weight: bold;
                        "
                      >
                        Description of Goods
                      </th>

                      <th
                        class="hsn-column"
                        style="
                          color: #000000;
                          font-weight: bold;
                        "
                      >
                        HSN/SAC
                      </th>

                      <th
                        class="quantity-column"
                        style="
                          color: #000000;
                          font-weight: bold;
                        "
                      >
                        Quantity
                      </th>

                      <th
                        class="rate-column"
                        style="
                          color: #000000;
                          font-weight: bold;
                        "
                      >
                        Rate per
                      </th>

                      <th
                        class="amount-column"
                        style="
                          color: #000000;
                          font-weight: bold;
                        "
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    ${
                      purchaseData.products &&
                      purchaseData.products.length > 0
                        ? purchaseData.products
                            .map(
                              (product, index) => `
                                <tr>

                                  <td
                                    class="sl-column"
                                    style="color: #000000;"
                                  >
                                    ${index + 1}
                                  </td>

                                  <td
                                    class="description-column"
                                    style="color: #000000;"
                                  >
                                    ${
                                      product.product
                                        ?.productTitle ||
                                      'N/A'
                                    }
                                  </td>

                                  <td
                                    class="hsn-column"
                                    style="color: #000000;"
                                  >
                                    ${
                                      product.product
                                        ?.productCode ||
                                      'N/A'
                                    }
                                  </td>

                                  <td
                                    class="quantity-column"
                                    style="color: #000000;"
                                  >
                                    ${
                                      product.purchasedQuantity ||
                                      0
                                    }
                                  </td>

                                  <td
                                    class="rate-column"
                                    style="color: #000000;"
                                  >
                                    ${product.price || 0}
                                  </td>

                                  <td
                                    class="amount-column"
                                    style="color: #000000;"
                                  >
                                    ${
                                      (product.purchasedQuantity ||
                                        0) *
                                        (product.price || 0) ||
                                      0
                                    }
                                  </td>

                                </tr>
                              `,
                            )
                            .join('')
                        : `
                          <tr>

                            <td
                              class="sl-column"
                              style="color: #000000;"
                            >
                              1
                            </td>

                            <td
                              class="description-column"
                              style="color: #000000;"
                            >
                              No Products
                            </td>

                            <td
                              class="hsn-column"
                              style="color: #000000;"
                            >
                              N/A
                            </td>

                            <td
                              class="quantity-column"
                              style="color: #000000;"
                            >
                              0
                            </td>

                            <td
                              class="rate-column"
                              style="color: #000000;"
                            >
                              0
                            </td>

                            <td
                              class="amount-column"
                              style="color: #000000;"
                            >
                              0
                            </td>

                          </tr>
                        `
                    }

                    <!-- Totals -->

                    <tr>
                      <td
                        colspan="5"
                        style="
                          text-align: right;
                          font-weight: bold;
                          color: #000000;
                        "
                      >
                        Transport Amount:
                      </td>

                      <td
                        class="amount-column"
                        style="color: #000000;"
                      >
                        ${purchaseData.transportAmount || 0}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colspan="5"
                        style="
                          text-align: right;
                          font-weight: bold;
                          color: #000000;
                        "
                      >
                        Product Amount:
                      </td>

                      <td
                        class="amount-column"
                        style="color: #000000;"
                      >
                        ${purchaseData.productAmount || 0}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colspan="5"
                        style="
                          text-align: right;
                          font-weight: bold;
                          color: #000000;
                        "
                      >
                        CGST:
                      </td>

                      <td
                        class="amount-column"
                        style="color: #000000;"
                      >
                        ${purchaseData.cgst || 0}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colspan="5"
                        style="
                          text-align: right;
                          font-weight: bold;
                          color: #000000;
                        "
                      >
                        SGST:
                      </td>

                      <td
                        class="amount-column"
                        style="color: #000000;"
                      >
                        ${purchaseData.sgst || 0}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colspan="5"
                        style="
                          text-align: right;
                          font-weight: bold;
                          color: #000000;
                        "
                      >
                        IGST:
                      </td>

                      <td
                        class="amount-column"
                        style="color: #000000;"
                      >
                        ${purchaseData.igst || 0}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colspan="5"
                        style="
                          text-align: right;
                          font-weight: bold;
                          color: #000000;
                        "
                      >
                        Total Amount:
                      </td>

                      <td
                        class="amount-column"
                        style="
                          color: #000000;
                          font-weight: bold;
                        "
                      >
                        ${purchaseData.totalAmount || 0}
                      </td>
                    </tr>

                  </tbody>
                </table>

              </div>
            </div>

          </div>

          <!-- Third Block -->
          <div class="block empty-block">
            <div>

              <p
                style="
                  color: #000000;
                  margin: 0;
                "
              >
                This is a Computer Generated Invoice
              </p>

              <p
                style="
                  color: #000000;
                  margin: 0;
                "
              >
                Thank you for your business!
              </p>

            </div>
          </div>

        </div>
      </div>
    </body>
    </html>
  `

  const options = {
    margin: 10,

    filename: `stock_purchase_${
      purchaseData.invoiceNo || 'invoice'
    }.pdf`,

    image: {
      type: 'jpeg',
      quality: 0.98,
    },

    html2canvas: {
      scale: 2,
    },

    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  }

  return html2pdf()
    .from(content)
    .set(options)
    .save()
}

export default generateStockPurchasePDF