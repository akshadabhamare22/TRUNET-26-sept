import { useContext } from 'react'

import { AuthContext } from '../context/AuthContext'

const usePermission = () => {
    const {
        permissions,
        isSuperAdmin,
    } = useContext(AuthContext)

    const hasPermission = (
        module,
        permission,
    ) => {
        if (isSuperAdmin) {
            return true
        }

        const moduleObj = permissions.find(
            (item) => item.module === module,
        )

        if (!moduleObj) {
            return false
        }

        return moduleObj.permissions.includes(
            permission,
        )
    }

    const hasAnyPermission = (
        module,
        permissionsList = [],
    ) => {
        if (isSuperAdmin) {
            return true
        }

        const moduleObj = permissions.find(
            (item) => item.module === module,
        )

        if (!moduleObj) {
            return false
        }

        return permissionsList.some(
            (permission) =>
            moduleObj.permissions.includes(
                permission,
            ),
        )
    }

    return {
        hasPermission,
        hasAnyPermission,
        isSuperAdmin,
    }
}

export default usePermission