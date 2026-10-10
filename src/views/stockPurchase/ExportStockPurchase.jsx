// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { Download, RotateCcw, X } from "lucide-react";

// const ExportStockPurchase = ({
//   visible,
//   onClose,
//   onExport,
// }) => {
//   const [exportData, setExportData] = useState({
//     startDate: "",
//     endDate: "",
//   });

//   useEffect(() => {
//     if (!visible) {
//       setExportData({
//         startDate: "",
//         endDate: "",
//       });
//     }
//   }, [visible]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setExportData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Format YYYY-MM-DD to DD-MM-YYYY for API
//   const formatDateToDDMMYYYY = (dateString) => {
//     if (!dateString) return "";

//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//       const [year, month, day] =
//         dateString.split("-");

//       return `${day}-${month}-${year}`;
//     }

//     return dateString;
//   };

//   const handleExport = () => {
//     if (
//       exportData.startDate &&
//       exportData.endDate
//     ) {
//       const start = new Date(
//         exportData.startDate
//       );
//       const end = new Date(
//         exportData.endDate
//       );

//       if (start > end) {
//         alert(
//           "Start date cannot be after end date"
//         );
//         return;
//       }
//     }

//     const apiExportData = {
//       startDate: formatDateToDDMMYYYY(
//         exportData.startDate
//       ),
//       endDate: formatDateToDDMMYYYY(
//         exportData.endDate
//       ),
//     };

//     onExport(apiExportData);
//     onClose();
//   };

//   const handleReset = () => {
//     setExportData({
//       startDate: "",
//       endDate: "",
//     });
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Export Stock Purchase Report
//           </h2>

//           <button
//             type="button"
//             onClick={handleClose}
//             className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-6">
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
//                 value={exportData.startDate}
//                 onChange={handleChange}
//                 className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <small className="mt-1 block text-xs text-gray-500">
//                 Optional
//               </small>
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
//                 value={exportData.endDate}
//                 onChange={handleChange}
//                 className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <small className="mt-1 block text-xs text-gray-500">
//                 Optional
//               </small>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleClose}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             <X size={16} />
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleExport}
//             className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Download size={16} />
//             Export
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// ExportStockPurchase.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onExport: PropTypes.func.isRequired,
// };

// export default ExportStockPurchase;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Download, RotateCcw, X } from "lucide-react";

const ExportStockPurchase = ({
  visible,
  onClose,
  onExport,
}) => {
  const [exportData, setExportData] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!visible) {
      setExportData({
        startDate: "",
        endDate: "",
      });
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setExportData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format YYYY-MM-DD to DD-MM-YYYY for API
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] =
        dateString.split("-");

      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  const handleExport = () => {
    if (
      exportData.startDate &&
      exportData.endDate
    ) {
      const start = new Date(
        exportData.startDate
      );
      const end = new Date(
        exportData.endDate
      );

      if (start > end) {
        alert(
          "Start date cannot be after end date"
        );
        return;
      }
    }

    const apiExportData = {
      startDate: formatDateToDDMMYYYY(
        exportData.startDate
      ),
      endDate: formatDateToDDMMYYYY(
        exportData.endDate
      ),
    };

    onExport(apiExportData);
    onClose();
  };

  const handleReset = () => {
    setExportData({
      startDate: "",
      endDate: "",
    });
  };

  const handleClose = () => {
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes exportStockPurchaseDrop {
          0% {
            opacity: 0;
            transform: translateY(-75px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes exportStockPurchaseOverlayFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .export-stock-purchase-overlay {
          animation: exportStockPurchaseOverlayFade 180ms ease-out both;
        }

        .export-stock-purchase-modal {
          animation: exportStockPurchaseDrop 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <div className="export-stock-purchase-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 md:py-8">
        <div className="export-stock-purchase-modal w-full max-w-[858px] overflow-hidden rounded-lg bg-white shadow-2xl">

          {/* Header */}
          <div className="flex h-[68px] items-center justify-between border-b border-[#dee2e6] px-[18px]">
            <h2 className="text-[22px] font-normal leading-none text-[#343a40]">
              Export Stock Purchase Report
            </h2>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#777] transition hover:bg-[#f2f2f2] hover:text-[#333]"
              aria-label="Close"
            >
              <X size={27} strokeWidth={1.8} />
            </button>
          </div>

          {/* Body */}
          <div className="px-[18px] py-[20px]">
            <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2">

              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-[6px] block text-[16px] font-semibold text-[#343a40]"
                >
                  Start Date
                </label>

                <div className="relative">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={exportData.startDate}
                    onChange={handleChange}
                    className="h-[41px] w-full rounded-[6px] border border-[#d8dde3] bg-white px-3 text-[16px] text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                  />
                </div>

                <small className="mt-[3px] block text-[15px] text-[#777]">
                  Optional
                </small>
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-[6px] block text-[16px] font-semibold text-[#343a40]"
                >
                  End Date
                </label>

                <div className="relative">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={exportData.endDate}
                    onChange={handleChange}
                    className="h-[41px] w-full rounded-[6px] border border-[#d8dde3] bg-white px-3 text-[16px] text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                  />
                </div>

                <small className="mt-[3px] block text-[15px] text-[#777]">
                  Optional
                </small>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex min-h-[75px] items-center justify-end gap-2 border-t border-[#dee2e6] px-[18px] py-4">

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-[42px] items-center gap-2 rounded-[6px] bg-[#6c757d] px-[14px] text-[16px] font-medium text-white transition hover:bg-[#5c636a]"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-[42px] items-center gap-2 rounded-[6px] bg-[#6c757d] px-[14px] text-[16px] font-medium text-white transition hover:bg-[#5c636a]"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-[42px] items-center gap-2 rounded-[6px] bg-[#2759A2] px-[15px] text-[16px] font-medium text-white transition hover:bg-[#214d8d]"
            >
              <Download size={17} />
              Export
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ExportStockPurchase.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default ExportStockPurchase;
