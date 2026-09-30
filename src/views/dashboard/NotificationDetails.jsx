import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  ArrowUpDown,
  ArrowLeft,
  Printer,
} from 'lucide-react'

const NotificationDetails = ({
  notification,
  onBack,
}) => {
  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: 'asc',
    })

  const [searchQuery, setSearchQuery] =
    useState('')

  const data = [
    {
      product: 'Splicing Box (2 Port)',
      centerStock: '13',
      requestedQty: '5',
      productRemark: '',
      approvedQty: '0',
      approvedRemark: 'Out of stock',
      receivedQty: '',
      receivedRemark: 'Not received',
    },
    {
      product: 'Splicing Box (4 Port)',
      centerStock: '10',
      requestedQty: '3',
      productRemark: '',
      approvedQty: '3',
      approvedRemark: 'Approved',
      receivedQty: '',
      receivedRemark: 'Pending delivery',
    },
    {
      product: 'Fiber Patch Cord (SC-SC)',
      centerStock: '25',
      requestedQty: '10',
      productRemark: 'For new installation',
      approvedQty: '8',
      approvedRemark: 'Partial approval',
      receivedQty: '8',
      receivedRemark: 'Received on 20 Jun',
    },
    {
      product: 'Fiber Patch Cord (LC-LC)',
      centerStock: '18',
      requestedQty: '5',
      productRemark: '',
      approvedQty: '5',
      approvedRemark: 'Approved',
      receivedQty: '5',
      receivedRemark: 'Received on 21 Jun',
    },
    {
      product: 'Optical Splitter (1x8)',
      centerStock: '7',
      requestedQty: '2',
      productRemark: 'For maintenance',
      approvedQty: '2',
      approvedRemark: 'Approved',
      receivedQty: '2',
      receivedRemark: 'Received on 22 Jun',
    },
    {
      product: 'Optical Splitter (1x16)',
      centerStock: '4',
      requestedQty: '1',
      productRemark: '',
      approvedQty: '0',
      approvedRemark: 'Out of stock',
      receivedQty: '',
      receivedRemark: 'Not received',
    },
    {
      product: 'Fiber Termination Box',
      centerStock: '9',
      requestedQty: '3',
      productRemark: 'For customer premises',
      approvedQty: '3',
      approvedRemark: 'Approved',
      receivedQty: '3',
      receivedRemark: 'Received on 23 Jun',
    },
    {
      product: 'Fiber Cable (100m)',
      centerStock: '6',
      requestedQty: '2',
      productRemark: '',
      approvedQty: '1',
      approvedRemark: 'Partial approval',
      receivedQty: '1',
      receivedRemark: 'Received on 24 Jun',
    },
    {
      product: 'Fiber Cable (500m)',
      centerStock: '3',
      requestedQty: '1',
      productRemark: 'For backbone',
      approvedQty: '0',
      approvedRemark: 'Out of stock',
      receivedQty: '',
      receivedRemark: 'Not received',
    },
    {
      product: 'Fiber Connector (SC)',
      centerStock: '45',
      requestedQty: '20',
      productRemark: '',
      approvedQty: '20',
      approvedRemark: 'Approved',
      receivedQty: '20',
      receivedRemark: 'Received on 25 Jun',
    },
    {
      product: 'Fiber Connector (LC)',
      centerStock: '38',
      requestedQty: '15',
      productRemark: 'For new customers',
      approvedQty: '15',
      approvedRemark: 'Approved',
      receivedQty: '15',
      receivedRemark: 'Received on 26 Jun',
    },
    {
      product: 'Fiber Adapter (SC)',
      centerStock: '22',
      requestedQty: '10',
      productRemark: '',
      approvedQty: '10',
      approvedRemark: 'Approved',
      receivedQty: '10',
      receivedRemark: 'Received on 27 Jun',
    },
  ]

  const parseDate = (dateStr) => {
    const [
      day,
      month,
      year,
    ] = dateStr.split(' ')

    return new Date(
      `${month} ${day}, ${year}`,
    )
  }

  const compare = (a, b, key) => {
    if (key === 'date') {
      const dateA = parseDate(a[key])
      const dateB = parseDate(b[key])

      return dateB - dateA
    }

    const valA =
      a[key] &&
      a[key]
        .toString()
        .toLowerCase()

    const valB =
      b[key] &&
      b[key]
        .toString()
        .toLowerCase()

    return (valA || '').localeCompare(
      valB || '',
      undefined,
      {
        numeric: true,
      },
    )
  }

  const sortedData = [
    ...data,
  ].sort((a, b) => {
    if (!sortConfig.key) {
      return 0
    }

    const result = compare(
      a,
      b,
      sortConfig.key,
    )

    return sortConfig.direction === 'asc'
      ? result
      : -result
  })

  const filteredData =
    sortedData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value
            .toString()
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase(),
            ),
      ),
    )

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key &&
        prev.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  const SortIcon = () => {
    return (
      <ArrowUpDown
        size={13}
        strokeWidth={2.5}
        className="ml-1 shrink-0"
      />
    )
  }

  return (
    <div
      className="
        mt-1
        space-y-4
        px-6
        pt-3
      "
    >
      {/* Page Header */}
      <div className="mb-4 flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex
            items-center
            gap-1.5
            rounded
            bg-[#2759A2]
            px-3
            py-1.5
            text-sm
            text-white
            transition-colors
            hover:bg-[#1f4a89]
          "
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <h2
          className="
            pl-1
            text-xl
            font-light
            text-[#444444]
          "
        >
          Indent Details
        </h2>
      </div>

      {/* Indent Detail Section */}
      <div
        className="
          rounded
          border-t-[3px]
          border-[#2759A2]
          bg-white
          px-2
          py-1
          shadow
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          <div className="flex items-center gap-5">
            <h3
              className="
                text-xl
                text-[#444444]
              "
            >
              Indent : VASHO/VASHIHO/0625/4
            </h3>

            <button
              type="button"
              onClick={onBack}
              className="
                rounded
                bg-[#2759A2]
                px-3
                py-1
                text-sm
                text-white
              "
            >
              Confirmed
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded
              bg-[#2759A2]
              px-3
              py-1.5
              text-sm
              text-white
              transition-colors
              hover:bg-[#1f4a89]
            "
          >
            <Printer size={15} />
            Print Indent
          </button>
        </div>

        {/* Indent Information Table */}
        <div className="mx-4 mt-7 overflow-x-auto">
          <table
            className="
              w-full
              min-w-[800px]
              table-fixed
              border-collapse
              border
              border-[#f0f0f0]
            "
          >
            <colgroup>
              <col className="w-[18.66%]" />
              <col className="w-[17.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[13.66%]" />
            </colgroup>

            <tbody>
              {[
                {
                  product:
                    'Center/Center Code',
                  centerStock:
                    'VASHO/VASHI HO',
                  requestedQty:
                    'Shipment Date',
                  approvedQty:
                    'Completed on',
                },
                {
                  product:
                    'Indent Date',
                  centerStock:
                    '20 Jun 2025',
                  requestedQty:
                    'Expected Delivery',
                  approvedQty:
                    'Completed by',
                },
                {
                  product: 'Remark',
                  centerStock:
                    'Ram sajan ( GTB Office ) for main line',
                  requestedQty:
                    'Shipment Detail',
                  approvedQty:
                    'Incomplete on',
                },
                {
                  product: 'Created at',
                  centerStock:
                    '20 Jun 2025 04:25 PM',
                  requestedQty:
                    'Shipment Remark',
                  approvedQty:
                    'Incomplete by',
                },
                {
                  product: 'Created by',
                  centerStock:
                    'VASHI HO',
                  requestedQty:
                    'Document',
                  approvedQty:
                    'Incomplete Remark',
                },
                {
                  product: 'Approved at',
                  centerStock:
                    '23 Jun 2025 01:22 PM',
                  requestedQty:
                    'Shipment at',
                  approvedQty:
                    'Received at',
                },
                {
                  product: 'Approved by',
                  centerStock:
                    'VASHI WAREHOUSE',
                  requestedQty:
                    'Shipped by',
                  approvedQty:
                    'Received by',
                },
              ].map(
                (item, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? 'bg-gray-50'
                        : 'bg-white'
                    }
                  >
                    <td
                      className="
                        border
                        border-[#f0f0f0]
                        px-3
                        py-1.5
                        align-top
                        text-sm
                        font-bold
                        text-[#333333]
                      "
                    >
                      {item.product}
                    </td>

                    <td
                      className="
                        border
                        border-[#f0f0f0]
                        px-3
                        py-1.5
                        align-top
                        text-sm
                        text-gray-700
                      "
                    >
                      {item.centerStock}
                    </td>

                    <td
                      className="
                        border
                        border-[#f0f0f0]
                        px-3
                        py-1.5
                        align-top
                        text-sm
                        font-bold
                        text-gray-700
                      "
                    >
                      {item.requestedQty}
                    </td>

                    <td
                      className="
                        border
                        border-[#f0f0f0]
                        px-3
                        py-1.5
                        align-top
                        text-sm
                        text-gray-700
                      "
                    />

                    <td
                      className="
                        border
                        border-[#f0f0f0]
                        px-3
                        py-1.5
                        align-top
                        text-sm
                        font-bold
                        text-gray-700
                      "
                    >
                      {item.approvedQty}
                    </td>

                    <td
                      className="
                        border
                        border-[#f0f0f0]
                        px-3
                        py-1.5
                        align-top
                        text-sm
                        text-gray-700
                      "
                    />
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details */}
      <div
        className="
          overflow-hidden
          rounded-lg
          border-t-[3px]
          border-[#2759A2]
          bg-white
          shadow
        "
      >
        <h3
          className="
            px-3
            pt-2
            text-xl
            text-[#444444]
          "
        >
          Product Details
        </h3>

        {/* Search */}
        <div
          className="
            mt-3
            flex
            items-center
            justify-end
            gap-2
            pr-4
          "
        >
          <div className="flex items-center">
            <label
              htmlFor="notification-search"
              className="
                mr-2
                text-sm
                text-[#333333]
              "
            >
              Search:
            </label>

            <input
              id="notification-search"
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value,
                )
              }
              className="
                h-7
                border-l-2
                border-t-2
                border-l-[#212121]
                border-t-[#212121]
                border-r-2
                border-b-2
                border-r-[#767676]
                border-b-[#767676]
                px-2
                py-0.5
                text-sm
                outline-none
              "
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[1000px]
                border-collapse
                border
                border-[#f0f0f0]
              "
            >
              <thead>
                <tr>
                  {[
                    {
                      key: 'product',
                      label: 'Product',
                      width: '8%',
                    },
                    {
                      key: 'centerStock',
                      label: 'Center Stock',
                      width: '12%',
                    },
                    {
                      key: 'requestedQty',
                      label: 'Requested Qty',
                      width: '14%',
                    },
                    {
                      key: 'productRemark',
                      label: 'Product Remark',
                      width: '18%',
                    },
                    {
                      key: 'approvedQty',
                      label: 'Approved Qty',
                      width: '12%',
                    },
                    {
                      key: 'approvedRemark',
                      label: 'Approved Remark',
                      width: '15%',
                    },
                    {
                      key: 'receivedQty',
                      label: 'Received Qty',
                      width: '12%',
                    },
                    {
                      key: 'receivedRemark',
                      label: 'Received Remark',
                      width: '18%',
                    },
                  ].map(
                    ({
                      key,
                      label,
                      width,
                    }) => (
                      <th
                        key={key}
                        onClick={() =>
                          requestSort(key)
                        }
                        className="
                          cursor-pointer
                          whitespace-nowrap
                          border
                          border-[#f0f0f0]
                          bg-white
                          px-2
                          py-2
                          text-left
                          text-sm
                          font-bold
                          text-[#333333]
                          transition-colors
                          hover:bg-gray-50
                        "
                        style={{
                          width,
                        }}
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-1
                          "
                        >
                          <span className="truncate">
                            {label}
                          </span>

                          <SortIcon />
                        </div>
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredData.map(
                  (item, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? 'bg-gray-50'
                          : 'bg-white'
                      }
                    >
                      <td
                        className="
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          pb-3.5
                          pt-1
                          align-top
                          text-sm
                          text-gray-700
                        "
                      >
                        {item.product}
                      </td>

                      <td
                        className="
                          cursor-pointer
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          py-1
                          align-top
                          text-sm
                          text-[#338ab7]
                          hover:text-[#89BCD9]
                        "
                      >
                        {item.centerStock}
                      </td>

                      <td
                        className="
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          py-1
                          align-top
                          text-sm
                          text-gray-700
                        "
                      >
                        {item.requestedQty}
                      </td>

                      <td
                        className="
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          py-1
                          align-top
                          text-sm
                          text-gray-700
                        "
                      >
                        {item.productRemark}
                      </td>

                      <td
                        className="
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          py-1
                          align-top
                          text-sm
                          text-gray-700
                        "
                      >
                        {item.approvedQty}
                      </td>

                      <td
                        className="
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          py-1
                          align-top
                          text-sm
                          text-gray-700
                        "
                      >
                        {item.approvedRemark}
                      </td>

                      <td
                        className="
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          py-1
                          align-top
                          text-sm
                          text-gray-700
                        "
                      >
                        {item.requestedQty}
                      </td>

                      <td
                        className="
                          break-words
                          border
                          border-[#f0f0f0]
                          px-2
                          py-1
                          align-top
                          text-sm
                          text-gray-700
                        "
                      >
                        {item.receivedRemark}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

NotificationDetails.propTypes = {
  notification: PropTypes.any,
  onBack: PropTypes.func.isRequired,
}

export default NotificationDetails