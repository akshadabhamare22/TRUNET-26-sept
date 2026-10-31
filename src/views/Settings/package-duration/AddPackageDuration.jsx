

import React, {
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  CheckCircle,
  Info,
  X,
} from "lucide-react";

import axiosInstance from "../../../axiosInstance";

const AddPackageDuration = ({
  visible,
  onClose,
  onDurationAdded,
  category,
}) => {
  const [packageDuration, setPackageDuration] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [alert, setAlert] =
    useState({
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

    return (
      Object.keys(newErrors).length === 0
    );
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
        response =
          await axiosInstance.put(
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
        response =
          await axiosInstance.post(
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
            backendErrors[err.path] =
              err.msg;
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
    <>
      {/* ==================================================
          MODAL ANIMATION
      ================================================== */}
      <style>
        {`
          @keyframes packageDurationBackdrop {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes packageDurationSlideDown {
            from {
              opacity: 0;
              transform: translateY(-60px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* ==================================================
          BACKDROP
      ================================================== */}
      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-start
          justify-center
          bg-black/50
          px-4
          pt-[125px]
        "
        style={{
          animation:
            "packageDurationBackdrop 0.22s ease-out forwards",
        }}
      >
        {/* ==================================================
            MODAL
        ================================================== */}
        <div
          className="
            w-full
            max-w-[800px]
            overflow-hidden
            rounded-[7px]
            bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          "
          style={{
            animation:
              "packageDurationSlideDown 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        >
          {/* ==================================================
              HEADER
          ================================================== */}
          <div
            className="
              flex
              h-[68px]
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
              {category
                ? "Edit Package Duration"
                : "Add Package Duration"}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-[38px]
                w-[38px]
                items-center
                justify-center
                rounded-[4px]
                text-[#777]
                transition
                duration-150
                hover:bg-[#f1f1f1]
                hover:text-[#333]
                focus:outline-none
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
              px-[17px]
              pb-[30px]
              pt-[18px]
            "
          >
            {/* Alert */}
            {alert.message && (
              <div
                className={`
                  mb-[18px]
                  flex
                  items-center
                  gap-[9px]
                  rounded-[4px]
                  border
                  px-[12px]
                  py-[10px]
                  text-[14px]
                  ${
                    alert.type ===
                    "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                {alert.type ===
                "success" ? (
                  <CheckCircle
                    size={18}
                    className="shrink-0"
                  />
                ) : (
                  <Info
                    size={18}
                    className="shrink-0"
                  />
                )}

                <span className="flex-1">
                  {alert.message}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setAlert({
                      type: "",
                      message: "",
                    })
                  }
                  className="
                    rounded
                    p-[2px]
                    opacity-70
                    transition
                    hover:bg-black/5
                    hover:opacity-100
                  "
                  aria-label="Close alert"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}
            <div>
              <label
                htmlFor="packageDuration"
                className={`
                  mb-[8px]
                  block
                  text-[16px]
                  font-semibold
                  leading-[20px]
                  ${
                    errors.packageDuration
                      ? "text-red-600"
                      : "text-[#343a40]"
                  }
                `}
              >
                Package Duration

                <span className="ml-[2px] text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                id="packageDuration"
                placeholder="Package Duration"
                value={
                  packageDuration
                }
                autoFocus
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setPackageDuration(
                    value,
                  );

                  if (value.trim()) {
                    setErrors(
                      (prev) => ({
                        ...prev,
                        packageDuration:
                          "",
                      }),
                    );
                  }
                }}
                className={`
                  h-[41px]
                  w-full
                  rounded-[2px]
                  border
                  bg-white
                  px-[12px]
                  text-[16px]
                  text-[#343a40]
                  outline-none
                  transition
                  duration-150
                  ${
                    errors.packageDuration
                      ? `
                        border-red-500
                        focus:border-red-500
                        focus:ring-1
                        focus:ring-red-200
                      `
                      : packageDuration
                      ? `
                        border-green-500
                        focus:border-green-500
                        focus:ring-1
                        focus:ring-green-200
                      `
                      : `
                        border-[#d9d9d9]
                        focus:border-[#2f5fa7]
                        focus:ring-1
                        focus:ring-[#2f5fa7]/20
                      `
                  }
                `}
              />

              {/* Validation Error */}
              {errors.packageDuration && (
                <p
                  className="
                    mt-[5px]
                    text-[12px]
                    text-red-600
                  "
                >
                  {
                    errors.packageDuration
                  }
                </p>
              )}
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}
          <div
            className="
              flex
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
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="
                h-[41px]
                rounded-[6px]
                bg-[#6c757d]
                px-[15px]
                text-[16px]
                font-medium
                text-white
                transition
                duration-150
                hover:bg-[#5c636a]
                focus:outline-none
                focus:ring-2
                focus:ring-[#6c757d]/30
              "
            >
              Close
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="
                h-[41px]
                rounded-[6px]
                bg-[#2f5fa7]
                px-[17px]
                text-[16px]
                font-medium
                text-white
                transition
                duration-150
                hover:bg-[#244c88]
                focus:outline-none
                focus:ring-2
                focus:ring-[#2f5fa7]/30
              "
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

AddPackageDuration.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onDurationAdded:
    PropTypes.func,

  category:
    PropTypes.object,
};

export default AddPackageDuration;