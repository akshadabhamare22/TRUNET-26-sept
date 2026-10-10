// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { RotateCcw, Search, X } from "lucide-react";
// import DatePicker from "../../utils/DatePicker";

// const SearchTransferModel = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
//   outlets,
// }) => {
//   const [searchData, setSearchData] = useState({
//     center: "",
//     outlet: "",
//     statusChanged: "Any Status",
//     transferNo: "",
//     currentStatus: "Any Status",
//     startDate: "",
//     endDate: "",
//     statusStartDate: "",
//     statusEndDate: "",
//   });

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         center: "",
//         outlet: "",
//         statusChanged: "Any Status",
//         transferNo: "",
//         currentStatus: "Any Status",
//         startDate: "",
//         endDate: "",
//         statusStartDate: "",
//         statusEndDate: "",
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

//   const handleDateChange = (dateValue) => {
//     if (dateValue && dateValue.includes(" to ")) {
//       const [startDate, endDate] = dateValue.split(" to ");

//       const formatDateForAPI = (dateStr) => {
//         const [day, month, year] = dateStr.split("-");
//         return `${year}-${month}-${day}`;
//       };

//       setSearchData((prev) => ({
//         ...prev,
//         startDate: formatDateForAPI(startDate),
//         endDate: formatDateForAPI(endDate),
//       }));
//     } else {
//       setSearchData((prev) => ({
//         ...prev,
//         startDate: "",
//         endDate: "",
//       }));
//     }
//   };

//   const handleSearch = () => {
//     const apiSearchData = {
//       keyword: searchData.transferNo,
//       center: searchData.center,
//       outlet: searchData.outlet,
//       status:
//         searchData.currentStatus !== "Any Status"
//           ? searchData.currentStatus
//           : "",
//       statusChanged:
//         searchData.statusChanged !== "Any Status"
//           ? searchData.statusChanged
//           : "",
//     };

//     if (searchData.startDate && searchData.endDate) {
//       apiSearchData.startDate = searchData.startDate;
//       apiSearchData.endDate = searchData.endDate;
//     }

//     if (searchData.statusStartDate && searchData.statusEndDate) {
//       apiSearchData.statusStartDate = searchData.statusStartDate;
//       apiSearchData.statusEndDate = searchData.statusEndDate;
//     }

//     console.log("Search Data:", apiSearchData);

//     onSearch(apiSearchData);
//     onClose();
//   };

//   const handleReset = () => {
//     const resetData = {
//       center: "",
//       outlet: "",
//       statusChanged: "Any Status",
//       transferNo: "",
//       currentStatus: "Any Status",
//       startDate: "",
//       endDate: "",
//       statusStartDate: "",
//       statusEndDate: "",
//     };

//     setSearchData(resetData);
//   };

//   const getDatePickerValue = () => {
//     if (searchData.startDate && searchData.endDate) {
//       return `${searchData.startDate
//         .split("-")
//         .reverse()
//         .join("-")} to ${searchData.endDate
//         .split("-")
//         .reverse()
//         .join("-")}`;
//     }

//     return "";
//   };

//   if (!visible) {
//     return null;
//   }

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "40px",
//       borderRadius: "0.375rem",
//       borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
//       boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.15)" : "none",
//       "&:hover": {
//         borderColor: "#9ca3af",
//       },
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="search-transfer-title"
//     >
//       <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <h2
//             id="search-transfer-title"
//             className="text-lg font-semibold text-gray-800"
//           >
//             Search Stock Transfers
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
//         <div className="overflow-y-auto px-5 py-5">
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Branch */}
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                 Branch
//               </label>

//               <Select
//                 id="center"
//                 name="center"
//                 placeholder="Select Branch..."
//                 value={
//                   searchData.center
//                     ? {
//                         value: searchData.center,
//                         label:
//                           centers.find(
//                             (c) => c._id === searchData.center
//                           )?.centerName || "",
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected ? selected.value : "",
//                   }))
//                 }
//                 options={centers.map((center) => ({
//                   value: center._id,
//                   label: center.centerName,
//                 }))}
//                 isClearable
//                 styles={selectStyles}
//                 className="w-full"
//               />
//             </div>

