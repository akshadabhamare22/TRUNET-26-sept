// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { RotateCcw, Search, X } from "lucide-react";

// const SearchShiftingModel = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
// }) => {
//   const [searchData, setSearchData] = useState({
//     keyword: "",
//     center: "",
//   });

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         keyword: "",
//         center: "",
//       });
//     }
//   }, [visible]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSearch = () => {
//     onSearch(searchData);
//     onClose();
//   };

//   const handleReset = () => {
//     const resetData = {
//       keyword: "",
//       center: "",
//     };

//     setSearchData(resetData);
//     onSearch(resetData);
//   };

//   const selectedCenter =
//     centers.find((center) => center._id === searchData.center) || null;

//   const centerOptions = centers.map((center) => ({
//     value: center._id,
//     label: center.centerName,
//   }));

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "40px",
//       borderRadius: "6px",
//       borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
//       boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
//       "&:hover": {
//         borderColor: "#2563eb",
//       },
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-2xl overflow-visible rounded-xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5">
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Keyword */}
//             <div>
//               <label
//                 htmlFor="keyword"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Keyword
//               </label>

//               <input
//                 type="text"
//                 id="keyword"
//                 name="keyword"
//                 value={searchData.keyword}
//                 onChange={handleChange}
//                 className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Branch
//               </label>

//               <Select
//                 inputId="center"
//                 name="center"
//                 placeholder="Select Branch..."
//                 value={
//                   selectedCenter
//                     ? {
//                         value: selectedCenter._id,
//                         label: selectedCenter.centerName,
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected ? selected.value : "",
//                   }))
//                 }
//                 options={centerOptions}
//                 isClearable
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             <RotateCcw size={16} />
//             Close
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SearchShiftingModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
// };

// export default SearchShiftingModel;


import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { RotateCcw, Search, X } from "lucide-react";

const SearchShiftingModel = ({
  visible,
  onClose,
  onSearch,
  centers,
}) => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    center: "",
  });

  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        center: "",
      });
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  const handleReset = () => {
    const resetData = {
      keyword: "",
      center: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  const selectedCenter =
    centers.find((center) => center._id === searchData.center) ||
    null;

  const centerOptions = centers.map((center) => ({
    value: center._id,
    label: center.centerName,
  }));

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "4px",
      borderColor: state.isFocused ? "#2759A2" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px #2759A2"
        : "none",
      fontSize: "14px",
      "&:hover": {
        borderColor: "#2759A2",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "2px 10px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 10000,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#858585",
    }),
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes shiftingModalDrop {
          0% {
            opacity: 0;
            transform: translateY(-45px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shiftingOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .shifting-modal-drop {
          animation: shiftingModalDrop 0.35s ease-out both;
        }

        .shifting-modal-overlay {
          animation: shiftingOverlayFade 0.2s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .shifting-modal-drop,
          .shifting-modal-overlay {
            animation: none;
          }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="shifting-modal-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-6 pt-8 sm:pt-12"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shifting-search-title"
          className="shifting-modal-drop relative w-full max-w-3xl overflow-visible rounded-lg border-t-4 border-[#2759A2] bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2
              id="shifting-search-title"
              className="text-xl font-medium text-[#343a40]"
            >
              Search
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close search modal"
              className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2759A2]"
            >
              <X size={23} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Keyword */}
              <div>
                <label
                  htmlFor="shifting-keyword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Keyword
                </label>

                <input
                  type="text"
                  id="shifting-keyword"
                  name="keyword"
                  value={searchData.keyword}
                  onChange={handleChange}
                  placeholder="Enter keyword..."
                  className="h-10 w-full rounded-sm border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                />
              </div>

              {/* Branch */}
              <div>
                <label
                  htmlFor="shifting-center"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Branch
                </label>

                <Select
                  inputId="shifting-center"
                  name="center"
                  placeholder="Select Branch..."
                  value={
                    selectedCenter
                      ? {
                          value: selectedCenter._id,
                          label: selectedCenter.centerName,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      center: selected ? selected.value : "",
                    }))
                  }
                  options={centerOptions}
                  isClearable
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={
                    typeof document !== "undefined"
                      ? document.body
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#6c757d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#5a6268] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#6c757d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#5a6268] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <X size={16} />
              Close
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#2759A2] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e477f] focus:outline-none focus:ring-2 focus:ring-[#2759A2] focus:ring-offset-2"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

SearchShiftingModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
};

export default SearchShiftingModel;

