import React, {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle,
  Info,
  X,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Select from "react-select";

import axiosInstance from "../../../axiosInstance";

const AddVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] =
    useState({
      businessName: "",
      contactNumber: "",
      name: "",
      mobile: "",
      email: "",
      gstNumber: "",
      panNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      logo: "",
    });

  const [errors, setErrors] =
    useState({});

  const [alert, setAlert] =
    useState({
      type: "",
      message: "",
    });

  // --------------------------------------------------
  // State Options
  // --------------------------------------------------
  const stateOptions = [
    {
      value: "Andhra Pradesh",
      label: "Andhra Pradesh",
    },
    {
      value: "Arunachal Pradesh",
      label: "Arunachal Pradesh",
    },
    {
      value: "Assam",
      label: "Assam",
    },
    {
      value: "Bihar",
      label: "Bihar",
    },
    {
      value: "Chhattisgarh",
      label: "Chhattisgarh",
    },
    {
      value: "Goa",
      label: "Goa",
    },
    {
      value: "Gujarat",
      label: "Gujarat",
    },
    {
      value: "Haryana",
      label: "Haryana",
    },
    {
      value: "Himachal Pradesh",
      label: "Himachal Pradesh",
    },
    {
      value: "Jharkhand",
      label: "Jharkhand",
    },
    {
      value: "Karnataka",
      label: "Karnataka",
    },
    {
      value: "Kerala",
      label: "Kerala",
    },
    {
      value: "Madhya Pradesh",
      label: "Madhya Pradesh",
    },
    {
      value: "Maharashtra",
      label: "Maharashtra",
    },
    {
      value: "Tamil Nadu",
      label: "Tamil Nadu",
    },
    {
      value: "Telangana",
      label: "Telangana",
    },
    {
      value: "Uttar Pradesh",
      label: "Uttar Pradesh",
    },
    {
      value: "West Bengal",
      label: "West Bengal",
    },
  ];

  // --------------------------------------------------
  // Fetch Vendor For Edit
  // --------------------------------------------------
  useEffect(() => {
    if (id) {
      fetchVendor(id);
    }
  }, [id]);

  const fetchVendor = async (
    vendorId,
  ) => {
    try {
      const res =
        await axiosInstance.get(
          `/vendor/${vendorId}`,
        );

      setFormData((prev) => ({
        ...prev,
        ...res.data.data,
      }));
    } catch (error) {
      console.error(
        "Error fetching vendors:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

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
  // State Change
  // --------------------------------------------------
  const handleStateChange = (
    selected,
  ) => {
    const value = selected
      ? selected.value
      : "";

    setFormData((prev) => ({
      ...prev,
      state: value,
    }));

    setErrors((prev) => ({
      ...prev,
      state: "",
    }));
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (
    e,
  ) => {
    e.preventDefault();

    const newErrors = {};

    [
      "businessName",
      "contactNumber",
      "name",
      "email",
      "address1",
      "state",
    ].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] =
          "This is a required field";
      }
    });

    if (
      Object.keys(newErrors).length
    ) {
      setErrors(newErrors);
      return;
    }

    setAlert({
      type: "",
      message: "",
    });

    try {
      if (id) {
        await axiosInstance.put(
          `/vendor/${id}`,
          formData,
        );

        setAlert({
          type: "success",
          message:
            "Data updated successfully!",
        });
      } else {
        await axiosInstance.post(
          "/vendor",
          formData,
        );

        setAlert({
          type: "success",
          message:
            "Data added successfully!",
        });
      }

      setTimeout(() => {
        navigate("/vendor-list");
      }, 1500);
    } catch (error) {
      console.error(
        "Error saving Data:",
        error,
      );

      let message =
        "Failed to save Data. Please try again!";

      if (error.response) {
        message =
          error.response.data
            ?.message ||
          error.response.data?.error ||
          message;
      } else if (error.request) {
        message =
          "No response from server. Please check your connection.";
      } else {
        message =
          error.message;
      }

      setAlert({
        type: "danger",
        message,
      });
    }
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    setFormData({
      businessName: "",
      contactNumber: "",
      name: "",
      mobile: "",
      email: "",
      gstNumber: "",
      panNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      logo: "",
    });

    setErrors({});

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const getInputClass = (
    field,
  ) => {
    if (errors[field]) {
      return `
        w-full
        h-[40px]
        rounded-[2px]
        border
        border-red-500
        bg-red-50
        px-[10px]
        text-[16px]
        text-gray-800
        outline-none
        transition
        focus:border-red-500
        focus:ring-1
        focus:ring-red-200
      `;
    }

    if (formData[field]) {
      return `
        w-full
        h-[40px]
        rounded-[2px]
        border
        border-green-500
        bg-green-50
        px-[10px]
        text-[16px]
        text-gray-800
        outline-none
        transition
        focus:border-green-500
        focus:ring-1
        focus:ring-green-200
      `;
    }

    return `
      w-full
      h-[40px]
      rounded-[2px]
      border
      border-[#d7dce1]
      bg-white
      px-[10px]
      text-[16px]
      text-gray-800
      outline-none
      transition
      focus:border-[#2f5fa7]
      focus:ring-1
      focus:ring-[#2f5fa7]/20
    `;
  };

  const getLabelClass = (
    field,
  ) => {
    if (errors[field]) {
      return `
        mb-[7px]
        block
        text-[16px]
        font-semibold
        text-red-600
      `;
    }

    if (formData[field]) {
      return `
        mb-[7px]
        block
        text-[16px]
        font-semibold
        text-gray-900
      `;
    }

    return `
      mb-[7px]
      block
      text-[16px]
      font-semibold
      text-[#1f2937]
    `;
  };

  const ErrorMessage = ({
    field,
  }) =>
    errors[field] ? (
      <p className="mt-[4px] text-[12px] text-red-600">
        {errors[field]}
      </p>
    ) : null;

  const selectedState =
    stateOptions.find(
      (option) =>
        option.value ===
        formData.state,
    ) || null;

  const selectStyles = {
    control: (
      base,
      state,
    ) => ({
      ...base,
      minHeight: "40px",
      height: "40px",
      borderRadius: "2px",
      borderColor:
        errors.state
          ? "#ef4444"
          : state.isFocused
          ? "#2f5fa7"
          : "#d7dce1",
      boxShadow:
        state.isFocused
          ? "0 0 0 1px #2f5fa7"
          : "none",
      fontSize: "16px",
      "&:hover": {
        borderColor:
          errors.state
            ? "#ef4444"
            : "#2f5fa7",
      },
    }),

    valueContainer: (
      base,
    ) => ({
      ...base,
      height: "40px",
      padding:
        "0 10px",
    }),

    indicatorsContainer: (
      base,
    ) => ({
      ...base,
      height: "40px",
    }),

    placeholder: (
      base,
    ) => ({
      ...base,
      color: "#7b8794",
      fontSize: "16px",
    }),

    singleValue: (
      base,
    ) => ({
      ...base,
      fontSize: "16px",
      color: "#374151",
    }),

    menu: (
      base,
    ) => ({
      ...base,
      zIndex: 100,
      fontSize: "15px",
    }),
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* ==================================================
          PAGE TITLE
      ================================================== */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]"> 
        {id ? "Edit" : "Add"} Vendor
      </div>

      {/* ==================================================
          MAIN CARD
      ================================================== */}
      <div
        className="
          w-full
          overflow-hidden
          rounded-[2px]
          border
          border-[#e1e5e9]
          bg-white
          shadow-[0_2px_5px_rgba(0,0,0,0.06)]
        "
      >
        {/* BLUE TOP BORDER */}
        <div className="h-[4px] w-full bg-[#2f5fa7]" />

        <div
          className="
            px-[21px]
            pb-[20px]
            pt-[20px]
          "
        >
          {/* ==================================================
              ALERT
          ================================================== */}
          {alert.message && (
            <div
              className={`
                mb-[20px]
                flex
                items-center
                gap-[10px]
                rounded-[4px]
                border
                px-[13px]
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
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* ==================================================
              FORM
          ================================================== */}
          <form
            onSubmit={handleSubmit}
          >
            {/* ==================================================
                ROW 1
            ================================================== */}
            <div className="grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="businessName"
                  className={getLabelClass(
                    "businessName",
                  )}
                >
                  Business Name
                  <span className="ml-[2px] text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={
                    formData.businessName
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "businessName",
                  )}
                />

                <ErrorMessage
                  field="businessName"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className={getLabelClass(
                    "contactNumber",
                  )}
                >
                  Contact Number
                  <span className="ml-[2px] text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={
                    formData.contactNumber
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "contactNumber",
                  )}
                />

                <ErrorMessage
                  field="contactNumber"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className={getLabelClass(
                    "name",
                  )}
                >
                  Name
                  <span className="ml-[2px] text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "name",
                  )}
                />

                <ErrorMessage
                  field="name"
                />
              </div>
            </div>

            {/* ==================================================
                ROW 2
            ================================================== */}
            <div className="mt-[20px] grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile"
                  className="
                    mb-[7px]
                    block
                    text-[16px]
                    font-semibold
                    text-[#1f2937]
                  "
                >
                  Mobile
                </label>

                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={
                    formData.mobile
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "mobile",
                  )}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={getLabelClass(
                    "email",
                  )}
                >
                  Email
                  <span className="ml-[2px] text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "email",
                  )}
                />

                <ErrorMessage
                  field="email"
                />
              </div>

              {/* GST */}
              <div>
                <label
                  htmlFor="gstNumber"
                  className="
                    mb-[7px]
                    block
                    text-[16px]
                    font-semibold
                    text-[#1f2937]
                  "
                >
                  GST No
                </label>

                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={
                    formData.gstNumber
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "gstNumber",
                  )}
                />
              </div>
            </div>

            {/* ==================================================
                ROW 3
            ================================================== */}
            <div className="mt-[20px] grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
              {/* PAN */}
              <div>
                <label
                  htmlFor="panNumber"
                  className="
                    mb-[7px]
                    block
                    text-[16px]
                    font-semibold
                    text-[#1f2937]
                  "
                >
                  Pan No
                </label>

                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={
                    formData.panNumber
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "panNumber",
                  )}
                />
              </div>

              {/* Address 1 */}
              <div>
                <label
                  htmlFor="address1"
                  className={getLabelClass(
                    "address1",
                  )}
                >
                  Address 1
                  <span className="ml-[2px] text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="address1"
                  name="address1"
                  value={
                    formData.address1
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "address1",
                  )}
                />

                <ErrorMessage
                  field="address1"
                />
              </div>

              {/* Address 2 */}
              <div>
                <label
                  htmlFor="address2"
                  className="
                    mb-[7px]
                    block
                    text-[16px]
                    font-semibold
                    text-[#1f2937]
                  "
                >
                  Address 2
                </label>

                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={
                    formData.address2
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "address2",
                  )}
                />
              </div>
            </div>

            {/* ==================================================
                ROW 4
            ================================================== */}
            <div className="mt-[20px] grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="
                    mb-[7px]
                    block
                    text-[16px]
                    font-semibold
                    text-[#1f2937]
                  "
                >
                  City
                </label>

                <input
                  type="text"
                  id="city"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  className={getInputClass(
                    "city",
                  )}
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className={getLabelClass(
                    "state",
                  )}
                >
                  State
                  <span className="ml-[2px] text-red-500">
                    *
                  </span>
                </label>

                <Select
                  inputId="state"
                  options={
                    stateOptions
                  }
                  placeholder="Select State"
                  isSearchable
                  value={
                    selectedState
                  }
                  onChange={
                    handleStateChange
                  }
                  styles={
                    selectStyles
                  }
                />

                <ErrorMessage
                  field="state"
                />
              </div>

              {/* Logo */}
              <div>
                <label
                  htmlFor="logo"
                  className="
                    mb-[7px]
                    block
                    text-[16px]
                    font-semibold
                    text-[#1f2937]
                  "
                >
                  Logo
                </label>

                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={
                    handleChange
                  }
                  className="
                    block
                    h-[40px]
                    w-full
                    cursor-pointer
                    rounded-[2px]
                    border
                    border-[#d7dce1]
                    bg-white
                    text-[14px]
                    text-[#374151]
                    file:mr-[10px]
                    file:h-[38px]
                    file:border-0
                    file:border-r
                    file:border-[#d7dce1]
                    file:bg-[#f8f9fa]
                    file:px-[10px]
                    file:text-[14px]
                    file:font-medium
                    file:text-[#374151]
                    hover:file:bg-[#eef0f2]
                  "
                />
              </div>
            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}
            <div
              className="
                mt-[30px]
                flex
                items-center
                justify-end
                gap-[12px]
                border-t
                border-[#e1e5e9]
                pt-[20px]
              "
            >
              {/* RESET */}
              <button
                type="button"
                onClick={
                  handleReset
                }
                className="
                  h-[42px]
                  rounded-[4px]
                  border
                  border-[#2f5fa7]
                  bg-[#2f5fa7]
                  px-[17px]
                  text-[15px]
                  font-medium
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#244c88]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#2f5fa7]/30
                "
              >
                Reset
              </button>

              {/* SUBMIT */}
              <button
                type="submit"
                className="
                  h-[42px]
                  rounded-[4px]
                  border
                  border-[#b52a2a]
                  bg-[#b52a2a]
                  px-[18px]
                  text-[15px]
                  font-medium
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#9f2424]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-300
                "
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVendor;