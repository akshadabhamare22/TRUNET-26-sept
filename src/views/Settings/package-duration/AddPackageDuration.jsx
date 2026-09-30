import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import axiosInstance from "../../../axiosInstance";
const AddPackageDuration = ({
  visible,
  onClose,
  onDurationAdded,
  category,
}) => {
  const [packageDuration, setPackageDuration] =
    useState("");

  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // --------------------------------------------------
  // Initialize form
  // --------------------------------------------------
  useEffect(() => {
    if (category) {
      setPackageDuration(
        category.packageDuration || "",
      );
    } else {
      setPackageDuration("");
    }

    setErrors({});

    setAlert({
      type: "",
      message: "",
    });
  }, [category, visible]);

  // --------------------------------------------------
  // Validate
  // --------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!packageDuration.trim()) {
      newErrors.packageDuration =
        "This is a required field";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response;

      // Edit
      if (category) {
        response = await axiosInstance.put(
          `/packageDuration/${category._id}`,
          {
            packageDuration,
          },
        );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Package Duration updated successfully!",
          });

          if (onDurationAdded) {
            onDurationAdded(
              response.data.data,
              true,
            );
          }

          setPackageDuration("");

          setTimeout(() => {
            onClose();
          }, 1500);
        }
      }

      // Add
      else {
        response = await axiosInstance.post(
          "/packageDuration",
          {
            packageDuration,
          },
        );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Package Duration added successfully!",
          });

          if (onDurationAdded) {
            onDurationAdded(
              response.data.data,
              false,
            );
          }

          setPackageDuration("");

          setTimeout(() => {
            onClose();
          }, 1500);
        }
      }
    } catch (error) {
      console.error(
        "Error saving package duration:",
        error,
      );

      // Backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach(
          (err) => {
            backendErrors[err.path] = err.msg;
          },
        );

        setErrors(backendErrors);
      } else {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to save package duration";

        setAlert({
          type: "danger",
          message: msg,
        });
      }
    }
  };

  // --------------------------------------------------
  // Hidden
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
            {category
              ? "Edit Package Duration"
              : "Add Package Duration"}
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
          <div>
            <label
              htmlFor="packageDuration"
              className={`mb-2 block text-sm font-medium ${
                errors.packageDuration
                  ? "text-red-600"
                  : packageDuration
                    ? "text-green-600"
                    : "text-gray-700"
              }`}
            >
              Package Duration{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              id="packageDuration"
              placeholder="Package Duration"
              value={packageDuration}
              onChange={(e) => {
                const value = e.target.value;

                setPackageDuration(value);

                if (value.trim()) {
                  setErrors((prev) => ({
                    ...prev,
                    packageDuration: "",
                  }));
                }
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                errors.packageDuration
                  ? "border-red-500 focus:ring-2 focus:ring-red-100"
                  : packageDuration
                    ? "border-green-500 focus:ring-2 focus:ring-green-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            {errors.packageDuration && (
              <p className="mt-1 text-xs text-red-600">
                {errors.packageDuration}
              </p>
            )}
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

AddPackageDuration.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDurationAdded: PropTypes.func,
  category: PropTypes.object,
};

export default AddPackageDuration;