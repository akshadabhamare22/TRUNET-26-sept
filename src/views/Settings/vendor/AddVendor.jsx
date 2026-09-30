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
      return "w-full rounded-md border border-red-500 bg-red-50 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200";
    }

    if (formData[field]) {
      return "w-full rounded-md border border-green-500 bg-green-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200";
    }

    return "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200";
  };

  const getLabelClass = (
    field,
  ) => {
    if (errors[field]) {
      return "mb-1.5 block text-sm font-medium text-red-600";
    }

    if (formData[field]) {
      return "mb-1.5 block text-sm font-medium text-green-600";
    }

    return "mb-1.5 block text-sm font-medium text-gray-700";
  };

  const ErrorMessage = ({
    field,
  }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">
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
      borderColor:
        errors.state
          ? "#ef4444"
          : state.isFocused
          ? "#3b82f6"
          : "#d1d5db",
      boxShadow:
        state.isFocused
          ? "0 0 0 1px #3b82f6"
          : "none",
      "&:hover": {
        borderColor:
          errors.state
            ? "#ef4444"
            : "#3b82f6",
      },
    }),
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-4 text-xl font-semibold text-gray-800">
        {id ? "Edit" : "Add"} Vendor
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-5">
          {/* Alert */}
          {alert.message && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${
                alert.type ===
                "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {alert.type ===
              "success" ? (
                <CheckCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <Info
                  size={18}
                  className="mt-0.5 shrink-0"
                />
              )}

              <span className="flex-1">
                {
                  alert.message
                }
              </span>

              <button
                type="button"
                onClick={() =>
                  setAlert({
                    type: "",
                    message: "",
                  })
                }
                className="opacity-70 hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="businessName"
                  className={getLabelClass(
                    "businessName",
                  )}
                >
                  Business Name{" "}
                  <span className="text-red-500">
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

                <ErrorMessage field="businessName" />
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className={getLabelClass(
                    "contactNumber",
                  )}
                >
                  Contact Number{" "}
                  <span className="text-red-500">
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

                <ErrorMessage field="contactNumber" />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className={getLabelClass(
                    "name",
                  )}
                >
                  Name{" "}
                  <span className="text-red-500">
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

                <ErrorMessage field="name" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
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
                  Email{" "}
                  <span className="text-red-500">
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

                <ErrorMessage field="email" />
              </div>

              {/* GST */}
              <div>
                <label
                  htmlFor="gstNumber"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
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

            {/* Row 3 */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* PAN */}
              <div>
                <label
                  htmlFor="panNumber"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
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
                  Address 1{" "}
                  <span className="text-red-500">
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

                <ErrorMessage field="address1" />
              </div>

              {/* Address 2 */}
              <div>
                <label
                  htmlFor="address2"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
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

            {/* Row 4 */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
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
                  State{" "}
                  <span className="text-red-500">
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

                <ErrorMessage field="state" />
              </div>

              {/* Logo */}
              <div>
                <label
                  htmlFor="logo"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
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
                  className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-3 file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  handleReset
                }
                className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                type="submit"
                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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