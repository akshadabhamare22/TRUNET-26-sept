import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Check, LoaderCircle, Search, Trash2, X } from "lucide-react";

import axiosInstance from "../../axiosInstance";
const TestingSerialNumber = ({
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
  const [userCenterId, setUserCenterId] = useState(null);

  const srNumbers = Array.from(
    { length: usageQty },
    (_, index) => index + 1
  );

  useEffect(() => {
    const getUserCenter = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");

        if (
          response.data.success &&
          response.data.data?.user?.center?._id
        ) {
          setUserCenterId(
            response.data.data.user.center._id
          );
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    getUserCenter();
  }, []);

  useEffect(() => {
    if (
      visible &&
      product?._id &&
      usageQty > 0 &&
      userCenterId
    ) {
      fetchAvailableSerials();

      // Preserve original behavior: no serials are preselected.
      setSelectedSerials({});
    }
  }, [visible, product, usageQty, userCenterId]);

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
      setError(null);

      if (!product?._id) {
        throw new Error("Product ID is required");
      }

      if (!userCenterId) {
        throw new Error(
          "User center information not available"
        );
      }

      const response = await axiosInstance.get(
        `/stockpurchase/serial-numbers/product/${userCenterId}/${product._id}`
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

    setError(null);
  };

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

    setError(null);
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
        !currentlySelected.includes(serial.serialNumber) ||
        selectedSerials[srNumber] === serial.serialNumber;

      return matchesSearch && isAvailable;
    });
  };

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

    const serialsArray = Object.entries(selectedSerials)
      .sort(
        ([a], [b]) => parseInt(a, 10) - parseInt(b, 10)
      )
      .map(([, serialNumber]) => serialNumber);

    if (onSerialNumbersUpdate && product?._id) {
      onSerialNumbersUpdate(product._id, serialsArray);
    }

    onClose();
  };

  if (!visible || usageQty <= 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="testing-serial-number-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2
              id="testing-serial-number-title"
              className="text-lg font-semibold text-gray-800"
            >
              Serial Numbers for{" "}
              <span className="text-blue-600">
                {product?.productTitle}
              </span>
            </h2>

            {userCenterId && (
              <p className="mt-1 text-xs text-gray-500">
                Center: {userCenterId.substring(0, 8)}...
              </p>
            )}
          </div>

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
            <div
              className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
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
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle
                size={34}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm">
                Loading available serial numbers...
              </p>
            </div>
          ) : availableSerials.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4 text-center text-sm text-yellow-800">
              No serial numbers available for this product in
              your outlet.
            </div>
          ) : (
            <>
              <div className="mb-3 text-sm text-gray-500">
                Available serial numbers:{" "}
                <span className="font-semibold text-gray-700">
                  {availableSerials.length}
                </span>
              </div>

              <div className="overflow-visible rounded-lg border border-gray-200">
                <table className="w-full min-w-[650px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
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
                        selectedSerials[srNumber];

                      const filteredOptions =
                        getFilteredOptions(srNumber);

                      const showDropdown =
                        showDropdowns[srNumber];

                      return (
                        <tr
                          key={srNumber}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="px-4 py-3 align-top">
                            <span className="font-semibold text-gray-700">
                              {srNumber}
                            </span>
                          </td>

                          <td className="px-4 py-3 align-top">
                            {selectedSerial ? (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <Check
                                      size={16}
                                      className="text-green-600"
                                    />

                                    <span className="font-medium text-gray-800">
                                      {selectedSerial}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteSerial(srNumber)
                                  }
                                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-700"
                                  title="Remove serial"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="relative">
                                  <Search
                                    size={17}
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
                                    className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>

                                {showDropdown && (
                                  <div className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-52 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl">
                                    <div className="sticky top-0 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                      Select Serial Number
                                    </div>

                                    {filteredOptions.length >
                                    0 ? (
                                      filteredOptions.map(
                                        (serial) => (
                                          <button
                                            key={
                                              serial.serialNumber
                                            }
                                            type="button"
                                            onMouseDown={(e) =>
                                              e.preventDefault()
                                            }
                                            onClick={() =>
                                              handleSerialSelect(
                                                srNumber,
                                                serial.serialNumber
                                              )
                                            }
                                            className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition last:border-b-0 hover:bg-blue-50 hover:text-blue-700"
                                          >
                                            {serial.serialNumber}
                                          </button>
                                        )
                                      )
                                    ) : (
                                      <div className="px-3 py-4 text-center text-sm text-gray-500">
                                        No serial numbers
                                        found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              Object.keys(selectedSerials).length !== usageQty
            }
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

TestingSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    productTitle: PropTypes.string,
    trackSerialNumber: PropTypes.string,
  }),
  usageQty: PropTypes.number.isRequired,
  onSerialNumbersUpdate: PropTypes.func.isRequired,
};

TestingSerialNumber.defaultProps = {
  product: {
    _id: "",
    productTitle: "",
  },
  usageQty: 0,
};

export default TestingSerialNumber;
