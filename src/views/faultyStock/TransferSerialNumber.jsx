import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Check, Search, X } from 'lucide-react'

const TransferSerialNumber = ({
  visible,
  onClose,
  product,
  usageQty,
  onSerialNumbersUpdate,
  availableSerials = [],
}) => {
  const [selectedSerials, setSelectedSerials] = useState({})
  const [searchTerms, setSearchTerms] = useState({})
  const [showDropdowns, setShowDropdowns] = useState({})

  const srNumbers = Array.from(
    { length: usageQty },
    (_, i) => i + 1,
  )

  useEffect(() => {
    if (visible && product?._id && usageQty > 0) {
      setSelectedSerials({})
    }
  }, [visible, product, usageQty])

  useEffect(() => {
    if (!visible) {
      setSelectedSerials({})
      setSearchTerms({})
      setShowDropdowns({})
    }
  }, [visible])

  const handleSerialSelect = (srNumber, serialNumber) => {
    setSelectedSerials((prev) => ({
      ...prev,
      [srNumber]: serialNumber,
    }))

    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: '',
    }))

    setShowDropdowns((prev) => ({
      ...prev,
      [srNumber]: false,
    }))
  }

  const handleDeleteSerial = (srNumber) => {
    setSelectedSerials((prev) => {
      const newSelected = { ...prev }
      delete newSelected[srNumber]
      return newSelected
    })

    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: '',
    }))
  }

  const handleSearchChange = (srNumber, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: value,
    }))
  }

  const handleSearchFocus = (srNumber) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [srNumber]: true,
    }))
  }

  const handleSearchBlur = (srNumber) => {
    setTimeout(() => {
      setShowDropdowns((prev) => ({
        ...prev,
        [srNumber]: false,
      }))
    }, 200)
  }

  const getFilteredOptions = (srNumber) => {
    const searchTerm = searchTerms[srNumber] || ''
    const currentlySelected = Object.values(selectedSerials)

    return availableSerials.filter((serial) => {
      const serialNumber =
        typeof serial === 'string'
          ? serial
          : serial.serialNumber

      if (!serialNumber) return false

      const matchesSearch = serialNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const isAvailable =
        !currentlySelected.includes(serialNumber) ||
        selectedSerials[srNumber] === serialNumber

      return matchesSearch && isAvailable
    })
  }

  const handleSave = () => {
    const missingSerials = srNumbers.filter(
      (srNum) => !selectedSerials[srNum],
    )

    if (missingSerials.length > 0) {
      alert(
        `Please select serial numbers for all items (SR ${missingSerials.join(
          ', ',
        )})`,
      )
      return
    }

    const serialsArray = Object.entries(selectedSerials)
      .sort(
        ([a], [b]) =>
          parseInt(a, 10) - parseInt(b, 10),
      )
      .map(([, serialNumber]) => serialNumber)

    if (onSerialNumbersUpdate && product?._id) {
      onSerialNumbersUpdate(product._id, serialsArray)
    }

    onClose()
  }

  if (!visible || usageQty <= 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Serial Numbers for{' '}
            <span className="text-blue-600">
              {product?.productTitle}
            </span>
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5">
          {availableSerials.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4 text-center text-sm text-yellow-800">
              No repaired serial numbers available for
              this product.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[650px] border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-[15%] border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                      SR.
                    </th>

                    <th className="w-[85%] border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                      Serial Number
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {srNumbers.map((srNumber) => {
                    const selectedSerial =
                      selectedSerials[srNumber]

                    const filteredOptions =
                      getFilteredOptions(srNumber)

                    const showDropdown =
                      showDropdowns[srNumber]

                    return (
                      <tr
                        key={srNumber}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-200 px-4 py-3 align-top">
                          <span className="font-semibold text-gray-800">
                            {srNumber}
                          </span>
                        </td>

                        <td className="border-b border-gray-200 px-4 py-3">
                          <div className="relative">
                            {selectedSerial ? (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <Check
                                      size={16}
                                      className="text-green-600"
                                    />

                                    <strong className="break-all text-sm text-gray-800">
                                      {selectedSerial}
                                    </strong>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteSerial(
                                      srNumber,
                                    )
                                  }
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100"
                                  aria-label={`Remove serial ${srNumber}`}
                                >
                                  <X size={17} />
                                </button>
                              </div>
                            ) : (
                              <div>
                                {/* Search Input */}
                                <div className="relative">
                                  <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  />

                                  <input
                                    type="text"
                                    value={
                                      searchTerms[srNumber] ||
                                      ''
                                    }
                                    onChange={(e) =>
                                      handleSearchChange(
                                        srNumber,
                                        e.target.value,
                                      )
                                    }
                                    onFocus={() =>
                                      handleSearchFocus(
                                        srNumber,
                                      )
                                    }
                                    onBlur={() =>
                                      handleSearchBlur(
                                        srNumber,
                                      )
                                    }
                                    placeholder="Search serial number"
                                    className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                  />
                                </div>

                                {/* Dropdown */}
                                {showDropdown && (
                                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                                      Select Serial Number
                                    </div>

                                    <div className="max-h-[200px] overflow-y-auto">
                                      {filteredOptions.length >
                                      0 ? (
                                        filteredOptions.map(
                                          (
                                            serial,
                                            index,
                                          ) => {
                                            const serialNumber =
                                              typeof serial ===
                                              'string'
                                                ? serial
                                                : serial.serialNumber

                                            return (
                                              <button
                                                type="button"
                                                key={`${serialNumber}-${index}`}
                                                onMouseDown={(
                                                  e,
                                                ) =>
                                                  e.preventDefault()
                                                }
                                                onClick={() =>
                                                  handleSerialSelect(
                                                    srNumber,
                                                    serialNumber,
                                                  )
                                                }
                                                className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition last:border-b-0 hover:bg-gray-50"
                                              >
                                                {serialNumber}
                                              </button>
                                            )
                                          },
                                        )
                                      ) : (
                                        <div className="px-3 py-3 text-center text-sm text-gray-500">
                                          No serial numbers
                                          found
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              Object.keys(selectedSerials).length !== usageQty
            }
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

TransferSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    productTitle: PropTypes.string,
    trackSerialNumber: PropTypes.string,
  }),
  usageQty: PropTypes.number.isRequired,
  onSerialNumbersUpdate: PropTypes.func.isRequired,
  availableSerials: PropTypes.array,
}

TransferSerialNumber.defaultProps = {
  product: {
    _id: '',
    productTitle: '',
  },
  usageQty: 0,
  availableSerials: [],
}

export default TransferSerialNumber