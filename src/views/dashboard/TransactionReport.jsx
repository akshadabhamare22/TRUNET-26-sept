import React, {
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import axiosInstance from '../../axiosInstance'

const TransactionReport = ({
  onNotificationClick,
}) => {
  const [
    transactions,
    setTransactions,
  ] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [summary, setSummary] =
    useState(null)

  const [error, setError] =
    useState('')

  const [
    notifications,
    setNotifications,
  ] = useState([])

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactions =
      async () => {
        try {
          const res =
            await axiosInstance.get(
              '/availableStock/transactions',
            )

          if (res.data.success) {
            setTransactions(
              res.data.data || [],
            )

            setSummary(
              res.data.summary || null,
            )
          } else {
            setError(
              'Failed to load data.',
            )
          }
        } catch (err) {
          console.error(err)

          setError(
            'Error fetching transaction data.',
          )
        } finally {
          setLoading(false)
        }
      }

    const fetchNotifications =
      async () => {
        try {
          const res =
            await axiosInstance.get(
              '/stockrequest/notifications',
            )

          if (res.data.success) {
            setNotifications(
              res.data.data || [],
            )
          } else {
            console.error(
              'Failed to load notifications',
            )
          }
        } catch (err) {
          console.error(
            'Error fetching notifications:',
            err,
          )
        } finally {
          setNotificationsLoading(
            false,
          )
        }
      }

    fetchTransactions()
    fetchNotifications()
  }, [])

  const handleNotificationClick = (
    notification,
  ) => {
    if (notification.stockRequestId) {
      navigate(
        `/stockRequest-profile/${notification.stockRequestId}`,
      )
    }

    if (onNotificationClick) {
      const parts =
        notification.message.split(
          ' - ',
        )

      const notificationData = {
        message: parts[0],
        date: parts[1],

        type: notification.message.includes(
          'Approved',
        )
          ? 'Approval'
          : notification.message.includes(
                'Rejected',
              )
            ? 'Rejection'
            : notification.message.includes(
                  'Completed',
                )
              ? 'Completion'
              : 'Update',
      }

      onNotificationClick(
        notificationData,
      )
    }
  }

  return (
    <div
      className="
        mt-4
        grid
        grid-cols-1
        gap-4
        transition-all
        duration-300
        lg:grid-cols-2
      "
    >
      {/* Transaction Report */}
      <div
        className="
          overflow-hidden
          rounded
          border-t-[3px]
          border-[#2759A2]
          bg-white
          p-1
          shadow-sm
        "
      >
        <h2
          className="
            mb-2
            px-3
            text-xl
            font-light
            text-[#444444]
          "
        >
          Transaction Report
        </h2>

        {loading ? (
          <p
            className="
              px-4
              py-2
              text-sm
              text-gray-600
            "
          >
            Loading...
          </p>
        ) : error ? (
          <p
            className="
              px-4
              py-2
              text-sm
              text-red-500
            "
          >
            {error}
          </p>
        ) : (
          <div className="relative">
            <div
              className="
                max-h-[250px]
                overflow-y-auto
                overflow-x-auto
              "
            >
              <table
                className="
                  w-full
                  border-collapse
                  text-sm
                "
              >
                <thead>
                  <tr>
                    <th
                      className="
                        sticky
                        top-0
                        z-10
                        border-b
                        border-gray-300
                        bg-white
                        px-3
                        py-1
                        text-left
                        font-bold
                        text-[#444444]
                      "
                    >
                      Date
                    </th>

                    <th
                      className="
                        sticky
                        top-0
                        z-10
                        border-b
                        border-gray-300
                        bg-white
                        px-3
                        py-1
                        text-left
                        font-bold
                        text-[#444444]
                      "
                    >
                      Type
                    </th>

                    <th
                      className="
                        sticky
                        top-0
                        z-10
                        border-b
                        border-gray-300
                        bg-white
                        px-3
                        py-1
                        text-left
                        font-bold
                        text-[#444444]
                      "
                    >
                      Center
                    </th>

                    <th
                      className="
                        sticky
                        top-0
                        z-10
                        border-b
                        border-gray-300
                        bg-white
                        px-3
                        py-1
                        text-left
                        font-bold
                        text-[#444444]
                      "
                    >
                      Parent Center
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.length >
                  0 ? (
                    transactions.map(
                      (
                        transaction,
                        index,
                      ) => (
                        <tr
                          key={
                            transaction._id ||
                            index
                          }
                          className="
                            transition-colors
                            hover:bg-gray-50
                          "
                        >
                          <td
                            className="
                              px-3
                              py-1
                              text-[#444444]
                              shadow-[0_1px_1px_rgba(0,0,0,0.03)]
                            "
                          >
                            {
                              transaction.Date
                            }
                          </td>

                          <td
                            className="
                              px-3
                              py-1
                              text-[#444444]
                              shadow-[0_1px_1px_rgba(0,0,0,0.03)]
                            "
                          >
                            {
                              transaction.Type
                            }
                          </td>

                          <td
                            className="
                              px-3
                              py-1
                              text-[#444444]
                              shadow-[0_1px_1px_rgba(0,0,0,0.03)]
                            "
                          >
                            {
                              transaction.Center
                            }
                          </td>

                          <td
                            className="
                              px-3
                              py-1
                              text-[#444444]
                              shadow-[0_1px_1px_rgba(0,0,0,0.03)]
                            "
                          />
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="
                          px-3
                          py-4
                          text-center
                          text-sm
                          text-[#444444]
                        "
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Last Notification */}
      <div
        className="
          overflow-hidden
          rounded
          border-t-[3px]
          border-[#2759A2]
          bg-white
          px-3
          py-1
          shadow-sm
        "
      >
        <h2
          className="
            mb-2
            px-0
            text-xl
            font-light
            text-[#444444]
          "
        >
          Last Notification
        </h2>

        <ul
          className="
            m-0
            max-h-[240px]
            list-none
            overflow-y-auto
            p-0
            text-sm
            text-[#3c8dbc]
          "
        >
          {notificationsLoading ? (
            <li
              className="
                px-3
                py-2
                italic
                text-gray-500
              "
            >
              Loading notifications...
            </li>
          ) : notifications.length >
            0 ? (
            notifications.map(
              (
                notification,
                index,
              ) => (
                <li
                  key={
                    notification.id ||
                    index
                  }
                  onClick={() =>
                    handleNotificationClick(
                      notification,
                    )
                  }
                  className="
                    cursor-pointer
                    border-b
                    border-[#f0f0f0]
                    px-0
                    py-1
                    text-[#3c8dbc]
                    shadow-[0_1px_1px_rgba(0,0,0,0.05)]
                    transition-colors
                    duration-200
                    hover:bg-[#f4f4f4]
                  "
                >
                  {notification.message}
                </li>
              ),
            )
          ) : (
            <li
              className="
                px-3
                py-2
                italic
                text-gray-500
              "
            >
              No recent notifications
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

TransactionReport.propTypes = {
  onNotificationClick:
    PropTypes.func,
}

TransactionReport.defaultProps = {
  onNotificationClick: () => {},
}

export default TransactionReport