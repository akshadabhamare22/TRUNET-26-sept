import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { X } from "lucide-react";

import axiosInstance from "../../../axiosInstance";
const AddRepairedCost = ({
  visible,
  onClose,
  onRepairCostAdded,
  repairCost,
}) => {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    product: "",
    repairCost: "",
  });

  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response =
          await axiosInstance.get(
            "/products",
          );

        if (response.data.success) {
          setProducts(
            response.data.data || [],
          );
        }
      } catch (error) {
        console.error(
          "Error fetching products:",
          error,
        );
      }
    };

    if (visible) {
      fetchProducts();
    }
  }, [visible]);

  // --------------------------------------------------
  // Initialize Form
  // --------------------------------------------------
  useEffect(() => {
    if (repairCost) {
      setFormData({
        product:
          repairCost.product?._id || "",
        repairCost:
          repairCost.repairCost || "",
      });
    } else {
      setFormData({
        product: "",
        repairCost: "",
      });
    }

    setErrors({});

    setAlert({
      type: "",
      message: "",
    });
  }, [repairCost, visible]);

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

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Product Change
  // --------------------------------------------------
  const handleProductChange = (
    selected,
  ) => {
    setFormData((prev) => ({
      ...prev,
      product: selected
        ? selected.value
        : "",
    }));

    setErrors((prev) => ({
      ...prev,
      product: "",
    }));

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.product) {
      newErrors.product =
        "Product is required";
    }

    if (
      !formData.repairCost ||
      formData.repairCost < 0
    ) {
      newErrors.repairCost =
        "Valid repair cost (≥ 0) is required";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        product: formData.product,
        repairCost: parseFloat(
          formData.repairCost,
        ),
      };

      let response;

      if (repairCost) {
        response =
          await axiosInstance.put(
            `/repaired-cost/${repairCost._id}`,
            payload,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Repair cost updated successfully!",
          });

          onRepairCostAdded(
            response.data.data,
            true,
          );
        }
      } else {
        response =
          await axiosInstance.post(
            "/repaired-cost",
            payload,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Repair cost added successfully!",
          });

          onRepairCostAdded(
            response.data.data,
            false,
          );
        }
      }

      // Reset form
      setFormData({
        product: "",
        repairCost: "",
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
        "Error saving repair cost:",
        error,
      );

      let errorMessage =
        "Failed to save repair cost";

      if (error.response?.data?.message) {
        errorMessage =
          error.response.data.message;
      }

      setAlert({
        type: "danger",
        message: errorMessage,
      });
    }
  };

  // --------------------------------------------------
  // Selected Product Name
  // --------------------------------------------------
  const getSelectedProductName = () => {
    if (!formData.product) {
      return "";
    }

    const selected = products.find(
      (product) =>
        product._id === formData.product,
    );

    return selected
      ? `${selected.productTitle} (${selected.productCode})`
      : "";
  };

  // --------------------------------------------------
  // Product Options
  // --------------------------------------------------
  const productOptions = products.map(
    (product) => ({
      value: product._id,
      label: product.productTitle,
    }),
  );

  const selectedProduct =
    formData.product
      ? {
          value: formData.product,
          label: getSelectedProductName(),
        }
      : null;

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* ---------------------------------------- */}
        {/* Header */}
        {/* ---------------------------------------- */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {repairCost
              ? "Edit Repair Cost"
              : "Add Repair Cost"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ---------------------------------------- */}
        {/* Body */}
        {/* ---------------------------------------- */}
        <div className="p-5">
          {/* Alert */}
          {alert.message && (
            <div
              className={`mb-5 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
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
                className="ml-4 text-lg font-semibold leading-none opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}

          {/* Form */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Product */}
            <div>
              <label
                htmlFor="product"
                className={`mb-1.5 block text-sm font-medium ${
                  errors.product
                    ? "text-red-600"
                    : formData.product
                      ? "text-green-600"
                      : "text-gray-700"
                }`}
              >
                Product{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <Select
                inputId="product"
                name="product"
                placeholder="Select Product..."
                value={selectedProduct}
                onChange={
                  handleProductChange
                }
                options={productOptions}
                isDisabled={!!repairCost}
                isClearable={!repairCost}
                className="text-sm"
                styles={{
                  control: (
                    base,
                    state,
                  ) => ({
                    ...base,
                    minHeight: "40px",
                    borderRadius: "6px",
                    borderColor:
                      errors.product
                        ? "#ef4444"
                        : formData.product
                          ? "#22c55e"
                          : state.isFocused
                            ? "#3b82f6"
                            : "#d1d5db",
                    boxShadow:
                      state.isFocused
                        ? "0 0 0 1px #3b82f6"
                        : "none",
                  }),
                }}
              />

              {errors.product && (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.product}
                </span>
              )}

              {repairCost && (
                <small className="mt-1 block text-xs text-red-600">
                  Product cannot be
                  changed when editing
                </small>
              )}
            </div>

            {/* Repair Cost */}
            <div>
              <label
                htmlFor="repairCost"
                className={`mb-1.5 block text-sm font-medium ${
                  errors.repairCost
                    ? "text-red-600"
                    : formData.repairCost
                      ? "text-green-600"
                      : "text-gray-700"
                }`}
              >
                Repair Cost (₹){" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="number"
                id="repairCost"
                name="repairCost"
                placeholder="Enter repair cost"
                value={
                  formData.repairCost
                }
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full rounded-md border px-3 py-2 text-sm text-gray-700 outline-none transition ${
                  errors.repairCost
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : formData.repairCost
                      ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />

              {errors.repairCost && (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.repairCost}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------- */}
        {/* Footer */}
        {/* ---------------------------------------- */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {repairCost
              ? "Update"
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

AddRepairedCost.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRepairCostAdded:
    PropTypes.func.isRequired,
  repairCost: PropTypes.object,
};

export default AddRepairedCost;