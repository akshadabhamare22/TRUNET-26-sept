import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import axiosInstance from '../../../axiosInstance'

const AddCustomer = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    mobile: '',
    email: '',
    centerId: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
  })

  const [centers, setCenters] = useState([])
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  })

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers?centerType=Center')
        setCenters(res.data.data || [])
      } catch (error) {
        console.log(error)
      }
    }

    fetchCenters()
  }, [])

  useEffect(() => {
    if (id) {
      fetchCustomer(id)
    }
  }, [id])

  const fetchCustomer = async (customerId) => {
    try {
      const res = await axiosInstance.get(`/customers/${customerId}`)
      const data = res.data.data

      setFormData({
        username: data.username || '',
        name: data.name || '',
        mobile: data.mobile || '',
        email: data.email || '',
        centerId: data.center?._id || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        city: data.city || '',
        state: data.state || '',
      })
    } catch (error) {
      console.log('error fetching customers', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}

    ;['username', 'mobile', 'email', 'centerId', 'address1'].forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] = 'This is a required field'
        }
      }
    )

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    try {
      if (id) {
        await axiosInstance.put(`/customers/${id}`, formData)

        setAlert({
          type: 'success',
          message: 'Data updated successfully!',
        })
      } else {
        await axiosInstance.post('/customers', formData)

        setAlert({
          type: 'success',
          message: 'Data added successfully!',
        })
      }

      setTimeout(() => {
        navigate('/customers-list')
      }, 1500)
    } catch (error) {
      console.error('Error saving Data:', error)

      let message = 'Failed to save Data. Please try again!'

      if (error.response) {
        message =
          error.response.data?.message ||
          error.response.data?.error ||
          message
      } else if (error.request) {
        message = 'No response from server. Please check your connection.'
      } else {
        message = error.message
      }

      setAlert({
        type: 'danger',
        message,
      })
    }
  }

  const handleReset = () => {
    setFormData({
      username: '',
      name: '',
      mobile: '',
      email: '',
      centerId: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
    })

    setErrors({})
  }

  const selectedCenter = centers.find(
    (center) => center._id === formData.centerId
  )

  const getInputClass = (field) => {
    if (errors[field]) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500'
    }

    if (formData[field]) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500'
    }

    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-800">
            {id ? 'Edit' : 'Add'} Customer
          </h1>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-5 md:p-6">
            {/* Alert */}
            {alert.message && (
              <div
                className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                  alert.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
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
                  aria-label="Close alert"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className={`mb-2 block text-sm font-medium ${
                      errors.username
                        ? 'text-red-600'
                        : formData.username
                          ? 'text-green-600'
                          : 'text-gray-700'
                    }`}
                  >
                    Username <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-1 ${getInputClass(
                      'username'
                    )}`}
                  />

                  {errors.username && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={`mb-2 block text-sm font-medium ${
                      errors.email
                        ? 'text-red-600'
                        : formData.email
                          ? 'text-green-600'
                          : 'text-gray-700'
                    }`}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-1 ${getInputClass(
                      'email'
                    )}`}
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Branch */}
                <div>
                  <label
                    htmlFor="centerId"
                    className={`mb-2 block text-sm font-medium ${
                      errors.centerId
                        ? 'text-red-600'
                        : formData.centerId
                          ? 'text-green-600'
                          : 'text-gray-700'
                    }`}
                  >
                    Branch <span className="text-red-500">*</span>
                  </label>

                  <Select
                    inputId="centerId"
                    name="centerId"
                    value={
                      selectedCenter
                        ? {
                            label: selectedCenter.centerName,
                            value: selectedCenter._id,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      handleChange({
                        target: {
                          name: 'centerId',
                          value: selected ? selected.value : '',
                        },
                      })
                    }
                    options={centers.map((center) => ({
                      label: center.centerName,
                      value: center._id,
                    }))}
                    placeholder="Select Branch"
                    isClearable
                    classNamePrefix="react-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: '42px',
                        borderRadius: '6px',
                        borderColor: errors.centerId
                          ? '#ef4444'
                          : formData.centerId
                            ? '#22c55e'
                            : state.isFocused
                              ? '#3b82f6'
                              : '#d1d5db',
                        boxShadow: state.isFocused
                          ? errors.centerId
                            ? '0 0 0 1px #ef4444'
                            : '0 0 0 1px #3b82f6'
                          : 'none',
                      }),
                    }}
                  />

                  {errors.centerId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.centerId}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label
                    htmlFor="mobile"
                    className={`mb-2 block text-sm font-medium ${
                      errors.mobile
                        ? 'text-red-600'
                        : formData.mobile
                          ? 'text-green-600'
                          : 'text-gray-700'
                    }`}
                  >
                    Mobile <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-1 ${getInputClass(
                      'mobile'
                    )}`}
                  />

                  {errors.mobile && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Address 1 */}
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
                    Address 1 <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    id="address1"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-1 ${getInputClass(
                      'address1'
                    )}`}
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
                {/* Address 2 */}
                <div>
                  <label
                    htmlFor="address2"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address 2
                  </label>

                  <input
                    type="text"
                    id="address2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>

                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
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
    </div>
  )
}

export default AddCustomer