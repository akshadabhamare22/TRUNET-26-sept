// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { RotateCcw, Search, X } from "lucide-react";

// const SearchStockPurchase = ({ visible, onClose, onSearch }) => {
//   const [searchData, setSearchData] = useState({
//     keyword: "",
//     startDate: "",
//     endDate: "",
//   });

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         keyword: "",
//         startDate: "",
//         endDate: "",
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

//   // Format date from YYYY-MM-DD to DD-MM-YYYY for API
//   const formatDateToDDMMYYYY = (dateString) => {
//     if (!dateString) return "";

//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//       const [year, month, day] = dateString.split("-");

//       return `${day}-${month}-${year}`;
//     }

//     return dateString;
//   };

//   const handleSearch = () => {
//     if (searchData.startDate && searchData.endDate) {
//       const start = new Date(searchData.startDate);
//       const end = new Date(searchData.endDate);

//       if (start > end) {
//         alert("Start date cannot be after end date");
//         return;
//       }
//     }

//     const apiSearchData = {
//       keyword: searchData.keyword,
//       startDate: formatDateToDDMMYYYY(searchData.startDate),
//       endDate: formatDateToDDMMYYYY(searchData.endDate),
//     };

//     onSearch(apiSearchData);
//     onClose();
//   };

//   const handleReset = () => {
//     const resetData = {
//       keyword: "",
//       startDate: "",
//       endDate: "",
//     };

//     setSearchData(resetData);
//     onSearch(resetData);
//     onClose();
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   if (!visible) return null;

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search Stock Purchase
//           </h2>

//           <button
//             type="button"
//             onClick={handleClose}
//             className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-5 px-6 py-5">
//           {/* Keyword */}
//           <div>
//             <label
//               htmlFor="keyword"
//               className="mb-1.5 block text-sm font-medium text-gray-700"
//             >
//               Keyword
//             </label>

//             <input
//               type="text"
//               id="keyword"
//               name="keyword"
//               value={searchData.keyword}
//               onChange={handleChange}
//               placeholder="Search by invoice no, vendor name, etc."
//               className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           {/* Date Range */}
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             {/* Start Date */}
//             <div>
//               <label
//                 htmlFor="startDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Start Date
//               </label>

//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={searchData.startDate}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//               <p className="mt-1 text-xs text-gray-500">Optional</p>
//             </div>

//             {/* End Date */}
//             <div>
//               <label
//                 htmlFor="endDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 End Date
//               </label>

//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={searchData.endDate}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//               <p className="mt-1 text-xs text-gray-500">Optional</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Clear
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

// SearchStockPurchase.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
// };

// export default SearchStockPurchase;


import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RotateCcw, Search, X } from "lucide-react";

const SearchStockPurchase = ({ visible, onClose, onSearch }) => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        startDate: "",
        endDate: "",
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

  // Format date from YYYY-MM-DD to DD-MM-YYYY for API
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");

      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  const handleSearch = () => {
    if (searchData.startDate && searchData.endDate) {
      const start = new Date(searchData.startDate);
      const end = new Date(searchData.endDate);

      if (start > end) {
        alert("Start date cannot be after end date");
        return;
      }
    }

    const apiSearchData = {
      keyword: searchData.keyword,
      startDate: formatDateToDDMMYYYY(searchData.startDate),
      endDate: formatDateToDDMMYYYY(searchData.endDate),
    };

    onSearch(apiSearchData);
    onClose();
  };

  const handleReset = () => {
    const resetData = {
      keyword: "",
      startDate: "",
      endDate: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes searchStockPurchaseDropDown {
          from {
            opacity: 0;
            transform: translateY(-35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-stock-purchase-modal {
          animation: searchStockPurchaseDropDown 220ms ease-out;
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] bg-black/50">
        {/* Top-down modal */}
        <div className="flex w-full justify-center px-4 pt-4 sm:px-6 sm:pt-5">
          <div className="search-stock-purchase-modal w-full max-w-[800px] overflow-hidden rounded-b-[7px] rounded-t-[2px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            {/* Header */}
            <div className="flex h-[68px] items-center justify-between border-b border-[#e5e5e5] bg-white px-[17px]">
              <h2 className="m-0 text-[22px] font-normal leading-none text-[#343a40]">
                Search
              </h2>

              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[4px] text-[#777] transition hover:bg-[#f3f3f3] hover:text-[#333] focus:outline-none"
                aria-label="Close"
              >
                <X size={27} strokeWidth={1.7} />
              </button>
            </div>

            {/* Body */}
            <div className="px-[17px] py-[17px]">
              {/* Keyword */}
              <div>
                <label
                  htmlFor="keyword"
                  className="mb-[8px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  Keyword
                </label>

                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={searchData.keyword}
                  onChange={handleChange}
                  placeholder="Search by invoice no, vendor name, etc."
                  className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[11px] text-[15px] text-[#212529] outline-none transition placeholder:text-[#777] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>

              {/* Date Range */}
              <div className="mt-[22px] grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-2">
                {/* Start Date */}
                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-[8px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                  >
                    Start Date
                  </label>

                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={searchData.startDate}
                    onChange={handleChange}
                    className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[11px] text-[15px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                  />

                  <p className="mt-[4px] text-[14px] leading-5 text-[#777]">
                    Optional
                  </p>
                </div>

                {/* End Date */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="mb-[8px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                  >
                    End Date
                  </label>

                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={searchData.endDate}
                    onChange={handleChange}
                    className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[11px] text-[15px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                  />

                  <p className="mt-[4px] text-[14px] leading-5 text-[#777]">
                    Optional
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-[12px] border-t border-[#e5e5e5] bg-white px-[17px] py-[18px]">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-[42px] items-center gap-2 rounded-[5px] border border-[#6c757d] bg-[#6c757d] px-[15px] text-[16px] font-normal text-white transition hover:bg-[#5c636a] focus:outline-none"
              >
                <RotateCcw size={16} strokeWidth={2} />
                Clear
              </button>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-[42px] items-center gap-2 rounded-[5px] border border-[#2759A2] bg-[#2759A2] px-[17px] text-[16px] font-normal text-white transition hover:bg-[#1f4f91] focus:outline-none"
              >
                <Search size={16} strokeWidth={2} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SearchStockPurchase.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchStockPurchase;