//             {/* Kept empty because the original Outlet field was commented out */}
//             <div />
//           </div>

//           {/* Status change section */}
//           <div className="mt-6">
//             <h3 className="mb-4 text-sm font-semibold text-gray-800">
//               Date Filter based on status change
//             </h3>

//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               <div>
//                 <label
//                   htmlFor="statusChanged"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Status Changed
//                 </label>

//                 <select
//                   id="statusChanged"
//                   name="currentStatus"
//                   value={searchData.currentStatus}
//                   onChange={handleChange}
//                   className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 >
//                   <option value="Any Status">Any Status</option>
//                   <option value="Submitted">Submitted</option>
//                   <option value="Confirmed">Confirmed</option>
//                   <option value="Shipped">Shipped</option>
//                   <option value="Completed">Completed</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                   Date
//                 </label>

//                 <DatePicker
//                   value={getDatePickerValue()}
//                   onChange={handleDateChange}
//                   placeholder="Date"
//                   className="w-full"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Transfer number + current status */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <label
//                 htmlFor="transferNo"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Indent No.
//               </label>

//               <input
//                 type="text"
//                 id="transferNo"
//                 name="transferNo"
//                 value={searchData.transferNo}
//                 onChange={handleChange}
//                 placeholder="Indent Number"
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="currentStatus"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Current Status
//               </label>

//               <select
//                 id="currentStatus"
//                 name="currentStatus"
//                 value={searchData.currentStatus}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               >
//                 <option value="Any Status">Any Status</option>
//                 <option value="Submitted">Submitted</option>
//                 <option value="Confirmed">Confirmed</option>
//                 <option value="Admin_Approved">Admin Approved</option>
//                 <option value="Shipped">Shipped</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Rejected">Rejected</option>
//                 <option value="Admin_Rejected">Admin Rejected</option>
//                 <option value="Incompleted">Incompleted</option>
//                 <option value="Draft">Draft</option>
//               </select>
//             </div>
//           </div>

//           {/* Indent date */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                 Indent Date
//               </label>

//               <DatePicker
//                 value={getDatePickerValue()}
//                 onChange={handleDateChange}
//                 placeholder="Indent Date"
//                 className="w-full"
//               />
//             </div>

//             <div />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SearchTransferModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   outlets: PropTypes.array.isRequired,
// };

// export default SearchTransferModel;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { RotateCcw, Search, X } from "lucide-react";
import DatePicker from "../../utils/DatePicker";

