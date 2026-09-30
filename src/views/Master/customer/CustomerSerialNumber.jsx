import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AlertTriangle, Loader2, X } from 'lucide-react'

import axiosInstance from '../../../axiosInstance'
import {
  showSuccess,
  showError,
} from '../../../utils/sweetAlerts'

const CustomerSerialNumber = ({
  visible,
  onClose,
  productId,
  productName,
  usageId,
  oldSerialNumber,
  onReplaceSuccess,
}) => {
  const [availableSerials, setAvailableSerials] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [selectedSerial, setSelectedSerial] = useState('')
  const [markAsDamage, setMarkAsDamage] = useState(false)

  useEffect(() => {
    const fetchAvailableSerials = async () => {
      if (!visible || !productId) return

      try {
        setLoading(true)
        setError('')
        setAvailableSerials([])
        setSelectedSerial('')
        setMarkAsDamage(false)

        const response = await axiosInstance.get(
          `/stockrequest/serial-numbers/product/${productId}`
        )

        if (response.data.success) {
          setAvailableSerials(
            response.data.data.availableSerials || []
          )
        } else {
          throw new Error(
            response.data.message ||
              'Failed to fetch serial numbers'
          )
        }
      } catch (err) {
        console.error(
          'Error fetching serial numbers:',
          err
        )

        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch serial numbers'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableSerials()
  }, [visible, productId])

  const handleSave = async () => {
    if (!selectedSerial && !markAsDamage) {
      showError(
        'Please select either a new serial number for replacement or mark as damage'
      )
      return
    }

    try {
      setSaving(true)

      const requests = []

      // Replace serial number
      if (selectedSerial) {
        const replacePayload = {
          originalUsageId: usageId,
          productId,
          oldSerialNumber,
          newSerialNumber: selectedSerial,
        }

        requests.push(
          axiosInstance.post(
            '/stockusage/replace-serial',
            replacePayload
          )
        )
      }

      // Mark old serial as damage
      if (markAsDamage) {
        const damagePayload = {
          usageId,
          serialNumber: oldSerialNumber,
          remark:
            'Product marked as damaged - returned from customer',
        }

        requests.push(
          axiosInstance.post(
            '/damage/damage-returns',
            damagePayload
          )
        )
      }

      const responses = await Promise.all(requests)

      const allSuccess = responses.every(
        (response) => response.data.success
      )

      if (allSuccess) {
        let successMessage = ''

        if (selectedSerial && markAsDamage) {
          successMessage = `Serial number replaced successfully and old serial ${oldSerialNumber} marked as damaged!`
        } else if (selectedSerial) {
          successMessage =
            'Serial number replaced successfully!'
        } else if (markAsDamage) {
          successMessage = `Serial number ${oldSerialNumber} marked as damaged successfully!`
        }

        showSuccess(successMessage)

        if (onReplaceSuccess) {
          onReplaceSuccess()
        }

        onClose()
      } else {
        throw new Error(
          'One or more operations failed'
        )
      }
    } catch (err) {
      console.error(
        'Error in save operation:',
        err
      )

      showError(
        err.response?.data?.message ||
          err.message ||
          'Failed to process request'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDamageCheckbox = (event) => {
    setMarkAsDamage(event.target.checked)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Replace/Damage product serial
            {productName && (
              <span className="text-blue-600">
                {' '}
                - {productName}
              </span>
            )}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-600">
              <Loader2
                size={30}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm">
                Loading available serial numbers...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-4 text-center text-sm text-red-700">
              <strong>{error}</strong>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Current Serial */}
              <div className="mb-5 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <span className="font-semibold">
                  Current Serial Number:
                </span>{' '}
                {oldSerialNumber || 'N/A'}
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        New Serial No.
                      </th>

                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        Damage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border-b border-gray-100 px-4 py-4">
                        <label
                          htmlFor="newSerialNumber"
                          className="sr-only"
                        >
                          Select New Serial Number
                        </label>

                        <select
                          id="newSerialNumber"
                          value={selectedSerial}
                          onChange={(e) =>
                            setSelectedSerial(
                              e.target.value
                            )
                          }
                          disabled={saving}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                          <option value="">
                            -- Select New Serial Number --
                          </option>

                          {availableSerials.map(
                            (serial, index) => {
                              const serialValue =
                                serial.serialNumber ||
                                serial.SerialNo ||
                                serial

                              return (
                                <option
                                  key={`${serialValue}-${index}`}
                                  value={serialValue}
                                >
                                  {serialValue}
                                </option>
                              )
                            }
                          )}
                        </select>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-4">
                        <label
                          htmlFor="damageCheckbox"
                          className={`flex cursor-pointer items-center gap-3 ${
                            saving
                              ? 'cursor-not-allowed opacity-50'
                              : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="damageCheckbox"
                            checked={markAsDamage}
                            onChange={
                              handleDamageCheckbox
                            }
                            disabled={saving}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            Damaged old serial product
                          </span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* No serial numbers */}
          {!loading &&
            !error &&
            availableSerials.length === 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                <AlertTriangle size={18} />

                <span>
                  No available serial numbers found for
                  replacement.
                </span>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              (!selectedSerial && !markAsDamage) ||
              saving
            }
            className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

CustomerSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.string,
  productName: PropTypes.string,
  usageId: PropTypes.string,
  oldSerialNumber: PropTypes.string,
  onReplaceSuccess: PropTypes.func,
}

CustomerSerialNumber.defaultProps = {
  productId: '',
  productName: '',
  usageId: '',
  oldSerialNumber: '',
  onReplaceSuccess: undefined,
}

export default CustomerSerialNumber