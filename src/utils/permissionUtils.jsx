export const getUserPermissions = () => {
  return (
    JSON.parse(
      localStorage.getItem('userPermissions'),
    ) || []
  )
}

export const hasPermission = (
  moduleName,
  action,
) => {
  const userPermissions =
    getUserPermissions()

  return userPermissions.some(
    (permission) =>
      permission.module === moduleName &&
      permission.action === action,
  )
}