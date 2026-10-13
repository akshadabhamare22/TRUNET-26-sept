// import React, {
//   createContext,
//   useEffect,
//   useState,
// } from 'react'
// import PropTypes from 'prop-types'

// import axiosInstance from '../axiosInstance'
// import { showError } from '../utils/sweetAlerts'
// import { checkReportSubmissionStatus } from '../utils/checkReportStatus'

// export const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [permissions, setPermissions] = useState([])
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false)
//   const [hasMissedSubmission, setHasMissedSubmission] = useState(false)

//   const fetchUser = async () => {
//     try {
//       const res = await axiosInstance.get('/auth/me', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       })

//       const userData = res.data.data.user

//       // Check if user is superadmin
//       const isSuperAdminUser =
//         userData.isSuperAdmin ||
//         userData.role?.roleTitle?.toLowerCase() === 'superadmin'

//       setUser(userData)
//       setPermissions(userData.permissions)
//       setIsSuperAdmin(isSuperAdminUser)

//       // Store in localStorage for quick access
//       localStorage.setItem(
//         'permissions',
//         JSON.stringify(userData.permissions),
//       )

//       localStorage.setItem(
//         'userInfo',
//         JSON.stringify({
//           ...userData,
//           isSuperAdmin: isSuperAdminUser,
//         }),
//       )

//       localStorage.setItem(
//         'userCenter',
//         JSON.stringify(userData.center || {}),
//       )

//       // Check report submission status for non-superadmin users
//       if (!isSuperAdminUser && userData.center) {
//         await checkReportSubmissionStatus()

//         const missedStatus =
//           localStorage.getItem('hasMissedReportSubmission') === 'true'

//         setHasMissedSubmission(missedStatus)
//       } else {
//         localStorage.setItem(
//           'hasMissedReportSubmission',
//           'false',
//         )

//         setHasMissedSubmission(false)
//       }
//     } catch (err) {
//       const message = err?.response?.data?.message

//       if (
//         message ===
//         'Your token has expired. Please log in again.'
//       ) {
//         localStorage.clear()
//         showError(message)
//         window.location.href = '/auth/login'
//         return
//       }

//       if (
//         message ===
//         'Your account has been disabled. Please contact administrator.'
//       ) {
//         showError(message)
//         localStorage.clear()
//         window.location.href = '/auth/login'
//         return
//       }

//       console.error('Error fetching user info:', err)
//     }
//   }

//   const refreshPermissions = async () => {
//     await fetchUser()
//   }

//   const refreshReportStatus = async () => {
//     if (!isSuperAdmin && user?.center) {
//       await checkReportSubmissionStatus()

//       const missedStatus =
//         localStorage.getItem('hasMissedReportSubmission') === 'true'

//       setHasMissedSubmission(missedStatus)
//     }
//   }

//   useEffect(() => {
//     fetchUser()
//   }, [])

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         permissions,
//         isSuperAdmin,
//         hasMissedSubmission,
//         refreshPermissions,
//         refreshReportStatus,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// }


import React, { createContext, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import axiosInstance from '../axiosInstance'
import { showError } from '../utils/sweetAlerts'
import { checkReportSubmissionStatus } from '../utils/checkReportStatus'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [hasMissedSubmission, setHasMissedSubmission] = useState(false)

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token || token === 'null' || token === 'undefined') {
      setUser(null)
      setPermissions([])
      setIsSuperAdmin(false)
      setHasMissedSubmission(false)
      return
    }

    try {
      const res = await axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userData = res.data?.data?.user
      if (!userData) throw new Error('The /auth/me response does not contain a user.')

      const userPermissions = userData.permissions || []
      const isSuperAdminUser = Boolean(userData.isSuperAdmin) ||
        userData.role?.roleTitle?.toLowerCase() === 'superadmin'

      setUser(userData)
      setPermissions(userPermissions)
      setIsSuperAdmin(isSuperAdminUser)
      localStorage.setItem('permissions', JSON.stringify(userPermissions))
      localStorage.setItem('userInfo', JSON.stringify({ ...userData, isSuperAdmin: isSuperAdminUser }))
      localStorage.setItem('userCenter', JSON.stringify(userData.center || {}))

      if (!isSuperAdminUser && userData.center) {
        await checkReportSubmissionStatus()
        setHasMissedSubmission(localStorage.getItem('hasMissedReportSubmission') === 'true')
      } else {
        localStorage.setItem('hasMissedReportSubmission', 'false')
        setHasMissedSubmission(false)
      }
    } catch (err) {
      const status = err?.response?.status
      const message = err?.response?.data?.message

      if (status === 401) {
        for (const key of ['token', 'tempToken', 'user', 'userInfo', 'permissions', 'userCenter']) {
          localStorage.removeItem(key)
        }
        setUser(null)
        setPermissions([])
        setIsSuperAdmin(false)
        showError(message || 'Your session is invalid. Please log in again.')
        window.location.href = '/auth/login'
        return
      }

      if (status === 403 && message === 'Your account has been disabled. Please contact administrator.') {
        localStorage.removeItem('token')
        setUser(null)
        setPermissions([])
        setIsSuperAdmin(false)
        showError(message)
        window.location.href = '/auth/login'
        return
      }

      console.error('Error fetching user info:', message || err.message)
    }
  }, [])

  const refreshPermissions = useCallback(async () => fetchUser(), [fetchUser])

  const refreshReportStatus = useCallback(async () => {
    if (!isSuperAdmin && user?.center) {
      await checkReportSubmissionStatus()
      setHasMissedSubmission(localStorage.getItem('hasMissedReportSubmission') === 'true')
    }
  }, [isSuperAdmin, user])

  useEffect(() => { fetchUser() }, [fetchUser])

  return (
    <AuthContext.Provider value={{
      user,
      permissions,
      isSuperAdmin,
      hasMissedSubmission,
      refreshPermissions,
      refreshReportStatus,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired }
