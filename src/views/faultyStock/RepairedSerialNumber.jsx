import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { X, Search } from 'lucide-react'

import axiosInstance from '../../axiosInstance'

const RepairedSerialNumber = ({
  visible,
  onClose,
  product,
  usageQty,
  onSerialNumbersUpdate,
}) => {
  const [availableSerials, setAvailableSerials] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSerials, setSelectedSerials] = useState({})
  const [searchTerms, setSearchTerms] = useState({})
  const [showDropdowns, setShowDropdowns] = useState({})

  const srNumbers = Array.from(
    { length: usageQty },
    (_, i) => i + 1,
  )

  useEffect(() => {
    if (visible && product?._id && usageQty > 0) {
      fetchAvailableSerials()
      setSelectedSerials({})
    }
  }, [visible, product, usageQty])

  useEffect(() => {
    if (!visible) {
      setSelectedSerials({})
      setSearchTerms({})
      setShowDropdowns({})
      setError(null)
    }
  }, [visible])

  const fetchAvailableSerials = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!product?._id) {
        throw new Error('Product ID is required')
      }

      const response = await axiosInstance.get(
        `/faulty-stock/serials/${product._id}`,
      )

      if (response.data.success) {
        setAvailableSerials(
          response.data.data?.availableSerials || [],
        )
      } else {
        throw new Error(
          response.data.message ||
            'Failed to fetch serial numbers',
        )
      }
    } catch (err) {
      console.error(
        'Error fetching serial numbers:',
        err,
      )

      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to fetch serial numbers',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSerialSelect = (
    srNumber,
    serialNumber,
  ) => {
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

  const handleSearchChange = (
    srNumber,
    value,
  ) => {
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
    const searchTerm =
      searchTerms[srNumber] || ''

    const currentlySelected =
      Object.values(selectedSerials)

    return availableSerials.filter((serial) => {
      const serialValue =
        serial.serialNumber || ''

      const matchesSearch = serialValue
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const isAvailable =
        !currentlySelected.includes(
          serialValue,
        ) ||
        selectedSerials[srNumber] ===
          serialValue

      return matchesSearch && isAvailable
    })
  }

  const handleSave = () => {
    const missingSerials = srNumbers.filter(
      (srNum) => !selectedSerials[srNum],
    )

    if (missingSerials.length > 0) {
      setError(
        `Please select serial numbers for all items (SR ${missingSerials.join(
          ', ',
        )})`,
      )
      return
    }

    const serialsArray = Object.entries(
      selectedSerials,
    )
      .sort(
        ([a], [b]) =>
          parseInt(a, 10) -
          parseInt(b, 10),
      )
      .map(
        ([, serialNumber]) =>
          serialNumber,
      )

    if (
      onSerialNumbersUpdate &&
      product?._id
    ) {
      onSerialNumbersUpdate(
        product._id,
        serialsArray,
      )
    }

    onClose()
  }

  if (usageQty <= 0) {
    return null
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Serial Numbers for{' '}
            {product?.productTitle || ''}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4">
          {error && (
            <div className="mb-4 flex items-start justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-3 shrink-0 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

              <div className="mt-3 text-sm text-gray-600">
                Loading available serial numbers...
              </div>
            </div>
          ) : availableSerials.length === 0 ? (
            <div className="py-6">
              <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800">
                No serial numbers available for
                this product.
              </div>
            </div>
          ) : (
            <div className="overflow-visible rounded-lg border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-[15%] border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      SR.
                    </th>

                    <th className="w-[85%] border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Serial Number
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {srNumbers.map((srNumber) => {
                    const selectedSerial =
                      selectedSerials[
                        srNumber
                      ]

                    const filteredOptions =
                      getFilteredOptions(
                        srNumber,
                      )

                    const showDropdown =
                      showDropdowns[
                        srNumber
                      ]

                    return (
                      <tr
                        key={srNumber}
                        className="hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-200 px-4 py-3 align-top">
                          <span className="font-semibold text-gray-800">
                            {srNumber}
                          </span>
                        </td>

                        <td className="border-b border-gray-200 px-4 py-3">
                          {selectedSerial ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
                                {selectedSerial}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteSerial(
                                    srNumber,
                                  )
                                }
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-700"
                                aria-label="Remove serial number"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                <input
                                  type="text"
                                  value={
                                    searchTerms[
                                      srNumber
                                    ] || ''
                                  }
                                  onChange={(e) =>
                                    handleSearchChange(
                                      srNumber,
                                      e.target
                                        .value,
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
                                  className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                              </div>

                              {showDropdown && (
                                <div className="absolute left-0 right-0 top-full z-[1100] mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                  <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                                    Select Serial
                                    Number
                                  </div>

                                  <div>
                                    {filteredOptions.length >
                                    0 ? (
                                      filteredOptions.map(
                                        (
                                          serial,
                                        ) => (
                                          <button
                                            type="button"
                                            key={
                                              serial.serialNumber
                                            }
                                            onMouseDown={(
                                              event,
                                            ) =>
                                              event.preventDefault()
                                            }
                                            onClick={() =>
                                              handleSerialSelect(
                                                srNumber,
                                                serial.serialNumber,
                                              )
                                            }
                                            className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition last:border-b-0 hover:bg-gray-50"
                                          >
                                            {serial.serialNumber}
                                          </button>
                                        ),
                                      )
                                    ) : (
                                      <div className="px-3 py-3 text-center text-sm text-gray-500">
                                        No serial
                                        numbers
                                        found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
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
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              Object.keys(selectedSerials)
                .length !== usageQty
            }
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

RepairedSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,

  product: PropTypes.shape({
    _id: PropTypes.string,
    productTitle: PropTypes.string,
    trackSerialNumber: PropTypes.string,
  }),

  usageQty: PropTypes.number.isRequired,
  onSerialNumbersUpdate:
    PropTypes.func.isRequired,
}

RepairedSerialNumber.defaultProps = {
  product: {
    _id: '',
    productTitle: '',
  },
  usageQty: 0,
}

export default RepairedSerialNumber