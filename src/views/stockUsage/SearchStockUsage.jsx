// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { RotateCcw, Search, X } from "lucide-react";

// const SearchStockUsage = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
// }) => {
//   const [searchData, setSearchData] = useState({
//     keyword: "",
//     center: "",
//     usageType: "",
//   });

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         keyword: "",
//         center: "",
//         usageType: "",
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
//       usageType: "",
//     };

//     setSearchData(resetData);
//     onSearch(resetData);
//   };

//   if (!visible) return null;

//   const centerOptions = centers.map((center) => ({
//     value: center._id,
//     label: center.centerName,
//   }));

//   const selectedCenter =
//     searchData.center
//       ? centerOptions.find(
//           (center) => center.value === searchData.center
//         ) || null
//       : null;

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "42px",
//       borderRadius: "6px",
//       borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 1px #2563eb"
//         : "none",
//       "&:hover": {
//         borderColor: "#2563eb",
//       },
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
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
//           {/* Row 1 */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Branch */}
//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Branch
//               </label>

//               <Select
//                 id="center"
//                 name="center"
//                 placeholder="Select Branch..."
//                 value={selectedCenter}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected ? selected.value : "",
//                   }))
//                 }
//                 options={centerOptions}
//                 isClearable
//                 styles={selectStyles}
//                 classNamePrefix="react-select"
//               />
//             </div>

//             {/* Usage Type */}
//             <div>
//               <label
//                 htmlFor="usageType"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Usage Type{" "}
//                 <span className="text-red-500">*</span>
//               </label>

//               <select
//                 id="usageType"
//                 name="usageType"
//                 value={searchData.usageType}
//                 onChange={handleChange}
//                 className="h-[42px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">SELECT</option>
//                 <option value="Customer">Customer</option>
//                 <option value="Building">Building</option>
//                 <option value="Building to Building">
//                   Building to Building
//                 </option>
//                 <option value="Control Room">Control Room</option>
//                 <option value="Damage">Damage</option>
//                 <option value="Stolen from Center">
//                   Stolen from Center
//                 </option>
//                 <option value="Stolen from Field">
//                   Stolen from Field
//                 </option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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
//                 placeholder="Enter keyword..."
//                 className="h-[42px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             <div />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Reset
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

// SearchStockUsage.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
// };

// export default SearchStockUsage;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { RotateCcw, Search, X } from "lucide-react";

const SearchStockUsage = ({
  visible,
  onClose,
  onSearch,
  centers,
}) => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    center: "",
    usageType: "",
  });

  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        center: "",
        usageType: "",
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
      usageType: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) return null;

  const centerOptions = centers.map((center) => ({
    value: center._id,
    label: center.centerName,
  }));

  const selectedCenter = searchData.center
    ? centerOptions.find(
        (center) => center.value === searchData.center
      ) || null
    : null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      height: "42px",
      borderRadius: "0px",
      borderColor: state.isFocused ? "#2759A2" : "#d9dde3",
      boxShadow: state.isFocused
        ? "0 0 0 1px #2759A2"
        : "none",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      "&:hover": {
        borderColor: "#2759A2",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#8a9199",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#343a40",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#d9dde3",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#343a40",
      paddingRight: "10px",
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#777",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      marginTop: "2px",
      borderRadius: "0px",
      border: "1px solid #d9dde3",
      boxShadow: "0 8px 20px rgba(0,0,0,0.14)",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 999999,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      padding: "10px 12px",
      color: "#343a40",
      backgroundColor: state.isSelected
        ? "#2759A2"
        : state.isFocused
          ? "#eef4fb"
          : "#ffffff",
      cursor: "pointer",
    }),
  };

  return (
    <>
      <style>{`
        @keyframes searchStockUsageDrop {
          0% {
            opacity: 0;
            transform: translateY(-110%);
          }
          60% {
            opacity: 1;
            transform: translateY(10px);
          }
          80% {
            transform: translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes searchStockUsageOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .search-stock-usage-overlay {
          animation: searchStockUsageOverlay 220ms ease-out both;
        }

        .search-stock-usage-panel {
          animation: searchStockUsageDrop 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .search-stock-usage-overlay,
          .search-stock-usage-panel {
            animation: none;
          }
        }
      `}</style>

      <div
        className="search-stock-usage-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-stock-usage-title"
      >
        <div className="search-stock-usage-panel mt-8 flex max-h-[calc(100vh-64px)] w-[calc(100%-32px)] max-w-[800px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:w-[800px]">
          {/* Header */}
          <div className="flex min-h-[67px] items-center justify-between border-b border-[#e2e5e9] px-4 py-3.5">
            <h2
              id="search-stock-usage-title"
              className="text-[23px] font-normal leading-none text-[#343a40]"
            >
              Search
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded p-1.5 text-[#777] transition hover:bg-gray-100 hover:text-[#333]"
              aria-label="Close"
            >
              <X size={24} strokeWidth={1.8} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-4 py-5">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              {/* Branch */}
              <div>
                <label
                  htmlFor="center"
                  className="mb-1.5 block text-[16px] font-semibold text-[#343a40]"
                >
                  Branch
                </label>

                <Select
                  id="center"
                  name="center"
                  placeholder="Select Branch..."
                  value={selectedCenter}
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      center: selected ? selected.value : "",
                    }))
                  }
                  options={centerOptions}
                  isClearable
                  styles={selectStyles}
                  classNamePrefix="react-select"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>

              {/* Usage Type */}
              <div>
                <label
                  htmlFor="usageType"
                  className="mb-1.5 block text-[16px] font-semibold text-[#343a40]"
                >
                  Usage Type{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="usageType"
                  name="usageType"
                  value={searchData.usageType}
                  onChange={handleChange}
                  className="h-[42px] w-full rounded-none border border-[#d9dde3] bg-white px-3 text-sm text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]/20"
                >
                  <option value="">SELECT</option>
                  <option value="Customer">Customer</option>
                  <option value="Building">Building</option>
                  <option value="Building to Building">
                    Building to Building
                  </option>
                  <option value="Control Room">Control Room</option>
                  <option value="Damage">Damage</option>
                  <option value="Stolen from Center">
                    Stolen from Center
                  </option>
                  <option value="Stolen from Field">
                    Stolen from Field
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Keyword */}
              <div>
                <label
                  htmlFor="keyword"
                  className="mb-1.5 block text-[16px] font-semibold text-[#343a40]"
                >
                  Keyword
                </label>

                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={searchData.keyword}
                  onChange={handleChange}
                  placeholder="Enter keyword..."
                  className="h-[42px] w-full rounded-none border border-[#d9dde3] bg-white px-3 text-sm text-[#343a40] outline-none transition placeholder:text-[#8a9199] focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]/20"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#e2e5e9] bg-white px-4 py-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/20"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/20"
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

SearchStockUsage.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
};

export default SearchStockUsage;