const SearchTransferModel = ({
  visible,
  onClose,
  onSearch,
  centers,
  outlets,
}) => {
  const [searchData, setSearchData] = useState({
    center: "",
    outlet: "",
    statusChanged: "Any Status",
    transferNo: "",
    currentStatus: "Any Status",
    startDate: "",
    endDate: "",
    statusStartDate: "",
    statusEndDate: "",
  });

  useEffect(() => {
    if (!visible) {
      setSearchData({
        center: "",
        outlet: "",
        statusChanged: "Any Status",
        transferNo: "",
        currentStatus: "Any Status",
        startDate: "",
        endDate: "",
        statusStartDate: "",
        statusEndDate: "",
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

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(" to ")) {
      const [startDate, endDate] = dateValue.split(" to ");

      const formatDateForAPI = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
      };

      setSearchData((prev) => ({
        ...prev,
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
      }));
    }
  };

  const handleSearch = () => {
    const apiSearchData = {
      keyword: searchData.transferNo,
      center: searchData.center,
      outlet: searchData.outlet,
      status:
        searchData.currentStatus !== "Any Status"
          ? searchData.currentStatus
          : "",
      statusChanged:
        searchData.statusChanged !== "Any Status"
          ? searchData.statusChanged
          : "",
    };

    if (searchData.startDate && searchData.endDate) {
      apiSearchData.startDate = searchData.startDate;
      apiSearchData.endDate = searchData.endDate;
    }

    if (searchData.statusStartDate && searchData.statusEndDate) {
      apiSearchData.statusStartDate = searchData.statusStartDate;
      apiSearchData.statusEndDate = searchData.statusEndDate;
    }

    console.log("Search Data:", apiSearchData);

    onSearch(apiSearchData);
    onClose();
  };

  const handleReset = () => {
    const resetData = {
      center: "",
      outlet: "",
      statusChanged: "Any Status",
      transferNo: "",
      currentStatus: "Any Status",
      startDate: "",
      endDate: "",
      statusStartDate: "",
      statusEndDate: "",
    };

    setSearchData(resetData);
  };

  const getDatePickerValue = () => {
    if (searchData.startDate && searchData.endDate) {
      return `${searchData.startDate
        .split("-")
        .reverse()
        .join("-")} to ${searchData.endDate
        .split("-")
        .reverse()
        .join("-")}`;
    }

    return "";
  };

  if (!visible) {
    return null;
  }

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "0.375rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.15)" : "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div
      className="transfer-search-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-6 pt-8 sm:pt-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-transfer-title"
    >
      <style>{`
        @keyframes transferSearchDrop {
          from { opacity: 0; transform: translateY(-48px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes transferSearchBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .transfer-search-overlay {
          animation: transferSearchBackdrop 180ms ease-out both;
        }
        .transfer-search-modal {
          animation: transferSearchDrop 300ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
          border-top: 4px solid #2759a2;
        }
        .transfer-search-modal input,
        .transfer-search-modal select {
          min-height: 41px;
          border-radius: 3px;
          border-color: #d1d5db;
          color: #374151;
        }
        .transfer-search-modal input:focus,
        .transfer-search-modal select:focus {
          border-color: #2759a2;
          box-shadow: 0 0 0 1px rgba(39, 89, 162, 0.15);
          outline: none;
        }
        .transfer-search-modal button:focus-visible {
          outline: 2px solid #2759a2;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .transfer-search-overlay,
          .transfer-search-modal {
            animation: none;
          }
        }
      `}</style>
      <div className="transfer-search-modal flex max-h-[90vh] w-full max-w-[860px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex min-h-[79px] items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2
            id="search-transfer-title"
            className="text-[20px] font-normal text-[#343a40]"
          >
            Search Stock Transfers
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
        <div className="min-h-0 overflow-y-auto px-[22px] py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Branch */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Branch
              </label>

              <Select
                id="center"
                name="center"
                placeholder="Select Branch..."
                value={
                  searchData.center
                    ? {
                        value: searchData.center,
                        label:
                          centers.find(
                            (c) => c._id === searchData.center
                          )?.centerName || "",
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected ? selected.value : "",
                  }))
                }
                options={centers.map((center) => ({
                  value: center._id,
                  label: center.centerName,
                }))}
                isClearable
                styles={selectStyles}
                className="w-full"
              />
            </div>

            {/* Kept empty because the original Outlet field was commented out */}
            <div />
          </div>

          {/* Status change section */}
          <div className="mt-6">
            <h3 className="mb-3 text-[20px] font-normal text-[#343a40]">
              Date Filter based on status change
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="statusChanged"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Status Changed
                </label>

                <select
                  id="statusChanged"
                  name="currentStatus"
                  value={searchData.currentStatus}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Any Status">Any Status</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Date
                </label>

                <DatePicker
                  value={getDatePickerValue()}
                  onChange={handleDateChange}
                  placeholder="Date"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Transfer number + current status */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="transferNo"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Indent No.
              </label>

              <input
                type="text"
                id="transferNo"
                name="transferNo"
                value={searchData.transferNo}
                onChange={handleChange}
                placeholder="Indent Number"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="currentStatus"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Current Status
              </label>

              <select
                id="currentStatus"
                name="currentStatus"
                value={searchData.currentStatus}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Any Status">Any Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Admin_Approved">Admin Approved</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
                <option value="Admin_Rejected">Admin Rejected</option>
                <option value="Incompleted">Incompleted</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Indent date */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Indent Date
              </label>

              <DatePicker
                value={getDatePickerValue()}
                onChange={handleDateChange}
                placeholder="Indent Date"
                className="w-full"
              />
            </div>

            <div />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-white px-[22px] py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[41px] items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex min-h-[41px] items-center justify-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#214b88]"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

SearchTransferModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  outlets: PropTypes.array.isRequired,
};

export default SearchTransferModel;
