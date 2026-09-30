import axiosInstance from '../axiosInstance'

export const getBuildings = async(params = {}) => {
    const query = new URLSearchParams(params).toString()

    const response = await axiosInstance.get(
        `/buildings?${query}`,
    )

    return response.data
}

export const deleteBuilding = async(id) => {
    return await axiosInstance.delete(`/buildings/${id}`)
}