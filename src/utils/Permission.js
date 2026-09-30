export const hasPermission = (
    permissions,
    module,
    requiredPermissions = [],
) => {
    const modulePermissions = permissions.find(
        (permission) =>
        permission.module === module,
    )

    if (!modulePermissions) {
        return false
    }

    return requiredPermissions.some(
        (permission) =>
        modulePermissions.permissions.includes(
            permission,
        ),
    )
}