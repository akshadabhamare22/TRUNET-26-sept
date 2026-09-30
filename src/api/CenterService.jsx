import axiosInstance from '../axiosInstance'

export const getCenters = async () => {
  const response = await axiosInstance.get('/centers')

  return response.data
}