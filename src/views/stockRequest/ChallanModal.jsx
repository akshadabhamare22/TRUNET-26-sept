


import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Download, X } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

import { formatDate, formatDateTime } from "../../utils/FormatDateTime";

const ChallanModal = ({ visible, onClose, data }) => {
  const challanRef = useRef();

  if (!visible || !data) return null;

  const companyInfo = {
    name: data.warehouse?.centerName || "SSV TELECOM PVT LTD",
    branch: data.center?.reseller?.businessName || "",
    address: data.center?.centerName || "Anand Nagar",
    area: data.center?.area?.areaName || "Anand Nagar",
    contactPerson:
      data.center?.reseller?.name || "Sameer Kodlikar",
    handoverTo: data.center?.centerName || "Satish",
    contactNo:
      data.center?.reseller?.contactNumber || "",
  };

  const challanInfo = {
    challanNo: data.challanNo || "N/A",
    challanDate: data.challanDate
      ? formatDate(data.challanDate, "dateOnly")
      : "N/A",
    dispatchedFrom:
      data.warehouse?.centerName || "SSV TELECOM PVT LTD",
  };

  const warehouseChallanApprovedAt =
    data.approvalInfo?.warehouseChallanApprovedAt;

  const warehouseChallanApprovedBy =
    data.approvalInfo?.warehouseChallanApprovedBy;

  const hasIncompleteInfo =
    data.incompleteInfo &&
    (data.incompleteInfo.incompleteBy ||
      data.incompleteInfo.incompleteOn);

  const downloadPDF = async () => {
    if (!challanRef.current) return;

    try {
      const canvas = await html2canvas(challanRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save(`challan-${challanInfo.challanNo}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes challanModalDrop {
          from { opacity: 0; transform: translateY(-32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .challan-modal-drop {
          animation: challanModalDrop 280ms ease-out both;
        }
      `}</style>
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-4 sm:py-6">
      <div className="challan-modal-drop flex max-h-[94vh] w-full max-w-[860px] flex-col overflow-hidden rounded-t-lg rounded-b-md bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b-2 border-black bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-700">
              Challan Preview
            </h2>
            <button
              type="button"
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f477f]"
            >
              <Download size={16} />
              Download
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="min-h-0 overflow-y-auto bg-white p-3 sm:p-5">
          <div
            ref={challanRef}
            className="mx-auto w-full border-2 border-black bg-white p-3 text-gray-900 sm:p-4"
          >
            {/* Challan Header */}
            <div className="border-b-2 border-black pb-3 text-center">
              <h1 className="text-xl font-bold uppercase tracking-wide sm:text-[22px]">
                {companyInfo.name}
              </h1>

              {companyInfo.branch && (
                <h2 className="mt-2 text-lg font-semibold">
                  {companyInfo.branch}
                </h2>
              )}
            </div>

            {/* Challan Details */}
            <div className="mt-0 overflow-hidden border border-black">
              <table className="w-full border-collapse text-sm sm:text-base">
                <tbody>
                  <tr>
                    <td className="w-[18%] border-b border-r border-black bg-white px-2 py-2 font-semibold">
                      Branch:
                    </td>

                    <td className="w-[32%] border-b border-r border-black px-2 py-2">
                      {companyInfo.address}
                    </td>

                    <td className="w-[18%] border-b border-r border-black bg-white px-2 py-2 font-semibold">
                      Challan No:
                    </td>

                    <td className="w-[32%] border-b border-black px-2 py-2">
                      {challanInfo.challanNo}
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-r border-black bg-white px-2 py-2" />
                    <td className="border-b border-r border-black px-2 py-2" />

                    <td className="border-b border-r border-black bg-white px-2 py-2 font-semibold">
                      Challan Date:
                    </td>

                    <td className="border-b border-black px-2 py-2">
                      {challanInfo.challanDate}
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-r border-black bg-white px-2 py-2 font-semibold">
                      Area:
                    </td>

                    <td className="border-b border-r border-black px-2 py-2">
                      {companyInfo.area}
                    </td>

                    <td className="border-b border-r border-black bg-white px-2 py-2" />

                    <td className="border-b border-black px-2 py-2" />
                  </tr>

                  <tr>
                    <td className="border-b border-r border-black bg-white px-2 py-2 font-semibold">
                      Contact Person:
                    </td>

                    <td className="border-b border-r border-black px-2 py-2">
                      {companyInfo.contactPerson}
                    </td>

                    <td className="border-b border-r border-black bg-white px-2 py-2 font-semibold">
                      Handover To:
                    </td>

                    <td className="border-b border-black px-2 py-2">
                      Driver/Manager/Zonal
                    </td>
                  </tr>

                  <tr>
                    <td className="border-r border-black bg-white px-2 py-2 font-semibold">
                      Contact No:
                    </td>

                    <td className="border-r border-black px-2 py-2">
                      {companyInfo.contactNo}
                    </td>

                    <td className="border-r border-black bg-white px-2 py-2 font-semibold">
                      Dispatched from:
                    </td>

                    <td className="px-2 py-2">
                      {challanInfo.dispatchedFrom}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Products */}
            <div className="mt-5 overflow-hidden border border-black">
              <table className="w-full border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="bg-[#f4f4f4]">
                    <th className="border-b border-r border-black px-2 py-3 text-left font-bold">
                      Product
                    </th>

                    <th className="w-[18%] border-b border-r border-black px-2 py-3 text-center font-bold">
                      Quantity
                    </th>

                    <th className="w-[35%] border-b border-black px-2 py-3 text-left font-bold">
                      Serial No.
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.products?.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="align-top"
                    >
                      <td className="border-b border-r border-black px-2 py-3">
                        {item.product?.productTitle || "N/A"}
                      </td>

                      <td className="border-b border-r border-black px-2 py-3 text-center">
                        {/* {item.receivedQuantity || 0} Pcs */}
                        {item.approvedQuantity ?? item.quantity ?? 0} Pcs
                      </td>

                      <td className="break-words border-b border-black px-2 py-3">
                        {item.approvedSerials?.length > 0
                          ? item.approvedSerials.join(", ")
                          : item.product?.trackSerialNumber ===
                              "Yes"
                            ? "Serial numbers required"
                            : ""}
                      </td>
                    </tr>
                  ))}

                  {(!data.products ||
                    data.products.length === 0) && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        No products available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div
              className={`mt-14 grid gap-10 ${
                hasIncompleteInfo
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {/* Receiver */}
              <div className="text-center">
                <div className="flex min-h-[56px] flex-col justify-end">
                  {data.completionInfo?.completedBy && (
                    <>
                      <strong className="text-sm">
                        {
                          data.completionInfo.completedBy
                            .fullName
                        }
                      </strong>

                      {data.completionInfo.completedOn && (
                        <span className="mt-1 text-xs text-gray-600">
                          Date:{" "}
                          {formatDateTime(
                            data.completionInfo.completedOn
                          )}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-2 border-t border-black pt-2">
                  <strong className="text-sm">
                    Receivers Name &amp; Signature
                  </strong>
                </div>
              </div>

              {/* Incomplete */}
              {hasIncompleteInfo && (
                <div className="text-center">
                  <div className="flex min-h-[56px] flex-col justify-end">
                    {data.incompleteInfo.incompleteBy && (
                      <strong className="text-sm">
                        {
                          data.incompleteInfo.incompleteBy
                            .fullName
                        }
                      </strong>
                    )}

                    {data.incompleteInfo.incompleteOn && (
                      <span className="mt-1 text-xs text-gray-600">
                        Date:{" "}
                        {formatDateTime(
                          data.incompleteInfo.incompleteOn
                        )}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 border-t border-black pt-2">
                    <strong className="text-sm">
                      Incompleted by
                    </strong>
                  </div>
                </div>
              )}

              {/* Authorised Sign */}
              <div className="text-center">
                <div className="flex min-h-[56px] flex-col justify-end">
                  {warehouseChallanApprovedBy && (
                    <>
                      <strong className="text-sm">
                        {
                          warehouseChallanApprovedBy.fullName
                        }
                      </strong>

                      {warehouseChallanApprovedAt && (
                        <span className="mt-1 text-xs text-gray-600">
                          Date:{" "}
                          {formatDateTime(
                            warehouseChallanApprovedAt
                          )}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-2 border-t border-black pt-2">
                  <strong className="text-sm">
                    Authorised Sign
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

ChallanModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,

  data: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.string,

    warehouse: PropTypes.shape({
      _id: PropTypes.string,
      centerName: PropTypes.string,
      centerCode: PropTypes.string,
      centerType: PropTypes.string,
    }),

    center: PropTypes.shape({
      _id: PropTypes.string,
      centerName: PropTypes.string,
      centerCode: PropTypes.string,
      centerType: PropTypes.string,

      reseller: PropTypes.shape({
        businessName: PropTypes.string,
        name: PropTypes.string,
        contactNumber: PropTypes.string,
      }),

      area: PropTypes.shape({
        areaName: PropTypes.string,
      }),
    }),

    date: PropTypes.string,
    orderNumber: PropTypes.string,
    challanNo: PropTypes.string,
    challanDate: PropTypes.string,
    remark: PropTypes.string,

    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,

        product: PropTypes.shape({
          productTitle: PropTypes.string,
          productCode: PropTypes.string,
          trackSerialNumber: PropTypes.string,
        }),

        quantity: PropTypes.number,
        approvedQuantity: PropTypes.number,
        receivedQuantity: PropTypes.number,

        approvedSerials: PropTypes.arrayOf(
          PropTypes.string
        ),
      })
    ),

    approvalInfo: PropTypes.shape({
      approvedAt: PropTypes.string,

      approvedBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string,
      }),

      warehouseChallanApprovedAt: PropTypes.string,

      warehouseChallanApprovedBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string,
      }),
    }),

    completionInfo: PropTypes.shape({
      completedOn: PropTypes.string,

      completedBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string,
      }),
    }),

    incompleteInfo: PropTypes.shape({
      incompleteOn: PropTypes.string,

      incompleteBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string,
      }),

      incompleteRemark: PropTypes.string,
    }),

    createdBy: PropTypes.shape({
      _id: PropTypes.string,
      fullName: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
};

export default ChallanModal;