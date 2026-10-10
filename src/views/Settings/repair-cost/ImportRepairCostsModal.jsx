// import React, { useRef, useState } from "react";
// import PropTypes from "prop-types";
// import {
//   CheckCircle2,
//   CloudDownload,
//   FileUp,
//   X,
// } from "lucide-react";

// import axiosInstance from "../../../axiosInstance";
// const ImportRepairCostsModal = ({
//   visible,
//   onClose,
//   onImportComplete,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] =
//     useState(0);
//   const [importResults, setImportResults] =
//     useState(null);
//   const [previewData, setPreviewData] =
//     useState([]);

//   const fileInputRef = useRef(null);

//   // --------------------------------------------------
//   // File Change
//   // --------------------------------------------------
//   const handleFileChange = (e) => {
//     const selectedFile =
//       e.target.files[0];

//     setFile(selectedFile || null);
//     setError("");
//     setImportResults(null);

//     if (!selectedFile) {
//       setPreviewData([]);
//       return;
//     }

//     const validTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/csv",
//     ];

//     if (
//       !validTypes.includes(
//         selectedFile.type,
//       ) &&
//       !selectedFile.name
//         .toLowerCase()
//         .endsWith(".csv")
//     ) {
//       setError(
//         "Please upload a valid CSV file",
//       );
//       setFile(null);
//       setPreviewData([]);
//       return;
//     }

//     previewCSV(selectedFile);
//   };

//   // --------------------------------------------------
//   // Preview CSV
//   // --------------------------------------------------
//   const previewCSV = (csvFile) => {
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       try {
//         const text = e.target.result;

//         const lines = text.split("\n");

//         const headers = lines[0]
//           .split(",")
//           .map((header) =>
//             header.trim(),
//           );

//         const preview = [];

//         for (
//           let i = 1;
//           i < Math.min(6, lines.length);
//           i++
//         ) {
//           if (!lines[i].trim()) {
//             continue;
//           }

//           const values = lines[i]
//             .split(",")
//             .map((value) =>
//               value
//                 .trim()
//                 .replace(/^"|"$/g, ""),
//             );

//           const row = {};

//           headers.forEach(
//             (header, index) => {
//               row[header] =
//                 values[index] || "";
//             },
//           );

//           preview.push(row);
//         }

//         setPreviewData(preview);
//       } catch (err) {
//         console.error(
//           "Error previewing CSV:",
//           err,
//         );

//         setPreviewData([]);
//       }
//     };

//     reader.readAsText(csvFile);
//   };

//   // --------------------------------------------------
//   // Submit / Import
//   // --------------------------------------------------
//   const handleSubmit = async () => {
//     if (!file) {
//       setError(
//         "Please select a CSV file to upload",
//       );
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setUploadProgress(0);

//     const formData = new FormData();

//     formData.append("file", file);

//     let progressInterval;

//     try {
//       progressInterval = setInterval(
//         () => {
//           setUploadProgress((prev) => {
//             if (prev >= 90) {
//               clearInterval(
//                 progressInterval,
//               );

//               return prev;
//             }

//             return prev + 10;
//           });
//         },
//         200,
//       );

//       const response =
//         await axiosInstance.post(
//           "/repaired-cost/bulk-import",
//           formData,
//           {
//             headers: {
//               "Content-Type":
//                 "multipart/form-data",
//             },

//             onUploadProgress: (
//               progressEvent,
//             ) => {
//               if (progressEvent.total) {
//                 const percentCompleted =
//                   Math.round(
//                     (progressEvent.loaded *
//                       100) /
//                       progressEvent.total,
//                   );

//                 setUploadProgress(
//                   percentCompleted,
//                 );
//               }
//             },
//           },
//         );

//       clearInterval(progressInterval);

//       setUploadProgress(100);

//       if (response.data.success) {
//         setImportResults(
//           response.data,
//         );

//         onImportComplete(
//           response.data,
//         );

//         setTimeout(() => {
//           handleClose();
//         }, 2000);
//       } else {
//         setError(
//           response.data.message ||
//             "Import failed",
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Import error:",
//         err,
//       );

//       if (
//         err.response?.data?.errors
//       ) {
//         const errorList =
//           err.response.data.errors
//             .slice(0, 5)
//             .map(
//               (item) =>
//                 `Row ${item.row}: ${item.errors.join(", ")}`,
//             )
//             .join("\n");

//         setError(
//           `Import failed with errors:\n${errorList}`,
//         );
//       } else if (
//         err.response?.data
//           ?.productNotFound
//       ) {
//         const notFoundList =
//           err.response.data.productNotFound
//             .slice(0, 5)
//             .map(
//               (item) =>
//                 `Row ${item.row}: ${item.message}`,
//             )
//             .join("\n");

//         setError(
//           `Products not found:\n${notFoundList}`,
//         );
//       } else {
//         setError(
//           err.response?.data
//             ?.message ||
//             "Failed to import data",
//         );
//       }
//     } finally {
//       setLoading(false);

//       setTimeout(() => {
//         setUploadProgress(0);
//       }, 2000);
//     }
//   };

//   // --------------------------------------------------
//   // Download Template
//   // --------------------------------------------------
//   const handleDownloadTemplate =
//     async () => {
//       try {
//         const response =
//           await axiosInstance.get(
//             "/repaired-cost/template",
//             {
//               responseType: "blob",
//             },
//           );

//         const url =
//           window.URL.createObjectURL(
//             new Blob([response.data]),
//           );

//         const link =
//           document.createElement("a");

//         link.href = url;

//         link.setAttribute(
//           "download",
//           "repair_costs_template.csv",
//         );

//         document.body.appendChild(link);

//         link.click();

//         link.remove();

//         window.URL.revokeObjectURL(url);
//       } catch (error) {
//         console.error(
//           "Error downloading template:",
//           error,
//         );

//         setError(
//           "Failed to download template",
//         );
//       }
//     };

//   // --------------------------------------------------
//   // Close / Reset
//   // --------------------------------------------------
//   const handleClose = () => {
//     setFile(null);
//     setError("");
//     setImportResults(null);
//     setPreviewData([]);
//     setUploadProgress(0);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     onClose();
//   };

//   if (!visible) {
//     return null;
//   }

//   // Preview headers
//   const previewHeaders =
//     previewData.length > 0
//       ? Object.keys(previewData[0])
//       : [];

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//       <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
//         {/* ========================================== */}
//         {/* Header */}
//         {/* ========================================== */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Import Repair Costs from CSV
//           </h2>

//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={loading}
//             className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* ========================================== */}
//         {/* Body */}
//         {/* ========================================== */}
//         <div className="overflow-y-auto p-5">
//           {importResults ? (
//             /* -------------------------------------- */
//             /* Success Result */
//             /* -------------------------------------- */
//             <div className="overflow-hidden rounded-lg border border-green-200 bg-white">
//               {/* Success Header */}
//               <div className="flex items-center gap-2 bg-green-600 px-4 py-3 text-sm font-semibold text-white">
//                 <CheckCircle2
//                   size={18}
//                 />

//                 Import Completed
//                 Successfully!
//               </div>

//               <div className="p-4">
//                 <p className="mb-4 text-sm text-gray-700">
//                   {
//                     importResults.message
//                   }
//                 </p>

//                 {/* Summary Table */}
//                 <div className="w-full overflow-x-auto">
//                   <table className="min-w-full border-collapse border border-gray-200 text-sm">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Metric
//                         </th>

//                         <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Count
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       <tr>
//                         <td className="border border-gray-200 px-4 py-3">
//                           Total Processed
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             importResults
//                               .summary
//                               .totalProcessed
//                           }
//                         </td>
//                       </tr>

//                       <tr>
//                         <td className="border border-gray-200 px-4 py-3">
//                           Successful
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3 font-semibold text-green-600">
//                           {
//                             importResults
//                               .summary
//                               .successful
//                           }
//                         </td>
//                       </tr>

//                       <tr>
//                         <td className="border border-gray-200 px-4 py-3">
//                           Failed
//                         </td>

//                         <td
//                           className={`border border-gray-200 px-4 py-3 ${
//                             importResults
//                               .summary
//                               .failed > 0
//                               ? "text-red-600"
//                               : "text-gray-700"
//                           }`}
//                         >
//                           {
//                             importResults
//                               .summary
//                               .failed
//                           }
//                         </td>
//                       </tr>

//                       <tr>
//                         <td className="border border-gray-200 px-4 py-3">
//                           Created
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             importResults
//                               .summary
//                               .created
//                           }
//                         </td>
//                       </tr>

//                       <tr>
//                         <td className="border border-gray-200 px-4 py-3">
//                           Updated
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             importResults
//                               .summary
//                               .updated
//                           }
//                         </td>
//                       </tr>

//                       <tr>
//                         <td className="border border-gray-200 px-4 py-3">
//                           Processing Time
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             importResults
//                               .summary
//                               .processingTime
//                           }
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Errors */}
//                 {importResults.errors &&
//                   importResults.errors
//                     .length > 0 && (
//                     <div className="mt-4">
//                       <h3 className="mb-2 text-sm font-semibold text-gray-800">
//                         Errors (
//                         {
//                           importResults
//                             .errors
//                             .length
//                         }
//                         ):
//                       </h3>

