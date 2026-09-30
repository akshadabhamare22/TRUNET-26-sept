import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X, Trash2, Search, Save, Loader2 } from "lucide-react";
import axiosInstance from "../../axiosInstance";
const UnderRepairedSerial = ({
  visible,
  onClose,
  product,
  usageQty,
  onSerialNumbersUpdate,
}) => {
  const [availableSerials, setAvailableSerials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [showDropdowns, setShowDropdowns] = useState({});

  const srNumbers = Array.from(
    { length: usageQty },
    (_, i) => i + 1
  );

  // --------------------------------------------------
  // Fetch serial numbers when modal opens
  // --------------------------------------------------
  useEffect(() => {
    if (visible && product?._id && usageQty > 0) {
      fetchAvailableSerials();
      setSelectedSerials({});
    }
  }, [visible, product, usageQty]);

  // --------------------------------------------------
  // Reset modal state when closed
  // --------------------------------------------------
  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setError(null);
    }
  }, [visible]);

  // --------------------------------------------------
  // Fetch available serial numbers
  // --------------------------------------------------
  const fetchAvailableSerials = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!product?._id) {
        throw new Error("Product ID is required");
      }

      const response = await axiosInstance.get(
        `/testing-material/under-testing/product/${product._id}/serial`
      );

      if (response.data.success) {
        setAvailableSerials(
          response.data.data?.availableSerials || []
        );
      } else {
        throw new Error(
          response.data.message ||
            "Failed to fetch serial numbers"
        );
      }
    } catch (err) {
      console.error(
        "Error fetching serial numbers:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch serial numbers"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Select serial number
  // --------------------------------------------------
  const handleSerialSelect = (
    srNumber,
    serialNumber
  ) => {
    setSelectedSerials((prev) => ({
      ...prev,
      [srNumber]: serialNumber,
    }));

    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: "",
    }));

    setShowDropdowns((prev) => ({
      ...prev,
      [srNumber]: false,
    }));
  };

  // --------------------------------------------------
  // Delete selected serial
  // --------------------------------------------------
  const handleDeleteSerial = (srNumber) => {
    setSelectedSerials((prev) => {
      const newSelected = { ...prev };
      delete newSelected[srNumber];
      return newSelected;
    });

    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: "",
    }));
  };

  // --------------------------------------------------
  // Search serial
  // --------------------------------------------------
  const handleSearchChange = (
    srNumber,
    value
  ) => {
    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: value,
    }));
  };

  // --------------------------------------------------
  // Show dropdown
  // --------------------------------------------------
  const handleSearchFocus = (srNumber) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [srNumber]: true,
    }));
  };

  // --------------------------------------------------
  // Hide dropdown
  // --------------------------------------------------
  const handleSearchBlur = (srNumber) => {
    setTimeout(() => {
      setShowDropdowns((prev) => ({
        ...prev,
        [srNumber]: false,
      }));
    }, 200);
  };

  // --------------------------------------------------
  // Filter available serials
  // --------------------------------------------------
  const getFilteredOptions = (srNumber) => {
    const searchTerm =
      searchTerms[srNumber] || "";

    const currentlySelected =
      Object.values(selectedSerials);

    return availableSerials.filter((serial) => {
      const serialNumber =
        serial.serialNumber || "";

      const matchesSearch =
        serialNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const isAvailable =
        !currentlySelected.includes(
          serialNumber
        ) ||
        selectedSerials[srNumber] ===
          serialNumber;

      return matchesSearch && isAvailable;
    });
  };

  // --------------------------------------------------
  // Save selected serial numbers
  // --------------------------------------------------
  const handleSave = () => {
    const missingSerials = srNumbers.filter(
      (srNum) => !selectedSerials[srNum]
    );

    if (missingSerials.length > 0) {
      setError(
        `Please select serial numbers for all items (SR ${missingSerials.join(
          ", "
        )})`
      );
      return;
    }

    const serialsArray = Object.entries(
      selectedSerials
    )
      .sort(
        ([a], [b]) =>
          parseInt(a, 10) -
          parseInt(b, 10)
      )
      .map(
        ([, serialNumber]) => serialNumber
      );

    if (
      onSerialNumbersUpdate &&
      product?._id
    ) {
      onSerialNumbersUpdate(
        product._id,
        serialsArray
      );
    }

    onClose();
  };

  if (usageQty <= 0 || !visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Serial Numbers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {product?.productTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ========================================= */}
        {/* Body */}
        {/* ========================================= */}
        <div className="overflow-y-auto px-6 py-5">
          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2
                size={32}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm">
                Loading available serial numbers...
              </p>
            </div>
          ) : availableSerials.length === 0 ? (
            /* No serials */
            <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-4 text-center text-sm text-yellow-800">
              No serial numbers available for
              this product.
            </div>
          ) : (
            /* Serial table */
            <div className="overflow-visible rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="w-[15%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                    >
                      SR.
                    </th>

                    <th
                      className="w-[85%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                    >
                      Serial Number
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {srNumbers.map((srNumber) => {
                    const selectedSerial =
                      selectedSerials[
                        srNumber
                      ];

                    const filteredOptions =
                      getFilteredOptions(
                        srNumber
                      );

                    const showDropdown =
                      showDropdowns[
                        srNumber
                      ];

                    return (
                      <tr
                        key={srNumber}
                        className="hover:bg-gray-50"
                      >
                        {/* SR Number */}
                        <td className="px-4 py-4 align-top">
                          <span className="font-semibold text-gray-800">
                            {srNumber}
                          </span>
                        </td>

                        {/* Serial Selection */}
                        <td className="px-4 py-4">
                          <div className="relative">
                            {selectedSerial ? (
                              /* Selected serial */
                              <div className="flex items-center gap-2">
                                <div className="flex-1 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                                  <span className="font-medium text-green-800">
                                    {selectedSerial}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteSerial(
                                      srNumber
                                    )
                                  }
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-500 text-white transition hover:bg-red-600"
                                  title="Remove serial"
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                {/* Search input */}
                                <div className="relative">
                                  <Search
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  />

                                  <input
                                    type="text"
                                    value={
                                      searchTerms[
                                        srNumber
                                      ] || ""
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      handleSearchChange(
                                        srNumber,
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    onFocus={() =>
                                      handleSearchFocus(
                                        srNumber
                                      )
                                    }
                                    onBlur={() =>
                                      handleSearchBlur(
                                        srNumber
                                      )
                                    }
                                    placeholder="Search serial number"
                                    className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>

                                {/* Dropdown */}
                                {showDropdown && (
                                  <div className="absolute left-0 right-0 top-full z-[1100] mt-1 max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="border-b bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                                      Select Serial
                                      Number
                                    </div>

                                    {filteredOptions.length >
                                    0 ? (
                                      filteredOptions.map(
                                        (serial) => (
                                          <button
                                            type="button"
                                            key={
                                              serial.serialNumber
                                            }
                                            onMouseDown={(
                                              e
                                            ) =>
                                              e.preventDefault()
                                            }
                                            onClick={() =>
                                              handleSerialSelect(
                                                srNumber,
                                                serial.serialNumber
                                              )
                                            }
                                            className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition last:border-b-0 hover:bg-gray-50"
                                          >
                                            {
                                              serial.serialNumber
                                            }
                                          </button>
                                        )
                                      )
                                    ) : (
                                      <div className="px-3 py-3 text-center text-sm text-gray-500">
                                        No serial
                                        numbers
                                        found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* Footer */}
        {/* ========================================= */}
        <div className="flex items-center justify-end gap-2 border-t bg-gray-50 px-6 py-4">
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
              loading ||
              Object.keys(selectedSerials)
                .length !== usageQty
            }
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

UnderRepairedSerial.propTypes = {
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
};

UnderRepairedSerial.defaultProps = {
  product: {
    _id: "",
    productTitle: "",
  },

  usageQty: 0,
};

export default UnderRepairedSerial;