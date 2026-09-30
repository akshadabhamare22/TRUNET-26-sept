import axiosInstance from '../axiosInstance'

export const getCustomers = async (params = {}) => {
  const query = new URLSearchParams(params).toString()

  const response = await axiosInstance.get(
    `/customers?${query}`,
  )

  return response.data
}

export const deleteCustomer = async (id) => {
  return await axiosInstance.delete(`/customers/${id}`)
}