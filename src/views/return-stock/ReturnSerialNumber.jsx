// import React, {
//   useEffect,
//   useState,
// } from 'react';
// import {
//   Check,
//   LoaderCircle,
//   X,
// } from 'lucide-react';
// import PropTypes from 'prop-types';

// import axiosInstance from '../../axiosInstance';

// const ReturnSerialNumber = ({
//   visible,
//   onClose,
//   product,
//   quantity,
//   onSerialNumbersUpdate,
// }) => {
//   const [availableSerials, setAvailableSerials] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState(null);

//   const [selectedSerials, setSelectedSerials] =
//     useState({});

//   const [searchTerms, setSearchTerms] =
//     useState({});

//   const [showDropdowns, setShowDropdowns] =
//     useState({});

//   const [initialized, setInitialized] =
//     useState(false);

//   const srNumbers = Array.from(
//     { length: quantity },
//     (_, index) => index + 1
//   );

//   /* =========================================================
//      INITIAL LOAD
//   ========================================================= */

//   useEffect(() => {
//     if (
//       visible &&
//       product?._id &&
//       quantity > 0 &&
//       initialized === false
//     ) {
//       fetchAvailableSerials();
//       initializeSelectedSerials();
//       setInitialized(true);
//     }
//   }, [
//     visible,
//     product,
//     quantity,
//     initialized,
//   ]);

//   /* =========================================================
//      RESET WHEN MODAL CLOSES
//   ========================================================= */

//   useEffect(() => {
//     if (!visible) {
//       setSelectedSerials({});
//       setSearchTerms({});
//       setShowDropdowns({});
//       setError(null);
//       setInitialized(false);
//     }
//   }, [visible]);

//   /* =========================================================
//      FETCH AVAILABLE SERIALS
//   ========================================================= */

//   const fetchAvailableSerials = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       if (!product?._id) {
//         throw new Error(
//           'Product ID is required'
//         );
//       }

//       const response =
//         await axiosInstance.get(
//           `/stockrequest/serial-numbers/product/${product._id}`
//         );

//       if (response.data.success) {
//         const serials =
//           response.data.data
//             ?.availableSerials || [];

//         setAvailableSerials(
//           serials.map(
//             (item) =>
//               item.serialNumber ||
//               item
//           )
//         );
//       } else {
//         throw new Error(
//           response.data.message ||
//             'Failed to fetch serial numbers'
//         );
//       }
//     } catch (err) {
//       console.error(
//         'Error fetching serial numbers:',
//         err
//       );

//       setError(
//         err.response?.data
//           ?.message ||
//           err.message ||
//           'Failed to fetch serial numbers'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================================================
//      INITIALIZE SELECTED SERIALS
//   ========================================================= */

//   const initializeSelectedSerials =
//     () => {
//       const existingSerials =
//         onSerialNumbersUpdate &&
//         product?._id
//           ? onSerialNumbersUpdate(
//               product._id
//             )
//           : null;

//       const initialSelected = {};

//       if (
//         existingSerials &&
//         Array.isArray(
//           existingSerials
//         ) &&
//         existingSerials.length ===
//           quantity
//       ) {
//         srNumbers.forEach(
//           (srNum, index) => {
//             initialSelected[
//               srNum
//             ] =
//               existingSerials[
//                 index
//               ] || '';
//           }
//         );
//       } else {
//         srNumbers.forEach(
//           (srNum) => {
//             initialSelected[
//               srNum
//             ] = '';
//           }
//         );
//       }

//       setSelectedSerials(
//         initialSelected
//       );

//       const initialSearchTerms =
//         {};

//       srNumbers.forEach(
//         (srNum) => {
//           initialSearchTerms[
//             srNum
//           ] = '';
//         }
//       );

//       setSearchTerms(
//         initialSearchTerms
//       );
//     };

//   /* =========================================================
//      SELECT SERIAL
//   ========================================================= */

//   const handleSerialSelect = (
//     srNumber,
//     serialNumber
//   ) => {
//     setSelectedSerials(
//       (prev) => ({
//         ...prev,
//         [srNumber]:
//           serialNumber,
//       })
//     );

//     setSearchTerms(
//       (prev) => ({
//         ...prev,
//         [srNumber]: '',
//       })
//     );

//     setShowDropdowns(
//       (prev) => ({
//         ...prev,
//         [srNumber]: false,
//       })
//     );

//     setError(null);
//   };

//   /* =========================================================
//      DELETE SERIAL
//   ========================================================= */

