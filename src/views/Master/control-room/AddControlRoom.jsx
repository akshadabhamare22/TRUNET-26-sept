import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import axiosInstance from '../../../axiosInstance';

const initialFormData = {
  center: '',
  buildingName: '',
  displayName: '',
  address1: '',
  address2: '',
  landmark: '',
  pincode: '',
};

const AddControlRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(initialFormData);
  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  // --------------------------------------------------
  // Fetch Centers
  // --------------------------------------------------
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get(
          '/centers?centerType=Center'
        );

        setCenters(res.data.data || []);
      } catch (error) {
        console.error(
          'Error fetching centers:',
          error
        );
      }
    };

    fetchCenters();
  }, []);

  // --------------------------------------------------
  // Fetch Control Room For Edit
  // --------------------------------------------------
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (controlRoomId) => {
    try {
      const res = await axiosInstance.get(
        `/controlRooms/${controlRoomId}`
      );

      const data = res.data.data;

      setFormData({
        center: data.center?._id || '',
        buildingName: data.buildingName || '',
        displayName: data.displayName || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        landmark: data.landmark || '',
        pincode: data.pincode || '',
      });
    } catch (error) {
      console.error(
        'Error fetching controlRoom:',
        error
      );
    }
  };

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
      [name]: '',
    }));
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    ['center', 'buildingName', 'displayName', 'address1'].forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        }
      }
    );

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(
          `/controlRooms/${id}`,
          formData
        );

        setAlert({
          type: 'success',
          message: 'Data updated successfully!',
        });
      } else {
        await axiosInstance.post(
          '/controlRooms',
          formData
        );

        setAlert({
          type: 'success',
          message: 'Data added successfully!',
        });
      }

      setTimeout(() => {
        navigate('/controlRoom-list');
      }, 1500);
    } catch (error) {
      console.error('Error saving Data:', error);

      let message =
        'Failed to save Data. Please try again!';

      if (error.response) {
        const data = error.response.data;

        if (
          data.errors &&
          Array.isArray(data.errors)
        ) {
          message = `${data.message}: ${data.errors.join(
            ', '
          )}`;
        } else {
          message =
            data.message ||
            data.error ||
            message;
        }
      } else if (error.request) {
        message =
          'No response from server. Please check your connection.';
      } else {
        message = error.message;
      }

      setAlert({
        type: 'danger',
        message,
      });
    }
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // --------------------------------------------------
  // Selected Center
  // --------------------------------------------------
  const selectedCenter =
    centers.find(
      (center) => center._id === formData.center
    ) || null;

  const centerOptions = centers.map((center) => ({
    label: center.centerName,
    value: center._id,
  }));

  // --------------------------------------------------
  // React Select Styles
  // --------------------------------------------------
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '6px',
      borderColor: errors.center
        ? '#ef4444'
        : state.isFocused
          ? '#2563eb'
          : '#d1d5db',
      boxShadow: state.isFocused
        ? errors.center
          ? '0 0 0 1px #ef4444'
          : '0 0 0 1px #2563eb'
        : 'none',
      '&:hover': {
        borderColor: errors.center
          ? '#ef4444'
          : '#9ca3af',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '14px',
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '14px',
      color: '#374151',
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '14px',
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
          ? '#eff6ff'
          : '#ffffff',
      color: state.isSelected
        ? '#ffffff'
        : '#374151',
    }),
  };

  // --------------------------------------------------
  // Input Class Helper
  // --------------------------------------------------
  const getInputClass = (field) => {
    const hasError = Boolean(errors[field]);
    const hasValue = Boolean(formData[field]);

    return `
      w-full
      rounded-md
      border
      px-3
      py-2.5
      text-sm
      text-gray-700
      outline-none
      transition
      placeholder:text-gray-400
      ${
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          : hasValue
            ? 'border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
      }
    `;
  };

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-5 text-xl font-semibold text-gray-800">
        {id ? 'Edit' : 'Add'} Control Room
      </div>

      {/* Alert */}
      {alert.message && (
        <div
          className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
            alert.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
          role="alert"
        >
          <span>{alert.message}</span>

          <button
            type="button"
            onClick={() =>
              setAlert({
                type: '',
                message: '',
              })
            }
            className="ml-4 text-lg font-semibold opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-5 md:p-6">
          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Branch */}
              <div>
                <label
                  htmlFor="center"
                  className={`mb-2 block text-sm font-medium ${
                    errors.center
                      ? 'text-red-600'
                      : formData.center
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Branch{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <Select
                  id="center"
                  name="center"
                  value={
                    selectedCenter
                      ? {
                          label:
                            selectedCenter.centerName,
                          value: formData.center,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleChange({
                      target: {
                        name: 'center',
                        value: selected
                          ? selected.value
                          : '',
                      },
                    })
                  }
                  options={centerOptions}
                  placeholder="Select Branch"
                  isClearable
                  styles={selectStyles}
                />

                {errors.center && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.center}
                  </p>
                )}
              </div>

              {/* Building Name */}
              <div>
                <label
                  htmlFor="buildingName"
                  className={`mb-2 block text-sm font-medium ${
                    errors.buildingName
                      ? 'text-red-600'
                      : formData.buildingName
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Building Name{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="buildingName"
                  name="buildingName"
                  className={getInputClass(
                    'buildingName'
                  )}
                  value={formData.buildingName}
                  onChange={handleChange}
                />

                {errors.buildingName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.buildingName}
                  </p>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label
                  htmlFor="displayName"
                  className={`mb-2 block text-sm font-medium ${
                    errors.displayName
                      ? 'text-red-600'
                      : formData.displayName
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Display Name{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  className={getInputClass(
                    'displayName'
                  )}
                  value={formData.displayName}
                  onChange={handleChange}
                />

                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.displayName}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Address Line 1 */}
              <div>
                <label
                  htmlFor="address1"
                  className={`mb-2 block text-sm font-medium ${
                    errors.address1
                      ? 'text-red-600'
                      : formData.address1
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Address Line 1{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="address1"
                  name="address1"
                  className={getInputClass(
                    'address1'
                  )}
                  value={formData.address1}
                  onChange={handleChange}
                />

                {errors.address1 && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address1}
                  </p>
                )}
              </div>

              {/* Address Line 2 */}
              <div>
                <label
                  htmlFor="address2"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address Line 2
                </label>

                <input
                  type="text"
                  id="address2"
                  name="address2"
                  className={getInputClass(
                    'address2'
                  )}
                  value={formData.address2}
                  onChange={handleChange}
                />

                {errors.address2 && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address2}
                  </p>
                )}
              </div>

              {/* Landmark */}
              <div>
                <label
                  htmlFor="landmark"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Landmark
                </label>

                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  className={getInputClass(
                    'landmark'
                  )}
                  value={formData.landmark}
                  onChange={handleChange}
                />

                {errors.landmark && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Pincode */}
              <div>
                <label
                  htmlFor="pincode"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pincode
                </label>

                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className={getInputClass(
                    'pincode'
                  )}
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div />
              <div />
            </div>

            {/* Footer Buttons */}
            <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Reset
              </button>

              <button
                type="submit"
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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

export default AddControlRoom;