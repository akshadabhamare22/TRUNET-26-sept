import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Check, Search, Trash2, X } from "lucide-react";
import axiosInstance from "../../axiosInstance";
const StockSerialNumber = ({
  visible,
  onClose,
  product = {
    product: {
      _id: "",
      productTitle: "",
    },
  },
  approvedQty = 0,
  onSerialNumbersUpdate,
  warehouseId = "",
}) => {
  const approvedQtyNumber = Number(approvedQty) || 0;

  const [availableSerials, setAvailableSerials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [showDropdowns, setShowDropdowns] = useState({});

  const srNumbers = Array.from(
    { length: approvedQtyNumber },
    (_, i) => i + 1
  );

  useEffect(() => {
    if (visible && product?.product?._id && warehouseId) {
      console.log("Modal initialized with:", {
        productId: product.product._id,
        approvedQty: approvedQtyNumber,
        productApprovedSerials: product.approvedSerials,
      });

      const prevSerials = {};

      if (product.approvedSerials?.length > 0) {
        product.approvedSerials.forEach((sn, index) => {
          if (index < approvedQtyNumber) {
            prevSerials[index + 1] = sn;
          }
        });
      }

      console.log("Initial selectedSerials:", prevSerials);
      setSelectedSerials(prevSerials);

      fetchAvailableSerials();
    }
  }, [visible, product, warehouseId, approvedQtyNumber]);

  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setError(null);
    }
  }, [visible]);

  const fetchAvailableSerials = async () => {
    try {
      setLoading(true);

      const productId = product.product._id;

      if (!warehouseId) {
        throw new Error("Warehouse/Outlet ID is required");
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await axiosInstance.get(
        `/stockrequest/serial-numbers/product/${productId}`
      );

      if (response.data.success) {
        setAvailableSerials(
          response.data.data.availableSerials || []
        );
      } else {
        throw new Error(
          response.data.message || "Failed to fetch serial numbers"
        );
      }
    } catch (err) {
      console.error("Error fetching serial numbers:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch serial numbers"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSerialSelect = (srNumber, serialNumber) => {
    console.log("Selected serial:", srNumber, serialNumber);

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

  const handleDeleteSerial = (srNumber) => {
    console.log("Deleted serial at SR:", srNumber);

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

  const handleSearchChange = (srNumber, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: value,
    }));
  };

  const handleSearchFocus = (srNumber) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [srNumber]: true,
    }));
  };

  const handleSearchBlur = (srNumber) => {
    setTimeout(() => {
      setShowDropdowns((prev) => ({
        ...prev,
        [srNumber]: false,
      }));
    }, 200);
  };

  const getFilteredOptions = (srNumber) => {
    const searchTerm = searchTerms[srNumber] || "";
    const currentlySelected = Object.values(selectedSerials);

    return availableSerials.filter((serial) => {
      const serialValue = String(serial.serialNumber || "");

      const matchesSearch = serialValue
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isAvailable =
        !currentlySelected.includes(serialValue) ||
        selectedSerials[srNumber] === serialValue;

      return matchesSearch && isAvailable;
    });
  };

  const handleSave = () => {
    console.log("Save clicked. Current state:", {
      selectedSerials,
      selectedCount: Object.keys(selectedSerials).length,
      approvedQtyNumber,
      srNumbers,
    });

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

    const serialsArray = Object.entries(selectedSerials)
      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
      .map(([srNumber, serialNumber]) => ({
        srNumber: parseInt(srNumber, 10),
        serialNumber,
      }));

    console.log("Saving serials array:", serialsArray);

    if (onSerialNumbersUpdate && product?.product?._id) {
      onSerialNumbersUpdate(product.product._id, serialsArray);
    } else {
      console.error("Missing callback or product ID");
    }

    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-serial-number-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2
            id="stock-serial-number-title"
            className="text-lg font-semibold text-gray-800"
          >
            Serial Number for{" "}
            {product?.product?.productTitle || "Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5">
          {error && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError(null)}
                className="rounded p-1 hover:bg-red-100"
                aria-label="Close error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-600">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <span className="mt-3">
                Loading available serial numbers...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[650px] border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <th className="w-[15%] border-b border-gray-200 px-4 py-3">
                      SR.
                    </th>
                    <th className="border-b border-gray-200 px-4 py-3">
                      New Serial No.
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {srNumbers.map((srNumber) => {
                    const selectedSerial =
                      selectedSerials[srNumber];

                    const filteredOptions =
                      getFilteredOptions(srNumber);

                    const showDropdown =
                      showDropdowns[srNumber];

                    return (
                      <tr
                        key={srNumber}
                        className="border-b border-gray-100"
                      >
                        <td className="px-4 py-4 align-top font-semibold text-gray-800">
                          {srNumber}
                        </td>

                        <td className="px-4 py-4">
                          <div className="relative">
                            {selectedSerial ? (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-800">
                                  {selectedSerial}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteSerial(
                                      srNumber
                                    )
                                  }
                                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-700"
                                  aria-label={`Delete serial ${selectedSerial}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="relative">
                                  <Search
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  />

                                  <input
                                    type="text"
                                    value={
                                      searchTerms[srNumber] ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleSearchChange(
                                        srNumber,
                                        e.target.value
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
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                  />
                                </div>

                                {showDropdown && (
                                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[220px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                                      Select Serial Number
                                    </div>

                                    <div>
                                      {filteredOptions.length >
                                      0 ? (
                                        filteredOptions.map(
                                          (serial) => (
                                            <button
                                              type="button"
                                              key={
                                                serial.serialNumber
                                              }
                                              onMouseDown={(e) =>
                                                e.preventDefault()
                                              }
                                              onClick={() =>
                                                handleSerialSelect(
                                                  srNumber,
                                                  serial.serialNumber
                                                )
                                              }
                                              className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                            >
                                              {
                                                serial.serialNumber
                                              }
                                            </button>
                                          )
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
                    );
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
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              Object.keys(selectedSerials).length !==
              approvedQtyNumber
            }
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

StockSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    product: PropTypes.shape({
      _id: PropTypes.string,
      productTitle: PropTypes.string,
    }),
    approvedSerials: PropTypes.arrayOf(PropTypes.string),
  }),
  approvedQty: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onSerialNumbersUpdate: PropTypes.func.isRequired,
  warehouseId: PropTypes.string,
};

export default StockSerialNumber;