//   const handleDeleteSerial = (
//     srNumber
//   ) => {
//     setSelectedSerials(
//       (prev) => ({
//         ...prev,
//         [srNumber]: '',
//       })
//     );

//     setSearchTerms(
//       (prev) => ({
//         ...prev,
//         [srNumber]: '',
//       })
//     );
//   };

//   /* =========================================================
//      SEARCH CHANGE
//   ========================================================= */

//   const handleSearchChange = (
//     srNumber,
//     value
//   ) => {
//     setSearchTerms(
//       (prev) => ({
//         ...prev,
//         [srNumber]: value,
//       })
//     );
//   };

//   /* =========================================================
//      FOCUS
//   ========================================================= */

//   const handleSearchFocus = (
//     srNumber
//   ) => {
//     setShowDropdowns(
//       (prev) => ({
//         ...prev,
//         [srNumber]: true,
//       })
//     );
//   };

//   /* =========================================================
//      BLUR
//   ========================================================= */

//   const handleSearchBlur = (
//     srNumber
//   ) => {
//     setTimeout(() => {
//       setShowDropdowns(
//         (prev) => ({
//           ...prev,
//           [srNumber]: false,
//         })
//       );
//     }, 200);
//   };

//   /* =========================================================
//      FILTER SERIAL OPTIONS
//   ========================================================= */

//   const getFilteredOptions = (
//     srNumber
//   ) => {
//     const searchTerm =
//       searchTerms[srNumber] ||
//       '';

//     const currentlySelected =
//       Object.values(
//         selectedSerials
//       ).filter(
//         (serial) => serial !== ''
//       );

//     return availableSerials.filter(
//       (serial) => {
//         const matchesSearch =
//           serial
//             .toLowerCase()
//             .includes(
//               searchTerm.toLowerCase()
//             );

//         const isAvailable =
//           !currentlySelected.includes(
//             serial
//           ) ||
//           selectedSerials[
//             srNumber
//           ] === serial;

//         return (
//           matchesSearch &&
//           isAvailable
//         );
//       }
//     );
//   };

//   /* =========================================================
//      SAVE
//   ========================================================= */

//   const handleSave = () => {
//     const missingSerials =
//       srNumbers.filter(
//         (srNum) =>
//           !selectedSerials[
//             srNum
//           ]
//       );

//     if (
//       missingSerials.length > 0
//     ) {
//       setError(
//         `Please select serial numbers for all items (SR ${missingSerials.join(
//           ', '
//         )})`
//       );

//       return;
//     }

//     const serialsArray =
//       srNumbers.map(
//         (srNum) =>
//           selectedSerials[
//             srNum
//           ]
//       );

//     if (
//       onSerialNumbersUpdate &&
//       product?._id
//     ) {
//       onSerialNumbersUpdate(
//         product._id,
//         serialsArray
//       );
//     }

//     onClose();
//   };

//   const allSerialsSelected =
//     srNumbers.every(
//       (srNum) =>
//         selectedSerials[
//           srNum
//         ]
//     );

//   /* =========================================================
//      MODAL
//   ========================================================= */

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//       <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
//         {/* =================================================
//             HEADER
//         ================================================== */}

//         <div className="flex items-center justify-between border-b px-5 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Serial Numbers for{' '}
//             {product?.productTitle}
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* =================================================
//             BODY
//         ================================================== */}

//         <div className="overflow-y-auto px-5 py-5">
//           {/* ERROR */}

//           {error && (
//             <div className="mb-4 flex items-start justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//               <span>{error}</span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setError(null)
//                 }
//                 className="ml-3 rounded p-0.5 hover:bg-red-100"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}

//           {/* LOADING */}

//           {loading ? (
//             <div className="flex min-h-[220px] flex-col items-center justify-center text-gray-600">
//               <LoaderCircle
//                 size={34}
//                 className="animate-spin text-blue-600"
//               />

//               <p className="mt-3 text-sm">
//                 Loading available serial
//                 numbers...
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg border border-gray-200">
//               <table className="w-full min-w-[650px] border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-gray-100 text-left">
//                     <th className="w-[15%] border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                       SR.
//                     </th>

//                     <th className="w-[85%] border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                       Serial Number
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {srNumbers.map(
//                     (srNumber) => {
//                       const selectedSerial =
//                         selectedSerials[
//                           srNumber
//                         ];

//                       const filteredOptions =
//                         getFilteredOptions(
//                           srNumber
//                         );

//                       const showDropdown =
//                         showDropdowns[
//                           srNumber
//                         ];

//                       return (
//                         <tr
//                           key={
//                             srNumber
//                           }
//                           className="border-b border-gray-100"
//                         >
//                           {/* SR */}

//                           <td className="px-4 py-3 align-top">
//                             <strong className="text-gray-800">
//                               {srNumber}
//                             </strong>
//                           </td>

//                           {/* SERIAL */}

//                           <td className="px-4 py-3">
//                             <div className="relative">
//                               {selectedSerial ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
//                                     <strong className="break-all text-gray-800">
//                                       {
//                                         selectedSerial
//                                       }
//                                     </strong>
//                                   </div>

//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       handleDeleteSerial(
//                                         srNumber
//                                       )
//                                     }
//                                     className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700"
//                                     title="Remove serial"
//                                   >
//                                     <X
//                                       size={
//                                         17
//                                       }
//                                     />
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div className="relative">
//                                   {/* SEARCH INPUT */}

//                                   <input
//                                     type="text"
//                                     value={
//                                       searchTerms[
//                                         srNumber
//                                       ] ||
//                                       ''
//                                     }
//                                     onChange={(
//                                       e
//                                     ) =>
//                                       handleSearchChange(
//                                         srNumber,
//                                         e
//                                           .target
//                                           .value
//                                       )
//                                     }
//                                     onFocus={() =>
//                                       handleSearchFocus(
//                                         srNumber
//                                       )
//                                     }
//                                     onBlur={() =>
//                                       handleSearchBlur(
//                                         srNumber
//                                       )
//                                     }
//                                     placeholder="Search or select serial number"
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                   />

//                                   {/* DROPDOWN */}

//                                   {showDropdown && (
//                                     <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[240px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
//                                       {/* HEADER */}

//                                       <div className="border-b bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
//                                         Available
//                                         Serial
//                                         Numbers (
//                                         {
//                                           filteredOptions.length
//                                         }
//                                         )
//                                       </div>

//                                       {/* OPTIONS */}

//                                       <div className="max-h-[190px] overflow-y-auto">
//                                         {filteredOptions.length >
//                                         0 ? (
//                                           filteredOptions.map(
//                                             (
//                                               serial,
//                                               index
//                                             ) => (
//                                               <button
//                                                 type="button"
//                                                 key={`${serial}-${index}`}
//                                                 onMouseDown={(
//                                                   e
//                                                 ) =>
//                                                   e.preventDefault()
//                                                 }
//                                                 onClick={() =>
//                                                   handleSerialSelect(
//                                                     srNumber,
//                                                     serial
//                                                   )
//                                                 }
//                                                 className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
//                                               >
//                                                 <span className="break-all">
//                                                   {
//                                                     serial
//                                                   }
//                                                 </span>
//                                               </button>
//                                             )
//                                           )
//                                         ) : (
//                                           <div className="px-3 py-3 text-center text-sm text-gray-500">
//                                             {searchTerms[
//                                               srNumber
//                                             ]
//                                               ? 'No matching serial numbers found'
//                                               : 'No serial numbers available'}
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     }
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* =================================================
//             FOOTER
//         ================================================== */}

//         <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={
//               loading ||
//               !allSerialsSelected
//             }
//             className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <Check size={16} />
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// ReturnSerialNumber.propTypes = {
//   visible:
//     PropTypes.bool.isRequired,

//   onClose:
//     PropTypes.func.isRequired,

//   product:
//     PropTypes.shape({
//       _id: PropTypes.string,
//       productTitle:
//         PropTypes.string,
//     }),

//   quantity:
//     PropTypes.number.isRequired,

//   onSerialNumbersUpdate:
//     PropTypes.func.isRequired,
// };

// ReturnSerialNumber.defaultProps = {
//   product: null,
// };

// export default ReturnSerialNumber;

import React, {
  useEffect,
  useState,
} from 'react';
import {
  Check,
  LoaderCircle,
  X,
} from 'lucide-react';
import PropTypes from 'prop-types';

import axiosInstance from '../../axiosInstance';

const ReturnSerialNumber = ({
  visible,
  onClose,
  product,
  quantity,
  onSerialNumbersUpdate,
}) => {
  const [availableSerials, setAvailableSerials] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [selectedSerials, setSelectedSerials] =
    useState({});

  const [searchTerms, setSearchTerms] =
    useState({});

  const [showDropdowns, setShowDropdowns] =
    useState({});

  const [initialized, setInitialized] =
    useState(false);

  const srNumbers = Array.from(
    { length: quantity },
    (_, index) => index + 1
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    if (
      visible &&
      product?._id &&
      quantity > 0 &&
      initialized === false
    ) {
      fetchAvailableSerials();
      initializeSelectedSerials();
      setInitialized(true);
    }
  }, [
    visible,
    product,
    quantity,
    initialized,
  ]);

  /* =========================================================
     RESET WHEN MODAL CLOSES
  ========================================================= */

  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setError(null);
      setInitialized(false);
    }
  }, [visible]);

  /* =========================================================
     FETCH AVAILABLE SERIALS
  ========================================================= */

  const fetchAvailableSerials = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!product?._id) {
        throw new Error(
          'Product ID is required'
        );
      }

      const response =
        await axiosInstance.get(
          `/stockrequest/serial-numbers/product/${product._id}`
        );

      if (response.data.success) {
        const serials =
          response.data.data
            ?.availableSerials || [];

        setAvailableSerials(
          serials.map(
            (item) =>
              item.serialNumber ||
              item
          )
        );
      } else {
        throw new Error(
          response.data.message ||
            'Failed to fetch serial numbers'
        );
      }
    } catch (err) {
      console.error(
        'Error fetching serial numbers:',
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          'Failed to fetch serial numbers'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIALIZE SELECTED SERIALS
  ========================================================= */

  const initializeSelectedSerials =
    () => {
      const existingSerials =
        onSerialNumbersUpdate &&
        product?._id
          ? onSerialNumbersUpdate(
              product._id
            )
          : null;

      const initialSelected = {};

      if (
        existingSerials &&
        Array.isArray(
          existingSerials
        ) &&
        existingSerials.length ===
          quantity
      ) {
        srNumbers.forEach(
          (srNum, index) => {
            initialSelected[
              srNum
            ] =
              existingSerials[
                index
              ] || '';
          }
        );
      } else {
        srNumbers.forEach(
          (srNum) => {
            initialSelected[
              srNum
            ] = '';
          }
        );
      }

      setSelectedSerials(
        initialSelected
      );

      const initialSearchTerms =
        {};

      srNumbers.forEach(
        (srNum) => {
          initialSearchTerms[
            srNum
          ] = '';
        }
      );

      setSearchTerms(
        initialSearchTerms
      );
    };

  /* =========================================================
     SELECT SERIAL
  ========================================================= */

  const handleSerialSelect = (
    srNumber,
    serialNumber
  ) => {
    setSelectedSerials(
      (prev) => ({
        ...prev,
        [srNumber]:
          serialNumber,
      })
    );

    setSearchTerms(
      (prev) => ({
        ...prev,
        [srNumber]: '',
      })
    );

    setShowDropdowns(
      (prev) => ({
        ...prev,
        [srNumber]: false,
      })
    );

    setError(null);
  };

  /* =========================================================
     DELETE SERIAL
  ========================================================= */

  const handleDeleteSerial = (
    srNumber
  ) => {
    setSelectedSerials(
      (prev) => ({
        ...prev,
        [srNumber]: '',
      })
    );

    setSearchTerms(
      (prev) => ({
        ...prev,
        [srNumber]: '',
      })
    );
  };

  /* =========================================================
     SEARCH CHANGE
  ========================================================= */

  const handleSearchChange = (
    srNumber,
    value
  ) => {
    setSearchTerms(
      (prev) => ({
        ...prev,
        [srNumber]: value,
      })
    );
  };

  /* =========================================================
     FOCUS
  ========================================================= */

  const handleSearchFocus = (
    srNumber
  ) => {
    setShowDropdowns(
      (prev) => ({
        ...prev,
        [srNumber]: true,
      })
    );
  };

  /* =========================================================
     BLUR
  ========================================================= */

  const handleSearchBlur = (
    srNumber
  ) => {
    setTimeout(() => {
      setShowDropdowns(
        (prev) => ({
          ...prev,
          [srNumber]: false,
        })
      );
    }, 200);
  };

  /* =========================================================
     FILTER SERIAL OPTIONS
  ========================================================= */

  const getFilteredOptions = (
    srNumber
  ) => {
    const searchTerm =
      searchTerms[srNumber] ||
      '';

    const currentlySelected =
      Object.values(
        selectedSerials
      ).filter(
        (serial) => serial !== ''
      );

    return availableSerials.filter(
      (serial) => {
        const matchesSearch =
          serial
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const isAvailable =
          !currentlySelected.includes(
            serial
          ) ||
          selectedSerials[
            srNumber
          ] === serial;

        return (
          matchesSearch &&
          isAvailable
        );
      }
    );
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = () => {
    const missingSerials =
      srNumbers.filter(
        (srNum) =>
          !selectedSerials[
            srNum
          ]
      );

    if (
      missingSerials.length > 0
    ) {
      setError(
        `Please select serial numbers for all items (SR ${missingSerials.join(
          ', '
        )})`
      );

      return;
    }

    const serialsArray =
      srNumbers.map(
        (srNum) =>
          selectedSerials[
            srNum
          ]
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

  const allSerialsSelected =
    srNumbers.every(
      (srNum) =>
        selectedSerials[
          srNum
        ]
    );

  /* =========================================================
     MODAL
  ========================================================= */

  if (!visible) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes returnSerialOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes returnSerialDropDown {
          from { opacity: 0; transform: translateY(-70px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .return-serial-overlay {
          animation: returnSerialOverlayFade 180ms ease-out both;
        }
        .return-serial-modal {
     
          animation: returnSerialDropDown 320ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
          transform-origin: top center;
        }
        @media (prefers-reduced-motion: reduce) {
          .return-serial-overlay, .return-serial-modal { animation: none; }
        }
      `}</style>
      <div className="return-serial-overlay fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:pt-8">
      <div className="return-serial-modal flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Serial Numbers for{' '}
            {product?.productTitle}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================== */}

        <div className="overflow-y-auto px-5 py-5">
          {/* ERROR */}

          {error && (
            <div className="mb-4 flex items-start justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  setError(null)
                }
                className="ml-3 rounded p-0.5 hover:bg-red-100"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-gray-600">
              <LoaderCircle
                size={34}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm">
                Loading available serial
                numbers...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[650px] border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="w-[15%] border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
                      SR.
                    </th>

                    <th className="w-[85%] border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
                      Serial Number
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

                      return (
                        <tr
                          key={
                            srNumber
                          }
                          className="border-b border-gray-100"
                        >
                          {/* SR */}

                          <td className="px-4 py-3 align-top">
                            <strong className="text-gray-800">
                              {srNumber}
                            </strong>
                          </td>

                          {/* SERIAL */}

                          <td className="px-4 py-3">
                            <div className="relative">
                              {selectedSerial ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                    <strong className="break-all text-gray-800">
                                      {
                                        selectedSerial
                                      }
                                    </strong>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteSerial(
                                        srNumber
                                      )
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700"
                                    title="Remove serial"
                                  >
                                    <X
                                      size={
                                        17
                                      }
                                    />
                                  </button>
                                </div>
                              ) : (
                                <div className="relative">
                                  {/* SEARCH INPUT */}

                                  <input
                                    type="text"
                                    value={
                                      searchTerms[
                                        srNumber
                                      ] ||
                                      ''
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
                                    placeholder="Search or select serial number"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                  />

                                  {/* DROPDOWN */}

                                  {showDropdown && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[240px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                      {/* HEADER */}

                                      <div className="border-b bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                                        Available
                                        Serial
                                        Numbers (
                                        {
                                          filteredOptions.length
                                        }
                                        )
                                      </div>

                                      {/* OPTIONS */}

                                      <div className="max-h-[190px] overflow-y-auto">
                                        {filteredOptions.length >
                                        0 ? (
                                          filteredOptions.map(
                                            (
                                              serial,
                                              index
                                            ) => (
                                              <button
                                                type="button"
                                                key={`${serial}-${index}`}
                                                onMouseDown={(
                                                  e
                                                ) =>
                                                  e.preventDefault()
                                                }
                                                onClick={() =>
                                                  handleSerialSelect(
                                                    srNumber,
                                                    serial
                                                  )
                                                }
                                                className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                              >
                                                <span className="break-all">
                                                  {
                                                    serial
                                                  }
                                                </span>
                                              </button>
                                            )
                                          )
                                        ) : (
                                          <div className="px-3 py-3 text-center text-sm text-gray-500">
                                            {searchTerms[
                                              srNumber
                                            ]
                                              ? 'No matching serial numbers found'
                                              : 'No serial numbers available'}
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
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              loading ||
              !allSerialsSelected
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={16} />
            Save Changes
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

ReturnSerialNumber.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  product:
    PropTypes.shape({
      _id: PropTypes.string,
      productTitle:
        PropTypes.string,
    }),

  quantity:
    PropTypes.number.isRequired,

  onSerialNumbersUpdate:
    PropTypes.func.isRequired,
};

ReturnSerialNumber.defaultProps = {
  product: null,
};

export default ReturnSerialNumber;