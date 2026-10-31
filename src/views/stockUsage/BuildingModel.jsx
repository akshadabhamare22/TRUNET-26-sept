import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RotateCcw, Save, X } from "lucide-react";
import axiosInstance from "../../axiosInstance";
const BuildingModel = ({ visible, onClose, onBuildingAdded }) => {
  const initialFormData = {
    center: "",
    buildingName: "",
    displayName: "",
    address1: "",
    address2: "",
    landmark: "",
    pincode: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
  };

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get("/centers");
        setCenters(res.data.data || []);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    ["center", "buildingName", "displayName", "address1"].forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] = "This field is required";
        }
      }
    );

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axiosInstance.post("/buildings", formData);

      if (onBuildingAdded) {
        onBuildingAdded(res.data.data);
      }

      onClose();
    } catch (error) {
      console.error("Error saving data:", error);

      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setApiError("");
  };

  if (!visible) {
    return null;
  }

  const getInputClass = (field) => {
    if (errors[field]) {
      return "w-full rounded-none border border-red-400 bg-red-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";
    }

    if (formData[field]) {
      return "w-full rounded-none border border-green-400 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";
    }

    return "w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  };

  const labelClass = (field) => {
    if (errors[field]) return "text-red-600";
    if (formData[field]) return "text-green-700";
    return "text-gray-700";
  };

  return (
    <>
      <style>{`
        @keyframes buildingModalDrop {
          0% {
            opacity: 0;
            transform: translateY(-110%);
          }
          60% {
            opacity: 1;
            transform: translateY(12px);
          }
          80% {
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buildingModalOverlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .building-modal-overlay {
          animation: buildingModalOverlayFade 220ms ease-out both;
        }

        .building-modal-panel {
          animation: buildingModalDrop 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .building-modal-overlay,
          .building-modal-panel {
            animation: none;
          }
        }
      `}</style>

      <div
        className="building-modal-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="building-modal-title"
      >
        <div className="building-modal-panel mt-8 flex max-h-[calc(100vh-64px)] w-[calc(100%-32px)] max-w-[860px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:mt-8 sm:w-[860px]">
          {/* Header */}
        <div className="flex min-h-[67px] items-center justify-between border-b border-[#e2e5e9] px-4 py-3.5 sm:px-4">
          <h2
            id="building-modal-title"
            className="text-[23px] font-normal leading-none text-[#343a40]"
          >
            Add Building
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-[#777] transition hover:bg-gray-100 hover:text-[#333]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-4 py-5 sm:px-4">
          {apiError && (
            <div
              className="mb-5 flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              <span>{apiError}</span>

              <button
                type="button"
                onClick={() => setApiError("")}
                className="rounded p-1 transition hover:bg-red-100"
                aria-label="Close error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="center"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    "center"
                  )}`}
                >
                  Center <span className="text-red-500">*</span>
                </label>

                <select
                  id="center"
                  name="center"
                  value={formData.center}
                  onChange={handleChange}
                  className={getInputClass("center")}
                >
                  <option value="">SELECT</option>

                  {centers.map((center) => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </select>

                {errors.center && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.center}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="buildingName"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    "buildingName"
                  )}`}
                >
                  Building Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="buildingName"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleChange}
                  className={getInputClass("buildingName")}
                />

                {errors.buildingName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.buildingName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="displayName"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    "displayName"
                  )}`}
                >
                  Display Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className={getInputClass("displayName")}
                />

                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.displayName}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="address1"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    "address1"
                  )}`}
                >
                  Address Line 1 <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  className={getInputClass("address1")}
                />

                {errors.address1 && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address1}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address2"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Address Line 2
                </label>

                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className={getInputClass("address2")}
                />

                {errors.address2 && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address2}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="landmark"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Landmark
                </label>

                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className={getInputClass("landmark")}
                />

                {errors.landmark && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
              <div className="md:max-w-[310px]">
                <label
                  htmlFor="pincode"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Pincode
                </label>

                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={getInputClass("pincode")}
                />
              </div>

              <div />
              <div />
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#e2e5e9] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2759A2] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8c]"
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#b92f25] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#a62820]"
              >
                <Save size={16} />
                Submit
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </>
  );
};

BuildingModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBuildingAdded: PropTypes.func,
};

export default BuildingModel;