//                       <div className="max-h-[200px] overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3">
//                         {importResults.errors
//                           .slice(0, 10)
//                           .map(
//                             (
//                               item,
//                               index,
//                             ) => (
//                               <div
//                                 key={
//                                   index
//                                 }
//                                 className="mb-1 text-xs text-gray-700 last:mb-0"
//                               >
//                                 Row{" "}
//                                 {
//                                   item.row
//                                 }
//                                 :{" "}
//                                 {item.errors.join(
//                                   ", ",
//                                 )}
//                               </div>
//                             ),
//                           )}

//                         {importResults.errors
//                           .length > 10 && (
//                           <div className="mt-2 text-xs text-gray-500">
//                             ... and{" "}
//                             {importResults
//                               .errors
//                               .length -
//                               10}{" "}
//                             more errors
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* ---------------------------------- */}
//               {/* File Upload */}
//               {/* ---------------------------------- */}
//               <div className="mb-5">
//                 <label
//                   htmlFor="repair-cost-csv"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Upload CSV File:
//                 </label>

//                 <input
//                   id="repair-cost-csv"
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".csv,text/csv"
//                   onChange={
//                     handleFileChange
//                   }
//                   disabled={loading}
//                   className="block w-full rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
//                 />
//               </div>

//               {/* ---------------------------------- */}
//               {/* Preview */}
//               {/* ---------------------------------- */}
//               {previewData.length > 0 && (
//                 <div className="mb-5">
//                   <h3 className="mb-2 text-sm font-semibold text-gray-800">
//                     CSV Preview
//                   </h3>

//                   <div className="w-full overflow-x-auto rounded-md border border-gray-200">
//                     <table className="min-w-full border-collapse text-xs">
//                       <thead>
//                         <tr className="bg-gray-50">
//                           {previewHeaders.map(
//                             (header) => (
//                               <th
//                                 key={header}
//                                 className="whitespace-nowrap border-b border-r border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 last:border-r-0"
//                               >
//                                 {header}
//                               </th>
//                             ),
//                           )}
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {previewData.map(
//                           (
//                             row,
//                             index,
//                           ) => (
//                             <tr
//                               key={
//                                 index
//                               }
//                               className="hover:bg-gray-50"
//                             >
//                               {previewHeaders.map(
//                                 (
//                                   header,
//                                 ) => (
//                                   <td
//                                     key={
//                                       header
//                                     }
//                                     className="whitespace-nowrap border-b border-r border-gray-200 px-3 py-2 text-gray-600 last:border-r-0"
//                                   >
//                                     {
//                                       row[
//                                         header
//                                       ]
//                                     }
//                                   </td>
//                                 ),
//                               )}
//                             </tr>
//                           ),
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               {/* ---------------------------------- */}
//               {/* Upload Progress */}
//               {/* ---------------------------------- */}
//               {uploadProgress > 0 && (
//                 <div className="mb-5">
//                   <div className="mb-1.5 flex items-center justify-between">
//                     <label className="text-sm font-medium text-gray-700">
//                       Upload Progress:
//                     </label>

//                     <span className="text-xs text-gray-600">
//                       {
//                         uploadProgress
//                       }
//                       %
//                     </span>
//                   </div>

//                   <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
//                     <div
//                       className="h-full rounded-full bg-blue-600 transition-all duration-200"
//                       style={{
//                         width: `${uploadProgress}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* ---------------------------------- */}
//               {/* Error */}
//               {/* ---------------------------------- */}
//               {error && (
//                 <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                   {error
//                     .split("\n")
//                     .map(
//                       (
//                         line,
//                         index,
//                       ) => (
//                         <div
//                           key={
//                             index
//                           }
//                         >
//                           {line}
//                         </div>
//                       ),
//                     )}
//                 </div>
//               )}

//               {/* ---------------------------------- */}
//               {/* Template */}
//               {/* ---------------------------------- */}
//               <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//                 <button
//                   type="button"
//                   onClick={
//                     handleDownloadTemplate
//                   }
//                   disabled={loading}
//                   className="inline-flex w-fit items-center gap-2 rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <CloudDownload
//                     size={16}
//                   />
//                   Download Template
//                 </button>

//                 <span className="text-xs text-gray-500">
//                   Download a sample CSV
//                   file with the correct
//                   format
//                 </span>
//               </div>
//             </>
//           )}
//         </div>

//         {/* ========================================== */}
//         {/* Footer */}
//         {/* ========================================== */}
//         <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
//           {!importResults ? (
//             <>
//               {/* Cancel */}
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 disabled={loading}
//                 className="rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               {/* Import */}
//               <button
//                 type="button"
//                 onClick={
//                   handleSubmit
//                 }
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {loading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Importing...
//                   </>
//                 ) : (
//                   <>
//                     <FileUp
//                       size={16}
//                     />
//                     Import CSV
//                   </>
//                 )}
//               </button>
//             </>
//           ) : (
//             <button
//               type="button"
//               onClick={handleClose}
//               className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               Close
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// ImportRepairCostsModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onImportComplete:
//     PropTypes.func.isRequired,
// };

// export default ImportRepairCostsModal;


import React, {
  useRef,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  CheckCircle2,
  CloudDownload,
  FileUp,
  X,
} from "lucide-react";

import axiosInstance from "../../../axiosInstance";

const ImportRepairCostsModal = ({
  visible,
  onClose,
  onImportComplete,
}) => {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [importResults, setImportResults] =
    useState(null);

  const [previewData, setPreviewData] =
    useState([]);

  const fileInputRef =
    useRef(null);

  // --------------------------------------------------
  // File Change
  // --------------------------------------------------
  const handleFileChange = (e) => {
    const selectedFile =
      e.target.files[0];

    setFile(
      selectedFile || null,
    );

    setError("");

    setImportResults(null);

    if (!selectedFile) {
      setPreviewData([]);
      return;
    }

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/csv",
    ];

    if (
      !validTypes.includes(
        selectedFile.type,
      ) &&
      !selectedFile.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      setError(
        "Please upload a valid CSV file",
      );

      setFile(null);
      setPreviewData([]);

      return;
    }

    previewCSV(selectedFile);
  };

  // --------------------------------------------------
  // Preview CSV
  // --------------------------------------------------
  const previewCSV = (csvFile) => {
    const reader =
      new FileReader();

    reader.onload = (e) => {
      try {
        const text =
          e.target.result;

        const lines =
          text.split("\n");

        const headers =
          lines[0]
            .split(",")
            .map((header) =>
              header.trim(),
            );

        const preview = [];

        for (
          let i = 1;
          i <
          Math.min(
            6,
            lines.length,
          );
          i++
        ) {
          if (!lines[i].trim()) {
            continue;
          }

          const values =
            lines[i]
              .split(",")
              .map((value) =>
                value
                  .trim()
                  .replace(
                    /^"|"$/g,
                    "",
                  ),
              );

          const row = {};

          headers.forEach(
            (
              header,
              index,
            ) => {
              row[header] =
                values[index] ||
                "";
            },
          );

          preview.push(row);
        }

        setPreviewData(
          preview,
        );
      } catch (err) {
        console.error(
          "Error previewing CSV:",
          err,
        );

        setPreviewData([]);
      }
    };

    reader.readAsText(csvFile);
  };

  // --------------------------------------------------
  // Submit / Import
  // --------------------------------------------------
  const handleSubmit = async () => {
    if (!file) {
      setError(
        "Please select a CSV file to upload",
      );

      return;
    }

    setLoading(true);
    setError("");
    setUploadProgress(0);

    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    let progressInterval;

    try {
      progressInterval =
        setInterval(() => {
          setUploadProgress(
            (prev) => {
              if (prev >= 90) {
                clearInterval(
                  progressInterval,
                );

                return prev;
              }

              return prev + 10;
            },
          );
        }, 200);

      const response =
        await axiosInstance.post(
          "/repaired-cost/bulk-import",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            onUploadProgress: (
              progressEvent,
            ) => {
              if (
                progressEvent.total
              ) {
                const percentCompleted =
                  Math.round(
                    (progressEvent.loaded *
                      100) /
                      progressEvent.total,
                  );

                setUploadProgress(
                  percentCompleted,
                );
              }
            },
          },
        );

      clearInterval(
        progressInterval,
      );

      setUploadProgress(100);

      if (
        response.data.success
      ) {
        setImportResults(
          response.data,
        );

        onImportComplete(
          response.data,
        );

        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(
          response.data.message ||
            "Import failed",
        );
      }
    } catch (err) {
      console.error(
        "Import error:",
        err,
      );

      if (
        err.response?.data
          ?.errors
      ) {
        const errorList =
          err.response.data.errors
            .slice(0, 5)
            .map(
              (item) =>
                `Row ${item.row}: ${item.errors.join(
                  ", ",
                )}`,
            )
            .join("\n");

        setError(
          `Import failed with errors:\n${errorList}`,
        );
      } else if (
        err.response?.data
          ?.productNotFound
      ) {
        const notFoundList =
          err.response.data.productNotFound
            .slice(0, 5)
            .map(
              (item) =>
                `Row ${item.row}: ${item.message}`,
            )
            .join("\n");

        setError(
          `Products not found:\n${notFoundList}`,
        );
      } else {
        setError(
          err.response?.data
            ?.message ||
            "Failed to import data",
        );
      }
    } finally {
      setLoading(false);

      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  // --------------------------------------------------
  // Download Template
  // --------------------------------------------------
  const handleDownloadTemplate =
    async () => {
      try {
        const response =
          await axiosInstance.get(
            "/repaired-cost/template",
            {
              responseType: "blob",
            },
          );

        const url =
          window.URL.createObjectURL(
            new Blob([
              response.data,
            ]),
          );

        const link =
          document.createElement(
            "a",
          );

        link.href = url;

        link.setAttribute(
          "download",
          "repair_costs_template.csv",
        );

        document.body.appendChild(
          link,
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url,
        );
      } catch (error) {
        console.error(
          "Error downloading template:",
          error,
        );

        setError(
          "Failed to download template",
        );
      }
    };

  // --------------------------------------------------
  // Close / Reset
  // --------------------------------------------------
  const handleClose = () => {
    setFile(null);
    setError("");
    setImportResults(null);
    setPreviewData([]);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }

    onClose();
  };

  // --------------------------------------------------
  // Hide Modal
  // --------------------------------------------------
  if (!visible) {
    return null;
  }

  // --------------------------------------------------
  // Preview Headers
  // --------------------------------------------------
  const previewHeaders =
    previewData.length > 0
      ? Object.keys(
          previewData[0],
        )
      : [];

  return (
    <>
      {/* ==================================================
          MODAL ANIMATION
      ================================================== */}
      <style>
        {`
          @keyframes importBackdropFade {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes importModalDrop {
            0% {
              opacity: 0;
              transform:
                translateY(-55px)
                scale(0.985);
              transform-origin:
                top center;
            }

            55% {
              opacity: 1;
              transform:
                translateY(6px)
                scale(1);
              transform-origin:
                top center;
            }

            75% {
              transform:
                translateY(-2px)
                scale(1);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          .import-modal-backdrop {
            animation:
              importBackdropFade
              0.22s
              ease-out
              forwards;
          }

          .import-modal-content {
            animation:
              importModalDrop
              0.38s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              )
              forwards;
          }
        `}
      </style>

      {/* ==================================================
          BACKDROP
      ================================================== */}
      <div
        className="
          import-modal-backdrop
          fixed
          inset-0
          z-[9999]
          flex
          items-start
          justify-center
          overflow-y-auto
          bg-black/50
          px-4
          pb-8
          pt-[76px]
        "
      >
        {/* ==================================================
            MODAL
        ================================================== */}
        <div
          className="
            import-modal-content
            flex
            max-h-[90vh]
            w-full
            max-w-[800px]
            flex-col
            overflow-hidden
            rounded-[7px]
            bg-white
            shadow-[0_10px_35px_rgba(0,0,0,0.28)]
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}
          <div
            className="
              flex
              h-[68px]
              flex-shrink-0
              items-center
              justify-between
              border-b
              border-[#dee2e6]
              bg-white
              px-[17px]
            "
          >
            <h2
              className="
                m-0
                text-[23px]
                font-normal
                leading-none
                text-[#343a40]
              "
            >
              Import Repair Costs
              from CSV
            </h2>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                flex
                h-[38px]
                w-[38px]
                items-center
                justify-center
                rounded
                text-[#777]
                transition-all
                duration-200
                hover:bg-[#f1f1f1]
                hover:text-[#333]
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              aria-label="Close"
            >
              <X
                size={25}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* ==================================================
              BODY
          ================================================== */}
          <div
            className="
              min-h-0
              overflow-y-auto
              px-[17px]
              pb-[25px]
              pt-[18px]
            "
          >
            {importResults ? (
              <>
                {/* ==========================================
                    SUCCESS RESULT
                ========================================== */}
                <div
                  className="
                    overflow-hidden
                    rounded-[4px]
                    border
                    border-green-200
                    bg-white
                  "
                >
                  {/* Success Header */}
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      bg-[#198754]
                      px-[14px]
                      py-[11px]
                      text-[15px]
                      font-semibold
                      text-white
                    "
                  >
                    <CheckCircle2
                      size={18}
                    />

                    Import Completed
                    Successfully!
                  </div>

                  <div className="p-[15px]">
                    <p
                      className="
                        mb-[16px]
                        text-[15px]
                        text-[#343a40]
                      "
                    >
                      {
                        importResults.message
                      }
                    </p>

                    {/* Summary Table */}
                    <div
                      className="
                        w-full
                        overflow-hidden
                        border
                        border-[#e2e2e2]
                      "
                    >
                      <table
                        className="
                          w-full
                          border-collapse
                          text-[14px]
                        "
                      >
                        <thead>
                          <tr>
                            <th
                              className="
                                border-b
                                border-r
                                border-[#e2e2e2]
                                bg-[#f7f7f7]
                                px-[12px]
                                py-[10px]
                                text-left
                                font-semibold
                                text-[#343a40]
                              "
                            >
                              Metric
                            </th>

                            <th
                              className="
                                border-b
                                border-[#e2e2e2]
                                bg-[#f7f7f7]
                                px-[12px]
                                py-[10px]
                                text-left
                                font-semibold
                                text-[#343a40]
                              "
                            >
                              Count
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td
                              className="
                                border-b
                                border-r
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                                text-[#343a40]
                              "
                            >
                              Total Processed
                            </td>

                            <td
                              className="
                                border-b
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              {
                                importResults
                                  .summary
                                  .totalProcessed
                              }
                            </td>
                          </tr>

                          <tr>
                            <td
                              className="
                                border-b
                                border-r
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              Successful
                            </td>

                            <td
                              className="
                                border-b
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                                font-semibold
                                text-green-600
                              "
                            >
                              {
                                importResults
                                  .summary
                                  .successful
                              }
                            </td>
                          </tr>

                          <tr>
                            <td
                              className="
                                border-b
                                border-r
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              Failed
                            </td>

                            <td
                              className={`
                                border-b
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                                ${
                                  importResults
                                    .summary
                                    .failed >
                                  0
                                    ? "text-red-600"
                                    : "text-[#343a40]"
                                }
                              `}
                            >
                              {
                                importResults
                                  .summary
                                  .failed
                              }
                            </td>
                          </tr>

                          <tr>
                            <td
                              className="
                                border-b
                                border-r
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              Created
                            </td>

                            <td
                              className="
                                border-b
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              {
                                importResults
                                  .summary
                                  .created
                              }
                            </td>
                          </tr>

                          <tr>
                            <td
                              className="
                                border-b
                                border-r
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              Updated
                            </td>

                            <td
                              className="
                                border-b
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              {
                                importResults
                                  .summary
                                  .updated
                              }
                            </td>
                          </tr>

                          <tr>
                            <td
                              className="
                                border-r
                                border-[#e2e2e2]
                                px-[12px]
                                py-[9px]
                              "
                            >
                              Processing Time
                            </td>

                            <td className="px-[12px] py-[9px]">
                              {
                                importResults
                                  .summary
                                  .processingTime
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Errors */}
                    {importResults.errors &&
                      importResults.errors
                        .length >
                        0 && (
                        <div className="mt-[18px]">
                          <h3
                            className="
                              mb-[8px]
                              text-[15px]
                              font-semibold
                              text-[#343a40]
                            "
                          >
                            Errors (
                            {
                              importResults
                                .errors
                                .length
                            }
                            ):
                          </h3>

                          <div
                            className="
                              max-h-[200px]
                              overflow-y-auto
                              rounded-[4px]
                              border
                              border-[#e2e2e2]
                              bg-[#f8f9fa]
                              p-[11px]
                            "
                          >
                            {importResults.errors
                              .slice(
                                0,
                                10,
                              )
                              .map(
                                (
                                  item,
                                  index,
                                ) => (
                                  <div
                                    key={
                                      index
                                    }
                                    className="
                                      mb-[5px]
                                      text-[13px]
                                      text-[#495057]
                                      last:mb-0
                                    "
                                  >
                                    Row{" "}
                                    {
                                      item.row
                                    }
                                    :{" "}
                                    {item.errors.join(
                                      ", ",
                                    )}
                                  </div>
                                ),
                              )}

                            {importResults.errors
                              .length >
                              10 && (
                              <div
                                className="
                                  mt-[8px]
                                  text-[12px]
                                  text-gray-500
                                "
                              >
                                ... and{" "}
                                {importResults
                                  .errors
                                  .length -
                                  10}{" "}
                                more errors
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ==========================================
                    FILE UPLOAD
                ========================================== */}
                <div className="mb-[20px]">
                  <label
                    htmlFor="repair-cost-csv"
                    className="
                      mb-[8px]
                      block
                      text-[16px]
                      font-semibold
                      leading-[20px]
                      text-[#343a40]
                    "
                  >
                    Upload CSV File:
                  </label>

                  <input
                    id="repair-cost-csv"
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={
                      handleFileChange
                    }
                    disabled={loading}
                    className="
                      block
                      h-[41px]
                      w-full
                      rounded-[2px]
                      border
                      border-[#d9d9d9]
                      bg-white
                      text-[14px]
                      text-[#343a40]
                      outline-none
                      file:mr-4
                      file:h-[39px]
                      file:border-0
                      file:bg-[#f1f1f1]
                      file:px-[13px]
                      file:text-[14px]
                      file:font-medium
                      file:text-[#343a40]
                      hover:file:bg-[#e9e9e9]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>

                {/* ==========================================
                    PREVIEW
                ========================================== */}
                {previewData.length >
                  0 && (
                  <div className="mb-[20px]">
                    <h3
                      className="
                        mb-[8px]
                        text-[16px]
                        font-semibold
                        text-[#343a40]
                      "
                    >
                      CSV Preview
                    </h3>

                    <div
                      className="
                        max-h-[230px]
                        w-full
                        overflow-auto
                        rounded-[3px]
                        border
                        border-[#e2e2e2]
                      "
                    >
                      <table
                        className="
                          min-w-full
                          border-collapse
                          text-[13px]
                        "
                      >
                        <thead className="sticky top-0 z-10">
                          <tr>
                            {previewHeaders.map(
                              (
                                header,
                              ) => (
                                <th
                                  key={
                                    header
                                  }
                                  className="
                                    whitespace-nowrap
                                    border-b
                                    border-r
                                    border-[#e2e2e2]
                                    bg-[#f7f7f7]
                                    px-[10px]
                                    py-[9px]
                                    text-left
                                    font-semibold
                                    text-[#343a40]
                                    last:border-r-0
                                  "
                                >
                                  {
                                    header
                                  }
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {previewData.map(
                            (
                              row,
                              index,
                            ) => (
                              <tr
                                key={
                                  index
                                }
                                className="
                                  hover:bg-[#f7f9fb]
                                "
                              >
                                {previewHeaders.map(
                                  (
                                    header,
                                  ) => (
                                    <td
                                      key={
                                        header
                                      }
                                      className="
                                        whitespace-nowrap
                                        border-b
                                        border-r
                                        border-[#eeeeee]
                                        px-[10px]
                                        py-[8px]
                                        text-[#495057]
                                        last:border-r-0
                                      "
                                    >
                                      {
                                        row[
                                          header
                                        ]
                                      }
                                    </td>
                                  ),
                                )}
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ==========================================
                    UPLOAD PROGRESS
                ========================================== */}
                {uploadProgress >
                  0 && (
                  <div className="mb-[20px]">
                    <div
                      className="
                        mb-[6px]
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <label
                        className="
                          text-[15px]
                          font-semibold
                          text-[#343a40]
                        "
                      >
                        Upload Progress:
                      </label>

                      <span
                        className="
                          text-[13px]
                          text-[#6c757d]
                        "
                      >
                        {
                          uploadProgress
                        }
                        %
                      </span>
                    </div>

                    <div
                      className="
                        h-[7px]
                        w-full
                        overflow-hidden
                        rounded-full
                        bg-[#e9ecef]
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-[#2f5fa7]
                          transition-all
                          duration-200
                        "
                        style={{
                          width: `${uploadProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* ==========================================
                    ERROR
                ========================================== */}
                {error && (
                  <div
                    className="
                      mb-[20px]
                      rounded-[4px]
                      border
                      border-red-200
                      bg-red-50
                      px-[13px]
                      py-[11px]
                      text-[14px]
                      text-red-700
                    "
                  >
                    {error
                      .split(
                        "\n",
                      )
                      .map(
                        (
                          line,
                          index,
                        ) => (
                          <div
                            key={
                              index
                            }
                          >
                            {
                              line
                            }
                          </div>
                        ),
                      )}
                  </div>
                )}

                {/* ==========================================
                    TEMPLATE
                ========================================== */}
                <div
                  className="
                    flex
                    flex-col
                    gap-[10px]
                    sm:flex-row
                    sm:items-center
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleDownloadTemplate
                    }
                    disabled={
                      loading
                    }
                    className="
                      inline-flex
                      h-[41px]
                      w-fit
                      items-center
                      gap-[7px]
                      rounded-[6px]
                      bg-[#2f5fa7]
                      px-[15px]
                      text-[15px]
                      font-medium
                      text-white
                      transition
                      hover:bg-[#244c88]
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <CloudDownload
                      size={17}
                    />

                    Download Template
                  </button>

                  <span
                    className="
                      text-[13px]
                      text-[#6c757d]
                    "
                  >
                    Download a
                    sample CSV file
                    with the correct
                    format
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}
          <div
            className="
              flex
              flex-shrink-0
              items-center
              justify-end
              gap-[12px]
              border-t
              border-[#dee2e6]
              bg-white
              px-[17px]
              py-[18px]
            "
          >
            {!importResults ? (
              <>
                {/* Cancel */}
                <button
                  type="button"
                  onClick={
                    handleClose
                  }
                  disabled={
                    loading
                  }
                  className="
                    h-[41px]
                    rounded-[6px]
                    bg-[#6c757d]
                    px-[15px]
                    text-[16px]
                    font-medium
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#5c636a]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                {/* Import CSV */}
                <button
                  type="button"
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    loading
                  }
                  className="
                    inline-flex
                    h-[41px]
                    items-center
                    gap-[7px]
                    rounded-[6px]
                    bg-[#2f5fa7]
                    px-[17px]
                    text-[16px]
                    font-medium
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#244c88]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/40
                          border-t-white
                        "
                      />

                      Importing...
                    </>
                  ) : (
                    <>
                      <FileUp
                        size={17}
                      />

                      Import CSV
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={
                  handleClose
                }
                className="
                  h-[41px]
                  rounded-[6px]
                  bg-[#2f5fa7]
                  px-[17px]
                  text-[16px]
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#244c88]
                  active:scale-[0.98]
                "
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

ImportRepairCostsModal.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onImportComplete:
    PropTypes.func.isRequired,
};

export default ImportRepairCostsModal;