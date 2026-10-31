

import React, {
  useEffect,
  useState,
} from "react";
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
        const response =
          await axiosInstance.get(
            "/resellers",
          );

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
        resellerId:
          area.reseller?._id || "",
        areaName:
          area.areaName || "",
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
      newErrors.resellerId =
        "This is a required field";
    }

    if (!formData.areaName.trim()) {
      newErrors.areaName =
        "This is a required field";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;

      // Edit Area
      if (area) {
        response =
          await axiosInstance.put(
            `/areas/${area._id}`,
            formData,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Area updated successfully!",
          });

          onAreaAdded(
            response.data.data,
            true,
          );
        }
      }

      // Add Area
      else {
        response =
          await axiosInstance.post(
            "/areas",
            formData,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Area added successfully!",
          });

          onAreaAdded(
            response.data.data,
            false,
          );
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
      console.error(
        "Error saving area:",
        error,
      );

      setAlert({
        type: "danger",
        message: "Failed to save area",
      });
    }
  };

  // --------------------------------------------------
  // Selected Reseller
  // --------------------------------------------------
  const selectedReseller =
    formData.resellerId
      ? {
          value: formData.resellerId,
          label:
            resellers.find(
              (reseller) =>
                reseller._id ===
                formData.resellerId,
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
    <>
      {/* ==================================================
          MODAL ANIMATION
      ================================================== */}
      <style>
        {`
          @keyframes areaModalDropDown {
            0% {
              opacity: 0;
              transform: translateY(-70px) scale(0.98);
            }

            60% {
              opacity: 1;
              transform: translateY(8px) scale(1);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes areaModalOverlay {
            0% {
              opacity: 0;
            }

            100% {
              opacity: 1;
            }
          }

          .area-modal-overlay {
            animation: areaModalOverlay 0.2s ease-out forwards;
          }

          .area-modal-content {
            animation: areaModalDropDown 0.38s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }
        `}
      </style>

      {/* ==================================================
          OVERLAY
      ================================================== */}
      <div
        className="
          area-modal-overlay
          fixed
          inset-0
          z-[9999]
          overflow-y-auto
          bg-black/50
          px-4
          py-[55px]
          backdrop-blur-[1px]
        "
      >
        {/* ==================================================
            MODAL
        ================================================== */}
        <div
          className="
            area-modal-content
            mx-auto
            w-full
            max-w-[760px]
            overflow-hidden
            rounded-[4px]
            border
            border-[#dcdcdc]
            bg-white
            shadow-[0_12px_35px_rgba(0,0,0,0.25)]
          "
        >
         

          {/* ==================================================
              HEADER
          ================================================== */}
          <div
            className="
              flex
              min-h-[58px]
              items-center
              justify-between
              border-b
              border-[#e1e1e1]
              bg-white
              px-[18px]
              py-[12px]
            "
          >
            <h2
              className="
                text-[21px]
                font-normal
                leading-none
                text-[#30343b]
              "
            >
              {area
                ? "Edit Area"
                : "Add Area"}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-[32px]
                w-[32px]
                items-center
                justify-center
                rounded-full
                text-[27px]
                font-light
                leading-none
                text-[#777]
                transition
                duration-150
                hover:bg-[#f1f1f1]
                hover:text-[#222]
              "
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* ==================================================
              BODY
          ================================================== */}
          <div
            className="
              bg-white
              px-[18px]
              py-[20px]
            "
          >
            {/* ==================================================
                ALERT
            ================================================== */}
            {alert.message && (
              <div
                className={`
                  mb-[18px]
                  flex
                  items-center
                  justify-between
                  rounded-[3px]
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
                <span>
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
                    ml-4
                    text-[18px]
                    font-semibold
                    opacity-60
                    hover:opacity-100
                  "
                  aria-label="Close alert"
                >
                  ×
                </button>
              </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}
            <div
              className="
                grid
                grid-cols-1
                gap-x-[22px]
                gap-y-[18px]
                md:grid-cols-2
              "
            >
              {/* ==================================================
                  RESELLER
              ================================================== */}
              <div>
                <label
                  htmlFor="resellerId"
                  className="
                    mb-[7px]
                    block
                    text-[15px]
                    font-semibold
                    text-[#20242a]
                  "
                >
                  Reseller Name{" "}
                  <span className="text-[#dc2626]">
                    *
                  </span>
                </label>

                <Select
                  inputId="resellerId"
                  name="resellerId"
                  placeholder="Select Reseller..."
                  value={
                    selectedReseller
                  }
                  onChange={(selected) => {
                    setFormData(
                      (prev) => ({
                        ...prev,
                        resellerId:
                          selected
                            ? selected.value
                            : "",
                      }),
                    );

                    setErrors(
                      (prev) => ({
                        ...prev,
                        resellerId: "",
                      }),
                    );
                  }}
                  options={resellers.map(
                    (reseller) => ({
                      value:
                        reseller._id,
                      label:
                        reseller.businessName,
                    }),
                  )}
                  isClearable
                  classNamePrefix="react-select"
                  styles={{
                    control: (
                      base,
                      state,
                    ) => ({
                      ...base,
                      minHeight:
                        "40px",
                      height: "40px",
                      borderRadius:
                        "2px",
                      borderColor:
                        errors.resellerId
                          ? "#dc2626"
                          : state.isFocused
                            ? "#2f64ad"
                            : "#d5d5d5",
                      boxShadow:
                        state.isFocused
                          ? "0 0 0 1px rgba(47,100,173,0.15)"
                          : "none",
                      "&:hover": {
                        borderColor:
                          errors.resellerId
                            ? "#dc2626"
                            : "#2f64ad",
                      },
                    }),

                    valueContainer: (
                      base,
                    ) => ({
                      ...base,
                      padding:
                        "0 11px",
                    }),

                    placeholder: (
                      base,
                    ) => ({
                      ...base,
                      color:
                        "#8a8a8a",
                      fontSize:
                        "14px",
                    }),

                    singleValue: (
                      base,
                    ) => ({
                      ...base,
                      color:
                        "#222",
                      fontSize:
                        "14px",
                    }),

                    option: (
                      base,
                      state,
                    ) => ({
                      ...base,
                      fontSize:
                        "14px",
                      backgroundColor:
                        state.isSelected
                          ? "#2f64ad"
                          : state.isFocused
                            ? "#edf3fb"
                            : "#fff",
                      color:
                        state.isSelected
                          ? "#fff"
                          : "#222",
                    }),

                    menu: (
                      base,
                    ) => ({
                      ...base,
                      zIndex: 10000,
                    }),
                  }}
                />

                {errors.resellerId && (
                  <p
                    className="
                      mt-[5px]
                      text-[12px]
                      text-red-600
                    "
                  >
                    {errors.resellerId}
                  </p>
                )}
              </div>

              {/* ==================================================
                  AREA NAME
              ================================================== */}
              <div>
                <label
                  htmlFor="areaName"
                  className="
                    mb-[7px]
                    block
                    text-[15px]
                    font-semibold
                    text-[#20242a]
                  "
                >
                  Area Name{" "}
                  <span className="text-[#dc2626]">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="areaName"
                  name="areaName"
                  placeholder="Area"
                  value={
                    formData.areaName
                  }
                  onChange={
                    handleChange
                  }
                  className={`
                    h-[40px]
                    w-full
                    rounded-[2px]
                    border
                    bg-white
                    px-[11px]
                    text-[14px]
                    text-[#222]
                    outline-none
                    transition
                    duration-150
                    ${
                      errors.areaName
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                        : "border-[#d5d5d5] focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]/15"
                    }
                  `}
                />

                {errors.areaName && (
                  <p
                    className="
                      mt-[5px]
                      text-[12px]
                      text-red-600
                    "
                  >
                    {errors.areaName}
                  </p>
                )}
              </div>
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
              gap-[10px]
              border-t
              border-[#e2e2e2]
              bg-white
              px-[18px]
              py-[14px]
            "
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="
                h-[40px]
                rounded-[4px]
                border
                border-[#c8cdd3]
                bg-white
                px-[18px]
                text-[14px]
                font-medium
                text-[#4b5563]
                transition
                duration-150
                hover:bg-[#f3f4f6]
                focus:outline-none
              "
            >
              Cancel
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={
                handleSubmit
              }
              className="
                h-[40px]
                rounded-[4px]
                bg-[#2f64ad]
                px-[20px]
                text-[14px]
                font-medium
                text-white
                shadow-sm
                transition
                duration-150
                hover:bg-[#25599e]
                focus:outline-none
                focus:ring-2
                focus:ring-[#2f64ad]/30
              "
            >
              {area
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

AddArea.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAreaAdded: PropTypes.func.isRequired,
  area: PropTypes.object,
};

export default AddArea;