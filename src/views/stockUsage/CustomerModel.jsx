import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RotateCcw, Save, X } from "lucide-react";
import axiosInstance from "../../axiosInstance";
const CustomerModel = ({ visible, onClose, onCustomerAdded }) => {
  const initialFormData = {
    username: "",
    name: "",
    mobile: "",
    email: "",
    centerId: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
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

    ["username", "mobile", "email", "centerId", "address1"].forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] = "This is a required field";
        }
      }
    );

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axiosInstance.post("/customers", formData);

      if (onCustomerAdded) {
        onCustomerAdded(res.data.data);
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
      return "w-full rounded-md border border-red-400 bg-red-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";
    }

    if (formData[field]) {
      return "w-full rounded-md border border-green-400 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";
    }

    return "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  };

  const getLabelClass = (field) => {
    if (errors[field]) return "text-red-600";
    if (formData[field]) return "text-green-700";
    return "text-gray-700";
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2
            id="customer-modal-title"
            className="text-lg font-semibold text-gray-800"
          >
            Add Customer
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5">
          {apiError && (
            <div
              className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="username"
                  className={`mb-1.5 block text-sm font-medium ${getLabelClass(
                    "username"
                  )}`}
                >
                  Username <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={getInputClass("username")}
                />

                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`mb-1.5 block text-sm font-medium ${getLabelClass(
                    "email"
                  )}`}
                >
                  Email <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClass("email")}
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={getInputClass("name")}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="centerId"
                  className={`mb-1.5 block text-sm font-medium ${getLabelClass(
                    "centerId"
                  )}`}
                >
                  Center <span className="text-red-500">*</span>
                </label>

                <select
                  id="centerId"
                  name="centerId"
                  value={formData.centerId}
                  onChange={handleChange}
                  className={getInputClass("centerId")}
                >
                  <option value="">SELECT</option>

                  {centers.map((center) => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </select>

                {errors.centerId && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.centerId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className={`mb-1.5 block text-sm font-medium ${getLabelClass(
                    "mobile"
                  )}`}
                >
                  Mobile <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={getInputClass("mobile")}
                />

                {errors.mobile && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.mobile}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address1"
                  className={`mb-1.5 block text-sm font-medium ${getLabelClass(
                    "address1"
                  )}`}
                >
                  Address 1 <span className="text-red-500">*</span>
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
            </div>

            {/* Row 3 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
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
                  value={formData.address2}
                  onChange={handleChange}
                  className={getInputClass("address2")}
                />
              </div>

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
                  value={formData.city}
                  onChange={handleChange}
                  className={getInputClass("city")}
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  State
                </label>

                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={getInputClass("state")}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Save size={16} />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CustomerModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCustomerAdded: PropTypes.func,
};

export default CustomerModel;
