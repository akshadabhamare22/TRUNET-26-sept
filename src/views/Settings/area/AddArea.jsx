import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

import axiosInstance from "../../../axiosInstance";
const AddArea = ({
  visible,
  onClose,
  onAreaAdded,
  area,
}) => {
  const [resellers, setResellers] = useState([]);

  const [formData, setFormData] = useState({
    resellerId: "",
    areaName: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // --------------------------------------------------
  // Fetch Resellers
  // --------------------------------------------------
  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const response = await axiosInstance.get("/resellers");

        if (response.data.success) {
          setResellers(response.data.data);
        }
      } catch (error) {
        console.error(
          "Error fetching resellers:",
          error,
        );
      }
    };

    fetchResellers();
  }, []);

  // --------------------------------------------------
  // Set Form Data for Add / Edit
  // --------------------------------------------------
  useEffect(() => {
    if (area) {
      setFormData({
        resellerId: area.reseller?._id || "",
        areaName: area.areaName || "",
      });
    } else {
      setFormData({
        resellerId: "",
        areaName: "",
      });
    }

    setErrors({});
    setAlert({
      type: "",
      message: "",
    });
  }, [area, visible]);

  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------
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
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.resellerId) {
      newErrors.resellerId = "This is a required field";
    }

    if (!formData.areaName.trim()) {
      newErrors.areaName = "This is a required field";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;

      // Edit Area
      if (area) {
        response = await axiosInstance.put(
          `/areas/${area._id}`,
          formData,
        );

        if (response.data.success) {
          setAlert({
            type: "success",
            message: "Area updated successfully!",
          });

          onAreaAdded(response.data.data, true);
        }
      }

      // Add Area
      else {
        response = await axiosInstance.post(
          "/areas",
          formData,
        );

        if (response.data.success) {
          setAlert({
            type: "success",
            message: "Area added successfully!",
          });

          onAreaAdded(response.data.data, false);
        }
      }

      setFormData({
        resellerId: "",
        areaName: "",
      });

      setErrors({});

      setTimeout(() => {
        setAlert({
          type: "",
          message: "",
        });

        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving area:", error);

      setAlert({
        type: "danger",
        message: "Failed to save area",
      });
    }
  };

  // --------------------------------------------------
  // Selected Reseller
  // --------------------------------------------------
  const selectedReseller = formData.resellerId
    ? {
        value: formData.resellerId,
        label:
          resellers.find(
            (reseller) =>
              reseller._id === formData.resellerId,
          )?.businessName || "",
      }
    : null;

  // --------------------------------------------------
  // Modal
  // --------------------------------------------------
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {area ? "Edit Area" : "Add Area"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 transition hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Alert */}
          {alert.message && (
            <div
              className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span>{alert.message}</span>

              <button
                type="button"
                onClick={() =>
                  setAlert({
                    type: "",
                    message: "",
                  })
                }
                className="ml-4 text-lg font-semibold opacity-70 hover:opacity-100"
                aria-label="Close alert"
              >
                ×
              </button>
            </div>
          )}

          {/* Form */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Reseller */}
            <div>
              <label
                htmlFor="resellerId"
                className={`mb-2 block text-sm font-medium ${
                  errors.resellerId
                    ? "text-red-600"
                    : formData.resellerId
                      ? "text-green-600"
                      : "text-gray-700"
                }`}
              >
                Reseller Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <Select
                inputId="resellerId"
                name="resellerId"
                placeholder="Select Reseller..."
                value={selectedReseller}
                onChange={(selected) => {
                  setFormData((prev) => ({
                    ...prev,
                    resellerId: selected
                      ? selected.value
                      : "",
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    resellerId: "",
                  }));
                }}
                options={resellers.map(
                  (reseller) => ({
                    value: reseller._id,
                    label: reseller.businessName,
                  }),
                )}
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "38px",
                    borderRadius: "0.375rem",
                    borderColor: errors.resellerId
                      ? "#dc2626"
                      : formData.resellerId
                        ? "#16a34a"
                        : state.isFocused
                          ? "#2563eb"
                          : "#d1d5db",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: errors.resellerId
                        ? "#dc2626"
                        : "#2563eb",
                    },
                  }),
                }}
              />

              {errors.resellerId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.resellerId}
                </p>
              )}
            </div>

            {/* Area Name */}
            <div>
              <label
                htmlFor="areaName"
                className={`mb-2 block text-sm font-medium ${
                  errors.areaName
                    ? "text-red-600"
                    : formData.areaName
                      ? "text-green-600"
                      : "text-gray-700"
                }`}
              >
                Area Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                id="areaName"
                name="areaName"
                placeholder="Area"
                value={formData.areaName}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                  errors.areaName
                    ? "border-red-500 focus:ring-2 focus:ring-red-100"
                    : formData.areaName
                      ? "border-green-500 focus:ring-2 focus:ring-green-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />

              {errors.areaName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.areaName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

AddArea.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAreaAdded: PropTypes.func.isRequired,
  area: PropTypes.object,
};

export default AddArea;