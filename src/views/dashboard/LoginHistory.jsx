import React, {
  useEffect,
  useState,
} from 'react'

import axiosInstance from '../../axiosInstance'

const LoginHistory = () => {
  const [
    loginHistory,
    setLoginHistory,
  ] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    return date.toLocaleDateString(
      'en-GB',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
    )
  }

  const fetchLoginHistory =
    async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await axiosInstance.get(
            '/auth/login-history',
          )

        if (response.data.success) {
          setLoginHistory(
            response.data.data
              .loginHistory,
          )
        }
      } catch (err) {
        console.error(
          'Error fetching login history:',
          err,
        )

        setError(
          'Failed to load login history',
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchLoginHistory()
  }, [])

  /* Loading */
  if (loading) {
    return (
      <div
        className="
          mt-4
          pb-10
          transition-all
          duration-300
        "
      >
        <div
          className="
            rounded
            border-t-[3px]
            border-[#2759A2]
            bg-white
            p-8
            text-center
            text-sm
            text-gray-600
            shadow-sm
          "
        >
          Loading login history...
        </div>
      </div>
    )
  }

  /* Error */
  if (error) {
    return (
      <div
        className="
          mt-4
          pb-10
          transition-all
          duration-300
        "
      >
        <div
          className="
            rounded
            border-t-[3px]
            border-[#2759A2]
            bg-white
            p-8
            text-center
            text-sm
            text-red-500
            shadow-sm
          "
        >
          <div>{error}</div>

          <button
            type="button"
            onClick={
              fetchLoginHistory
            }
            className="
              mt-4
              rounded
              bg-[#2759A2]
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-[#1f4a89]
            "
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="
        mt-4
        pb-10
        transition-all
        duration-300
      "
    >
      <div
        className="
          overflow-hidden
          rounded
          border-t-[3px]
          border-[#2759A2]
          bg-white
          py-1
          shadow-sm
        "
      >
        {/* Header */}
        <h2
          className="
            mb-2
            px-3
            text-xl
            font-light
            text-[#444444]
          "
        >
          Login History
        </h2>

        {/* Table Container */}
        <div
          className="
            relative
            max-h-[400px]
            overflow-y-auto
            overflow-x-auto
          "
        >
          {loginHistory.length ===
          0 ? (
            <div
              className="
                p-8
                text-center
                text-sm
                text-gray-500
              "
            >
              No login history found
            </div>
          ) : (
            <table
              className="
                w-full
                table-fixed
                border-collapse
                text-sm
              "
            >
              <thead>
                <tr
                  className="
                    text-[#444444]
                    shadow-sm
                  "
                >
                  <th
                    className="
                      w-[18%]
                      px-3
                      py-2
                      text-left
                      font-semibold
                    "
                  >
                    Name
                  </th>

                  <th
                    className="
                      w-[18%]
                      px-3
                      py-2
                      text-left
                      font-semibold
                    "
                  >
                    Email
                  </th>

                  <th
                    className="
                      w-[20%]
                      px-3
                      py-2
                      text-left
                      font-semibold
                    "
                  >
                    Browser
                  </th>

                  <th
                    className="
                      w-[20%]
                      px-3
                      py-2
                      text-left
                      font-semibold
                    "
                  >
                    IP
                  </th>

                  <th
                    className="
                      w-[18%]
                      px-3
                      py-2
                      text-left
                      font-semibold
                    "
                  >
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {loginHistory.map(
                  (record, index) => {
                    const user =
                      record.user || {}

                    return (
                      <tr
                        key={index}
                        className="
                          text-[#444444]
                          transition-colors
                          duration-150
                          hover:bg-[#f7f7f7]
                        "
                      >
                        <td
                          className="
                            overflow-hidden
                            text-ellipsis
                            whitespace-nowrap
                            px-3
                            py-1
                          "
                        >
                          {user.fullName}
                        </td>

                        <td
                          className="
                            overflow-hidden
                            text-ellipsis
                            whitespace-nowrap
                            px-3
                            py-1
                          "
                        >
                          {user.email}
                        </td>

                        <td
                          className="
                            overflow-hidden
                            text-ellipsis
                            whitespace-nowrap
                            px-3
                            py-1
                          "
                        >
                          {record.browser}
                        </td>

                        <td
                          className="
                            overflow-hidden
                            text-ellipsis
                            whitespace-nowrap
                            px-3
                            py-1
                          "
                        >
                          {record.ip}
                        </td>

                        <td
                          className="
                            overflow-hidden
                            text-ellipsis
                            whitespace-nowrap
                            px-3
                            py-1
                          "
                        >
                          {formatDate(
                            record.date,
                          )}
                        </td>
                      </tr>
                    )
                  },
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginHistory