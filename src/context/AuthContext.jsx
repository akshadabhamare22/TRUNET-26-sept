

// import React, { createContext, useCallback, useEffect, useState } from 'react'
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

//   const fetchUser = useCallback(async () => {
//     const token = localStorage.getItem('token')

//     if (!token || token === 'null' || token === 'undefined') {
//       setUser(null)
//       setPermissions([])
//       setIsSuperAdmin(false)
//       setHasMissedSubmission(false)
//       return
//     }

//     try {
//       const res = await axiosInstance.get('/auth/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const userData = res.data?.data?.user
//       if (!userData) throw new Error('The /auth/me response does not contain a user.')

//       const userPermissions = userData.permissions || []
//       const isSuperAdminUser = Boolean(userData.isSuperAdmin) ||
//         userData.role?.roleTitle?.toLowerCase() === 'superadmin'

//       setUser(userData)
//       setPermissions(userPermissions)
//       setIsSuperAdmin(isSuperAdminUser)
//       localStorage.setItem('permissions', JSON.stringify(userPermissions))
//       localStorage.setItem('userInfo', JSON.stringify({ ...userData, isSuperAdmin: isSuperAdminUser }))
//       localStorage.setItem('userCenter', JSON.stringify(userData.center || {}))

//       if (!isSuperAdminUser && userData.center) {
//         await checkReportSubmissionStatus()
//         setHasMissedSubmission(localStorage.getItem('hasMissedReportSubmission') === 'true')
//       } else {
//         localStorage.setItem('hasMissedReportSubmission', 'false')
//         setHasMissedSubmission(false)
//       }
//     } catch (err) {
//       const status = err?.response?.status
//       const message = err?.response?.data?.message

//       if (status === 401) {
//         for (const key of ['token', 'tempToken', 'user', 'userInfo', 'permissions', 'userCenter']) {
//           localStorage.removeItem(key)
//         }
//         setUser(null)
//         setPermissions([])
//         setIsSuperAdmin(false)
//         showError(message || 'Your session is invalid. Please log in again.')
//         window.location.href = '/auth/login'
//         return
//       }

//       if (status === 403 && message === 'Your account has been disabled. Please contact administrator.') {
//         localStorage.removeItem('token')
//         setUser(null)
//         setPermissions([])
//         setIsSuperAdmin(false)
//         showError(message)
//         window.location.href = '/auth/login'
//         return
//       }

//       console.error('Error fetching user info:', message || err.message)
//     }
//   }, [])

//   const refreshPermissions = useCallback(async () => fetchUser(), [fetchUser])

//   const refreshReportStatus = useCallback(async () => {
//     if (!isSuperAdmin && user?.center) {
//       await checkReportSubmissionStatus()
//       setHasMissedSubmission(localStorage.getItem('hasMissedReportSubmission') === 'true')
//     }
//   }, [isSuperAdmin, user])

//   useEffect(() => { fetchUser() }, [fetchUser])

//   return (
//     <AuthContext.Provider value={{
//       user,
//       permissions,
//       isSuperAdmin,
//       hasMissedSubmission,
//       refreshPermissions,
//       refreshReportStatus,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// AuthProvider.propTypes = { children: PropTypes.node.isRequired }


import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import axiosInstance from '../axiosInstance'
import { showError } from '../utils/sweetAlerts'
import { checkReportSubmissionStatus } from '../utils/checkReportStatus'

export const AuthContext = createContext()

const REPORT_STATUS_POLL_MS = 60 * 1000

// New backend sends permissions inside user.role.permissions.
// Old shape (user.permissions) is still supported.
const extractPermissions = (userData) => {
  const source = Array.isArray(userData?.permissions) && userData.permissions.length > 0
    ? userData.permissions
    : userData?.role?.permissions

  if (!Array.isArray(source)) return []

  return source.map((item) => ({
    module: item.module,
    permissions: Array.isArray(item.permissions) ? item.permissions : [],
  }))
}

const clearSession = (keys) => {
  for (const key of keys) localStorage.removeItem(key)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [hasMissedSubmission, setHasMissedSubmission] = useState(false)

  // Keep latest values for the polling callback without re-creating timers
  const stateRef = useRef({ isSuperAdmin: false, hasCenter: false })

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token || token === 'null' || token === 'undefined') {
      setUser(null)
      setPermissions([])
      setIsSuperAdmin(false)
      setHasMissedSubmission(false)
      stateRef.current = { isSuperAdmin: false, hasCenter: false }
      return
    }

    try {
      const res = await axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userData = res.data?.data?.user
      if (!userData) throw new Error('The /auth/me response does not contain a user.')

      const userPermissions = extractPermissions(userData)
      const isSuperAdminUser =
        Boolean(userData.isSuperAdmin) ||
        userData.role?.roleTitle?.toLowerCase() === 'superadmin'

      // Write localStorage first: _nav.jsx reads these values while rendering
      localStorage.setItem('permissions', JSON.stringify(userPermissions))
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ ...userData, permissions: userPermissions, isSuperAdmin: isSuperAdminUser }),
      )
      localStorage.setItem('userCenter', JSON.stringify(userData.center || {}))

      if (!isSuperAdminUser && userData.center) {
        await checkReportSubmissionStatus()
      } else {
        localStorage.setItem('hasMissedReportSubmission', 'false')
      }
      const missed = localStorage.getItem('hasMissedReportSubmission') === 'true'

      stateRef.current = { isSuperAdmin: isSuperAdminUser, hasCenter: Boolean(userData.center) }

      setUser(userData)
      setPermissions(userPermissions)
      setIsSuperAdmin(isSuperAdminUser)
      setHasMissedSubmission(missed)
    } catch (err) {
      const status = err?.response?.status
      const message = err?.response?.data?.message

      if (status === 401) {
        clearSession(['token', 'tempToken', 'user', 'userInfo', 'permissions', 'userCenter'])
        setUser(null)
        setPermissions([])
        setIsSuperAdmin(false)
        showError(message || 'Your session is invalid. Please log in again.')
        window.location.href = '/auth/login'
        return
      }

      if (status === 403 && message === 'Your account has been disabled. Please contact administrator.') {
        clearSession(['token'])
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

  // Re-check approval status (used after superadmin approves the report)
  const refreshReportStatus = useCallback(async () => {
    const { isSuperAdmin: superAdmin, hasCenter } = stateRef.current
    if (superAdmin || !hasCenter) return

    await checkReportSubmissionStatus()
    setHasMissedSubmission(localStorage.getItem('hasMissedReportSubmission') === 'true')
  }, [])

  // Initial load
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Sync when checkReportStatus.jsx dispatches its event
  useEffect(() => {
    const onStatusChanged = (e) => {
      if (typeof e.detail?.hasMissed === 'boolean') {
        setHasMissedSubmission(e.detail.hasMissed)
      }
    }
    window.addEventListener('reportStatusChanged', onStatusChanged)
    return () => window.removeEventListener('reportStatusChanged', onStatusChanged)
  }, [])

  // Poll + refresh on tab focus, so approval shows up without logout/reload
  useEffect(() => {
    if (!user || isSuperAdmin || !user.center) return undefined

    const interval = setInterval(refreshReportStatus, REPORT_STATUS_POLL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshReportStatus()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [user, isSuperAdmin, refreshReportStatus])

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isSuperAdmin,
        hasMissedSubmission,
        refreshPermissions,
        refreshReportStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired }