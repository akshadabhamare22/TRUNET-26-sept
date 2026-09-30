import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import Select from 'react-select'
import axiosInstance from '../../../axiosInstance';

const AddBuilding = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    center: '',
    buildingName: '',
    displayName: '',
    address1: '',
    address2: '',
    landmark: '',
    pincode: '',
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
        console.error('Error fetching centers:', error)
      }
    }

    fetchCenters()
  }, [])

  useEffect(() => {
    if (id) {
      fetchBuilding(id)
    }
  }, [id])

  const fetchBuilding = async (buildingId) => {
    try {
      const res = await axiosInstance.get(`/buildings/${buildingId}`)
      const data = res.data.data

      setFormData({
        center: data.center?._id || '',
        buildingName: data.buildingName || '',
        displayName: data.displayName || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        landmark: data.landmark || '',
        pincode: data.pincode || '',
      })
    } catch (error) {
      console.error('Error fetching building:', error)
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

  const handleCenterChange = (selected) => {
    handleChange({
      target: {
        name: 'center',
        value: selected ? selected.value : '',
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}

    ;['center', 'buildingName', 'displayName', 'address1'].forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required'
        }
      },
    )

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    try {
      if (id) {
        await axiosInstance.put(`/buildings/${id}`, formData)

        setAlert({
          type: 'success',
          message: 'Data updated successfully!',
        })
      } else {
        await axiosInstance.post('/buildings', formData)

        setAlert({
          type: 'success',
          message: 'Data added successfully!',
        })
      }

      setTimeout(() => {
        navigate('/building-list')
      }, 1500)
    } catch (error) {
      console.error('Error saving Data:', error)

      let message = 'Failed to save Data. Please try again!'

      if (error.response) {
        const data = error.response.data

        if (data.errors && Array.isArray(data.errors)) {
          message = data.errors.join(', ')
        } else {
          message = data.message || data.error || message
        }
      } else if (error.request) {
        message =
          'No response from server. Please check your connection.'
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
      center: '',
      buildingName: '',
      displayName: '',
      address1: '',
      address2: '',
      landmark: '',
      pincode: '',
    })

    setErrors({})
    setAlert({
      type: '',
      message: '',
    })
  }

  const selectedCenter =
    centers.find((center) => center._id === formData.center) || null

  const inputClass = (field) => {
    if (errors[field]) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500'
    }

    if (formData[field]) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500'
    }

    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }

  return (
    <div className="w-full">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">
          Building {id ? 'Edit' : 'Add'}
        </h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          {alert.message && (
            <div
              className={`mb-5 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
                alert.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {alert.type === 'success' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                <span>{alert.message}</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAlert({
                    type: '',
                    message: '',
                  })
                }
                className="ml-4 text-current opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="center"
                  className={`mb-1.5 block text-sm font-medium ${
                    errors.center
                      ? 'text-red-600'
                      : formData.center
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Branch <span className="text-red-500">*</span>
                </label>

                <Select
                  id="center"
                  name="center"
                  value={
                    selectedCenter
                      ? {
                          label: selectedCenter.centerName,
                          value: selectedCenter._id,
                        }
                      : null
                  }
                  onChange={handleCenterChange}
                  options={centers.map((center) => ({
                    label: center.centerName,
                    value: center._id,
                  }))}
                  placeholder="Select Branch"
                  isClearable
                  classNamePrefix="building-select"
                />

                {errors.center && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.center}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="buildingName"
                  className={`mb-1.5 block text-sm font-medium ${
                    errors.buildingName
                      ? 'text-red-600'
                      : formData.buildingName
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Building Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="buildingName"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleChange}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${inputClass(
                    'buildingName',
                  )}`}
                />

                {errors.buildingName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.buildingName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="displayName"
                  className={`mb-1.5 block text-sm font-medium ${
                    errors.displayName
                      ? 'text-red-600'
                      : formData.displayName
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Display Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${inputClass(
                    'displayName',
                  )}`}
                />

                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.displayName}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="address1"
                  className={`mb-1.5 block text-sm font-medium ${
                    errors.address1
                      ? 'text-red-600'
                      : formData.address1
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Address Line 1 <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${inputClass(
                    'address1',
                  )}`}
                />

                {errors.address1 && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address1}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address2"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Address Line 2
                </label>

                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="landmark"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Landmark
                </label>

                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="pincode"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Pincode
                </label>

                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div />
              <div />
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                type="submit"
                className="rounded-md bg-[#2759A2] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1f4b8c]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBuilding