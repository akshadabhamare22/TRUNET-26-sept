import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Check,
  Info,
  Search,
  Trash2,
  X,
} from "lucide-react";
import axiosInstance from "../../axiosInstance";
const SerialNumbers = ({
  visible,
  onClose,
  product,
  approvedQty,
  onSerialNumbersUpdate,
  warehouseId,
  resellerId,
  resellerName,
  data,
}) => {
  const [availableSerials, setAvailableSerials] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedSerials, setSelectedSerials] =
    useState({});

  const [searchTerms, setSearchTerms] =
    useState({});

  const [showDropdowns, setShowDropdowns] =
    useState({});

  const [sourceFilter, setSourceFilter] =
    useState("all");

  const srNumbers = Array.from(
    { length: approvedQty },
    (_, i) => i + 1
  );

  /* -------------------------------------------------------
     Initialize selected serial numbers + fetch available
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      visible &&
      product?.product?._id &&
      warehouseId
    ) {
      const prevSerials = {};

      if (
        product.approvedSerials?.length > 0
      ) {
        product.approvedSerials
          .slice(0, approvedQty)
          .forEach((sn, index) => {
            prevSerials[index + 1] = sn;
          });
      }

      setSelectedSerials(prevSerials);
      fetchAvailableSerials();
    }
  }, [
    visible,
    product,
    warehouseId,
    approvedQty,
    resellerId,
  ]);

  /* -------------------------------------------------------
     Remove serials beyond approved quantity
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      Object.keys(selectedSerials).length >
      approvedQty
    ) {
      const cleanedSerials = {};

      Object.entries(selectedSerials).forEach(
        ([srNumber, serial]) => {
          if (
            parseInt(srNumber, 10) <=
            approvedQty
          ) {
            cleanedSerials[srNumber] =
              serial;
          }
        }
      );

      setSelectedSerials(cleanedSerials);
    }
  }, [approvedQty]);

  /* -------------------------------------------------------
     Reset modal state on close
  ------------------------------------------------------- */

  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setError(null);
      setSourceFilter("all");
    }
  }, [visible]);

  /* -------------------------------------------------------
     Fetch Available Serial Numbers
  ------------------------------------------------------- */

  // const fetchAvailableSerials =
  //   async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       const productId =
  //         product.product._id;

  //       if (!warehouseId) {
  //         throw new Error(
  //           "Warehouse/Outlet ID is required"
  //         );
  //       }

  //       if (!productId) {
  //         throw new Error(
  //           "Product ID is required"
  //         );
  //       }

  //       let url = `/stockpurchase/serial-numbers/product/${warehouseId}/${productId}`;

  //       const params =
  //         new URLSearchParams();

  //       if (resellerId) {
  //         params.append(
  //           "resellerId",
  //           resellerId
  //         );
  //       }

  //       const queryString =
  //         params.toString();

  //       if (queryString) {
  //         url += `?${queryString}`;
  //       }

  //       console.log(
  //         "Fetching serials from:",
  //         url
  //       );

  //       const response =
  //         await axiosInstance.get(url);

  //       if (response.data.success) {
  //         const serials =
  //           response.data.data
  //             .availableSerials || [];

  //         setAvailableSerials(serials);

  //         const resellerCount =
  //           serials.filter(
  //             (serial) =>
  //               serial.source ===
  //               "reseller"
  //           ).length;

  //         const outletCount =
  //           serials.filter(
  //             (serial) =>
  //               serial.source === "outlet"
  //           ).length;

  //         console.log(
  //           `Available: ${resellerCount} from reseller, ${outletCount} from outlet`
  //         );
  //       } else {
  //         throw new Error(
  //           response.data.message ||
  //             "Failed to fetch serial numbers"
  //         );
  //       }
  //     } catch (err) {
  //       console.error(
  //         "Error fetching serial numbers:",
  //         err
  //       );

  //       setError(
  //         err.response?.data?.message ||
  //           err.message ||
  //           "Failed to fetch serial numbers"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };


  const fetchAvailableSerials = async () => {
  try {
    setLoading(true);
    setError(null);

    const productId = product?.product?._id;

    if (!warehouseId) {
      throw new Error("Warehouse/Outlet ID is required");
    }

    if (!productId) {
      throw new Error("Product ID is required");
    }

    let url = `/stockpurchase/serial-numbers/product/${warehouseId}/${productId}`;

    const params = new URLSearchParams();

    if (resellerId) {
      params.append("resellerId", resellerId);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Fetching serials:", url);

    const response = await axiosInstance.get(url);

    console.log("Serial API Response:", response.data);

    // Support both direct array and wrapped API response
    let serials = [];

    if (Array.isArray(response.data)) {
      serials = response.data;
    } else if (Array.isArray(response.data?.data?.availableSerials)) {
      serials = response.data.data.availableSerials;
    } else if (Array.isArray(response.data?.availableSerials)) {
      serials = response.data.availableSerials;
    } else {
      throw new Error(
        response.data?.message || "Invalid serial number response"
      );
    }

    // Keep only available serial numbers
    const normalizedSerials = serials
      .filter((serial) => serial.status === "available")
      .map((serial) => ({
        ...serial,
        source: serial.source || serial.sourceType || "purchase",
      }));

    setAvailableSerials(normalizedSerials);

    console.log("Available serial numbers:", normalizedSerials);

  } catch (err) {
    console.error("Error fetching serial numbers:", err);

    setAvailableSerials([]);

    setError(
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch serial numbers"
    );
  } finally {
    setLoading(false);
  }
};

  /* -------------------------------------------------------
     Select Serial
  ------------------------------------------------------- */

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

    setError(null);
  };

  /* -------------------------------------------------------
     Delete Selected Serial
  ------------------------------------------------------- */

  const handleDeleteSerial = (
    srNumber
  ) => {
    setSelectedSerials((prev) => {
      const newSelected = {
        ...prev,
      };

      delete newSelected[srNumber];

      return newSelected;
    });

    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: "",
    }));
  };

  /* -------------------------------------------------------
     Search
  ------------------------------------------------------- */

  const handleSearchChange = (
    srNumber,
    value
  ) => {
    setSearchTerms((prev) => ({
      ...prev,
      [srNumber]: value,
    }));
  };

  const handleSearchFocus = (
    srNumber
  ) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [srNumber]: true,
    }));
  };

  const handleSearchBlur = (
    srNumber
  ) => {
    setTimeout(() => {
      setShowDropdowns((prev) => ({
        ...prev,
        [srNumber]: false,
      }));
    }, 200);
  };

  /* -------------------------------------------------------
     Filter Serial Options
  ------------------------------------------------------- */

  const getFilteredOptions = (
    srNumber
  ) => {
    const searchTerm =
      searchTerms[srNumber] || "";

    const currentlySelected =
      Object.values(selectedSerials);

    return availableSerials.filter(
      (serial) => {
        const serialNumber =
          serial.serialNumber || "";

        const matchesSearch =
          serialNumber
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const isAvailable =
          !currentlySelected.includes(
            serialNumber
          ) ||
          selectedSerials[srNumber] ===
            serialNumber;

        const matchesSource =
          sourceFilter === "all" ||
          serial.source === sourceFilter;

        return (
          matchesSearch &&
          isAvailable &&
          matchesSource
        );
      }
    );
  };

  /* -------------------------------------------------------
     Source Filter
  ------------------------------------------------------- */

  const handleSourceFilterChange = (
    source
  ) => {
    setSourceFilter(source);
  };

  /* -------------------------------------------------------
     Save
  ------------------------------------------------------- */

  const handleSave = () => {
    const requiredSerials =
      Array.from(
        { length: approvedQty },
        (_, i) => i + 1
      );

    const missingSerials =
      requiredSerials.filter(
        (srNum) =>
          !selectedSerials[srNum]
      );

    if (missingSerials.length > 0) {
      setError(
        `Please select serial numbers for all approved items (SR ${missingSerials.join(
          ", "
        )})`
      );

      return;
    }

    const serialsArray = Object.entries(
      selectedSerials
    )
      .filter(
        ([srNumber]) =>
          parseInt(srNumber, 10) <=
          approvedQty
      )
      .map(
        ([srNumber, serialNumber]) => ({
          srNumber: parseInt(
            srNumber,
            10
          ),
          serialNumber,
        })
      );

    if (onSerialNumbersUpdate) {
      onSerialNumbersUpdate(
        product.product._id,
        serialsArray
      );
    }

    onClose();
  };

  /* -------------------------------------------------------
     Helpers
  ------------------------------------------------------- */

  // const getSourceDisplayName = (
  //   source
  // ) => {
  //   return source === "outlet"
  //     ? "SSV TELECOM"
  //     : "Reseller";
  // };


  const getSourceDisplayName = (source) => {
  switch (source) {
    case "reseller":
      return "Reseller";

    case "outlet":
      return "SSV TELECOM";

    case "purchase":
      return "Purchase";

    default:
      return source || "-";
  }
};
  const getSourceBadgeClasses = (
    source
  ) => {
    return source === "reseller"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";
  };

  const resellerSerials =
    availableSerials.filter(
      (serial) =>
        serial.source === "reseller"
    );

  const outletSerials =
    availableSerials.filter(
      (serial) =>
        serial.source === "outlet"
    );

  const totalSerials =
    availableSerials.length;

  const selectedCount =
    Object.keys(selectedSerials).length;

  const allRequiredSelected =
    selectedCount === approvedQty;

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* -------------------------------------------------
            Header
        ------------------------------------------------- */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Serial Number for{" "}
              {product?.product
                ?.productTitle || ""}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Approved Quantity:{" "}
              <span className="font-semibold text-gray-700">
                {approvedQty}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* -------------------------------------------------
            Body
        ------------------------------------------------- */}
        <div className="overflow-y-auto px-5 py-5">
          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <X
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* Source Filters */}
          {resellerId && (
            <div className="mb-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Filter by source:
                </span>

                <div className="flex flex-wrap overflow-hidden rounded-md border border-gray-300">
                  <button
                    type="button"
                    onClick={() =>
                      handleSourceFilterChange(
                        "all"
                      )
                    }
                    className={`px-3 py-1.5 text-sm font-medium transition ${
                      sourceFilter ===
                      "all"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All ({totalSerials})
                  </button>

                  {resellerSerials.length >
                    0 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSourceFilterChange(
                          "reseller"
                        )
                      }
                      className={`border-l border-gray-300 px-3 py-1.5 text-sm font-medium transition ${
                        sourceFilter ===
                        "reseller"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Reseller (
                      {
                        resellerSerials.length
                      }
                      )
                    </button>
                  )}

                  {outletSerials.length >
                    0 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSourceFilterChange(
                          "outlet"
                        )
                      }
                      className={`border-l border-gray-300 px-3 py-1.5 text-sm font-medium transition ${
                        sourceFilter ===
                        "outlet"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      SSV TELECOM (
                      {
                        outletSerials.length
                      }
                      )
                    </button>
                  )}
                </div>
              </div>

              {/* Source Info */}
              {resellerSerials.length >
                0 && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Info size={14} />

                  <span>
                    Reseller:{" "}
                    <span className="font-medium text-gray-700">
                      {data?.center?.reseller
                        ?.businessName ||
                        resellerName ||
                        "Unknown"}
                    </span>{" "}
                    (
                    {
                      resellerSerials.length
                    }{" "}
                    serials available)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <div className="mt-3 text-sm text-gray-500">
                Loading available serial
                numbers...
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                      style={{
                        width: "10%",
                      }}
                    >
                      SR.
                    </th>

                    <th
                      className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                      style={{
                        width: "70%",
                      }}
                    >
                      New Serial No.
                    </th>

                    <th
                      className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                      style={{
                        width: "20%",
                      }}
                    >
                      Source
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {srNumbers.map(
                    (srNumber) => {
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

                      const selectedSerialInfo =
                        availableSerials.find(
                          (serial) =>
                            serial.serialNumber ===
                            selectedSerial
                        );

                      return (
                        <tr
                          key={srNumber}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                          {/* SR */}
                          <td className="px-4 py-3 align-top">
                            <span className="font-semibold text-gray-800">
                              {srNumber}
                            </span>
                          </td>

                          {/* Serial */}
                          <td className="px-4 py-3 align-top">
                            <div className="relative">
                              {selectedSerial ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                                    <span className="font-semibold text-gray-800">
                                      {
                                        selectedSerial
                                      }
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteSerial(
                                        srNumber
                                      )
                                    }
                                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 transition hover:bg-red-200"
                                    title="Remove serial number"
                                  >
                                    <Trash2
                                      size={
                                        16
                                      }
                                    />
                                  </button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <div className="relative">
                                    <Search
                                      size={
                                        16
                                      }
                                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                      type="text"
                                      value={
                                        searchTerms[
                                          srNumber
                                        ] ||
                                        ""
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
                                      className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                  </div>

                                  {showDropdown && (
                                    <div className="absolute left-0 right-0 top-full z-[100] mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
                                      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                                        Select Serial
                                        Number (
                                        {
                                          filteredOptions.length
                                        }{" "}
                                        available)
                                      </div>

                                      <div className="max-h-52 overflow-y-auto">
                                        {filteredOptions.length >
                                        0 ? (
                                          filteredOptions.map(
                                            (
                                              serial
                                            ) => (
                                              <button
                                                key={
                                                  serial.serialNumber
                                                }
                                                type="button"
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
                                                className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left text-sm transition hover:bg-gray-50"
                                              >
                                                <span className="font-medium text-gray-700">
                                                  {
                                                    serial.serialNumber
                                                  }
                                                </span>

                                                <span
                                                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    serial.source ===
                                                    "reseller"
                                                      ? "bg-blue-100 text-blue-700"
                                                      : "bg-green-100 text-green-700"
                                                  }`}
                                                >
                                                  {serial.source ===
                                                  "reseller"
                                                    ? "R"
                                                    : "SSV"}
                                                </span>
                                              </button>
                                            )
                                          )
                                        ) : (
                                          <div className="px-3 py-4 text-center text-sm text-gray-500">
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
                            </div>
                          </td>

                          {/* Source */}
                          <td className="px-4 py-3 align-top">
                            {selectedSerialInfo ? (
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getSourceBadgeClasses(
                                  selectedSerialInfo.source
                                )}`}
                              >
                                {
                                  getSourceDisplayName(
                                    selectedSerialInfo.source
                                  )
                                }
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                -
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* -------------------------------------------------
            Footer
        ------------------------------------------------- */}
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
            disabled={!allRequiredSelected}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition ${
              allRequiredSelected
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            <Check size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   PropTypes
--------------------------------------------------------- */

SerialNumbers.propTypes = {
  visible: PropTypes.bool.isRequired,

  onClose: PropTypes.func.isRequired,

  product: PropTypes.shape({
    product: PropTypes.shape({
      _id: PropTypes.string,
      productTitle: PropTypes.string,
    }),

    approvedSerials:
      PropTypes.arrayOf(
        PropTypes.string
      ),
  }),

  approvedQty:
    PropTypes.number.isRequired,

  onSerialNumbersUpdate:
    PropTypes.func.isRequired,

  warehouseId:
    PropTypes.string.isRequired,

  resellerId: PropTypes.string,

  resellerName: PropTypes.string,

  data: PropTypes.object,
};

SerialNumbers.defaultProps = {
  product: {
    product: {
      _id: "",
      productTitle: "",
    },
  },

  warehouseId: "",

  resellerId: "",

  resellerName: "",

  data: {},
};

export default SerialNumbers;