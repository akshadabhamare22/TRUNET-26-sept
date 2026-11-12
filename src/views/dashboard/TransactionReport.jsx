// import React, { 
//   useEffect,
//   useState,
// } from 'react'
// import PropTypes from 'prop-types'
// import { useNavigate } from 'react-router-dom'

// import axiosInstance from '../../axiosInstance'

// const TransactionReport = ({
//   onNotificationClick,
// }) => {
//   const [
//     transactions,
//     setTransactions,
//   ] = useState([])

//   const [loading, setLoading] =
//     useState(true)

//   const [summary, setSummary] =
//     useState(null)

//   const [error, setError] =
//     useState('')

//   const [
//     notifications,
//     setNotifications,
//   ] = useState([])

//   const [
//     notificationsLoading,
//     setNotificationsLoading,
//   ] = useState(true)

//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchTransactions =
//       async () => {
//         try {
//           const res =
//             await axiosInstance.get(
//               '/availableStock/transactions',
//             )

//           if (res.data.success) {
//             setTransactions(
//               res.data.data || [],
//             )

//             setSummary(
//               res.data.summary || null,
//             )
//           } else {
//             setError(
//               'Failed to load data.',
//             )
//           }
//         } catch (err) {
//           console.error(err)

//           setError(
//             'Error fetching transaction data.',
//           )
//         } finally {
//           setLoading(false)
//         }
//       }

//     const fetchNotifications =
//       async () => {
//         try {
//           const res =
//             await axiosInstance.get(
//               '/stockrequest/notifications',
//             )

//           if (res.data.success) {
//             setNotifications(
//               res.data.data || [],
//             )
//           } else {
//             console.error(
//               'Failed to load notifications',
//             )
//           }
//         } catch (err) {
//           console.error(
//             'Error fetching notifications:',
//             err,
//           )
//         } finally {
//           setNotificationsLoading(
//             false,
//           )
//         }
//       }

//     fetchTransactions()
//     fetchNotifications()
//   }, [])

//   const handleNotificationClick = (
//     notification,
//   ) => {
//     if (notification.stockRequestId) {
//       navigate(
//         `/stockRequest-profile/${notification.stockRequestId}`,
//       )
//     }

//     if (onNotificationClick) {
//       const parts =
//         notification.message.split(
//           ' - ',
//         )

//       const notificationData = {
//         message: parts[0],
//         date: parts[1],

//         type: notification.message.includes(
//           'Approved',
//         )
//           ? 'Approval'
//           : notification.message.includes(
//                 'Rejected',
//               )
//             ? 'Rejection'
//             : notification.message.includes(
//                   'Completed',
//                 )
//               ? 'Completion'
//               : 'Update',
//       }

//       onNotificationClick(
//         notificationData,
//       )
//     }
//   }

//   return (
//     <div
//       className="
//         mt-4
//         grid
//         grid-cols-1
//         gap-4
//         transition-all
//         duration-300
//         lg:grid-cols-2
//       "
//     >
//       {/* Transaction Report */}
//       <div
//         className="
//           overflow-hidden
//           rounded
//           border-t-[3px]
//           border-[#2759A2]
//           bg-white
//           p-1
//           shadow-sm
//         "
//       >
//         <h2
//           className="
//             mb-2
//             px-3
//             text-xl
//             font-light
//             text-[#444444]
//           "
//         >
//           Transaction Report
//         </h2>

//         {loading ? (
//           <p
//             className="
//               px-4
//               py-2
//               text-sm
//               text-gray-600
//             "
//           >
//             Loading...
//           </p>
//         ) : error ? (
//           <p
//             className="
//               px-4
//               py-2
//               text-sm
//               text-red-500
//             "
//           >
//             {error}
//           </p>
//         ) : (
//           <div className="relative">
//             <div
//               className="
//                 max-h-[250px]
//                 overflow-y-auto
//                 overflow-x-auto
//               "
//             >
//               <table
//                 className="
//                   w-full
//                   border-collapse
//                   text-sm
//                 "
//               >
//                 <thead>
//                   <tr>
//                     <th
//                       className="
//                         sticky
//                         top-0
//                         z-10
//                         border-b
//                         border-gray-300
//                         bg-white
//                         px-3
//                         py-1
//                         text-left
//                         font-bold
//                         text-[#444444]
//                       "
//                     >
//                       Date
//                     </th>

//                     <th
//                       className="
//                         sticky
//                         top-0
//                         z-10
//                         border-b
//                         border-gray-300
//                         bg-white
//                         px-3
//                         py-1
//                         text-left
//                         font-bold
//                         text-[#444444]
//                       "
//                     >
//                       Type
//                     </th>

//                     <th
//                       className="
//                         sticky
//                         top-0
//                         z-10
//                         border-b
//                         border-gray-300
//                         bg-white
//                         px-3
//                         py-1
//                         text-left
//                         font-bold
//                         text-[#444444]
//                       "
//                     >
//                       Center
//                     </th>

//                     <th
//                       className="
//                         sticky
//                         top-0
//                         z-10
//                         border-b
//                         border-gray-300
//                         bg-white
//                         px-3
//                         py-1
//                         text-left
//                         font-bold
//                         text-[#444444]
//                       "
//                     >
//                       Parent Center
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {transactions.length >
//                   0 ? (
//                     transactions.map(
//                       (
//                         transaction,
//                         index,
//                       ) => (
//                         <tr
//                           key={
//                             transaction._id ||
//                             index
//                           }
//                           className="
//                             transition-colors
//                             hover:bg-gray-50
//                           "
//                         >
//                           <td
//                             className="
//                               px-3
//                               py-1
//                               text-[#444444]
//                               shadow-[0_1px_1px_rgba(0,0,0,0.03)]
//                             "
//                           >
//                             {
//                               transaction.Date
//                             }
//                           </td>

//                           <td
//                             className="
//                               px-3
//                               py-1
//                               text-[#444444]
//                               shadow-[0_1px_1px_rgba(0,0,0,0.03)]
//                             "
//                           >
//                             {
//                               transaction.Type
//                             }
//                           </td>

//                           <td
//                             className="
//                               px-3
//                               py-1
//                               text-[#444444]
//                               shadow-[0_1px_1px_rgba(0,0,0,0.03)]
//                             "
//                           >
//                             {
//                               transaction.Center
//                             }
//                           </td>

//                           <td
//                             className="
//                               px-3
//                               py-1
//                               text-[#444444]
//                               shadow-[0_1px_1px_rgba(0,0,0,0.03)]
//                             "
//                           >
//                             {transaction[
//                               'Parent Branch'
//                             ] || '-'}
//                           </td>
//                         </tr>
//                       ),
//                     )
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="
//                           px-3
//                           py-4
//                           text-center
//                           text-sm
//                           text-[#444444]
//                         "
//                       >
//                         No records found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Last Notification */}
//       <div
//         className="
//           overflow-hidden
//           rounded
//           border-t-[3px]
//           border-[#2759A2]
//           bg-white
//           px-3
//           py-1
//           shadow-sm
//         "
//       >
//         <h2
//           className="
//             mb-2
//             px-0
//             text-xl
//             font-light
//             text-[#444444]
//           "
//         >
//           Last Notification
//         </h2>

//         <ul
//           className="
//             m-0
//             max-h-[240px]
//             list-none
//             overflow-y-auto
//             p-0
//             text-sm
//             text-[#3c8dbc]
//           "
//         >
//           {notificationsLoading ? (
//             <li
//               className="
//                 px-3
//                 py-2
//                 italic
//                 text-gray-500
//               "
//             >
//               Loading notifications...
//             </li>
//           ) : notifications.length >
//             0 ? (
//             notifications.map(
//               (
//                 notification,
//                 index,
//               ) => (
//                 <li
//                   key={
//                     notification.id ||
//                     index
//                   }
//                   onClick={() =>
//                     handleNotificationClick(
//                       notification,
//                     )
//                   }
//                   className="
//                     cursor-pointer
//                     border-b
//                     border-[#f0f0f0]
//                     px-0
//                     py-1
//                     text-[#3c8dbc]
//                     shadow-[0_1px_1px_rgba(0,0,0,0.05)]
//                     transition-colors
//                     duration-200
//                     hover:bg-[#f4f4f4]
//                   "
//                 >
//                   {notification.message}
//                 </li>
//               ),
//             )
//           ) : (
//             <li
//               className="
//                 px-3
//                 py-2
//                 italic
//                 text-gray-500
//               "
//             >
//               No recent notifications
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   )
// }

// TransactionReport.propTypes = {
//   onNotificationClick:
//     PropTypes.func,
// }

// TransactionReport.defaultProps = {
//   onNotificationClick: () => {},
// }

// export default TransactionReport

import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import { Panel, Donut, COLORS } from './Dashboardshared'

const TransactionReport = ({ onNotificationClick }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] =
    useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get(
          '/availableStock/transactions',
        )

        if (res.data.success) {
          setTransactions(res.data.data || [])
          setSummary(res.data.summary || null)
        } else {
          setError('Failed to load data.')
        }
      } catch (err) {
        console.error(err)
        setError('Error fetching transaction data.')
      } finally {
        setLoading(false)
      }
    }

    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get(
          '/stockrequest/notifications',
        )

        if (res.data.success) {
          setNotifications(res.data.data || [])
        } else {
          console.error('Failed to load notifications')
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
      } finally {
        setNotificationsLoading(false)
      }
    }

    fetchTransactions()
    fetchNotifications()
  }, [])

  /* Chart data derived from the transactions already loaded */
  const typeStats = useMemo(() => {
    const counts = {}
    transactions.forEach((t) => {
      const key = t.Type || 'Other'
      counts[key] = (counts[key] || 0) + 1
    })
    const labels = Object.keys(counts)
    return {
      labels,
      values: labels.map((l) => counts[l]),
      colorOf: (type) =>
        COLORS[Math.max(labels.indexOf(type || 'Other'), 0) % COLORS.length],
    }
  }, [transactions])

  const handleNotificationClick = (notification) => {
    if (notification.stockRequestId) {
      navigate(`/stockRequest-profile/${notification.stockRequestId}`)
    }

    if (onNotificationClick) {
      const parts = notification.message.split(' - ')

      onNotificationClick({
        message: parts[0],
        date: parts[1],
        type: notification.message.includes('Approved')
          ? 'Approval'
          : notification.message.includes('Rejected')
            ? 'Rejection'
            : notification.message.includes('Completed')
              ? 'Completion'
              : 'Update',
      })
    }
  }

  const th =
    'sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-xs font-semibold text-slate-600'
  const td = 'px-4 py-2.5 text-slate-700'

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Transaction Report */}
      <Panel title="Transaction Report" className="overflow-hidden lg:col-span-2">
        {loading ? (
          <p className="px-5 py-4 text-sm text-slate-500">Loading...</p>
        ) : error ? (
          <p className="px-5 py-4 text-sm text-red-500">{error}</p>
        ) : (
          <div className="mt-3 max-h-[300px] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={th}>Date</th>
                  <th className={th}>Type</th>
                  <th className={th}>Center</th>
                  <th className={th}>Parent Center</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr
                      key={transaction._id || index}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className={`${td} whitespace-nowrap`}>
                        {transaction.Date}
                      </td>
                      <td className={td}>
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${typeStats.colorOf(transaction.Type)}1A`,
                            color: typeStats.colorOf(transaction.Type),
                          }}
                        >
                          {transaction.Type}
                        </span>
                      </td>
                      <td className={td}>{transaction.Center}</td>
                      <td className={td}>
                        {transaction['Parent Branch'] || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Transactions by type (pie) */}
      <Panel title="Transactions by Type">
        {loading ? (
          <p className="px-5 py-4 text-sm text-slate-500">Loading...</p>
        ) : (
          <div className="pt-3">
            <Donut
              labels={typeStats.labels}
              values={typeStats.values}
              cutout="0%"
              height={300}
            />
          </div>
        )}
      </Panel>

      {/* Last Notification */}
      <Panel title="Last Notification" className="overflow-hidden lg:col-span-3">
        <ul className="m-0 mt-2 max-h-[260px] list-none divide-y divide-slate-100 overflow-y-auto p-0 pb-2 text-sm">
          {notificationsLoading ? (
            <li className="px-5 py-3 italic text-slate-500">
              Loading notifications...
            </li>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li key={notification.id || index}>
                <button
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-[#3c8dbc] transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2759A2]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2759A2]/10 text-[#2759A2]">
                    <Bell size={15} />
                  </span>
                  {notification.message}
                </button>
              </li>
            ))
          ) : (
            <li className="px-5 py-3 italic text-slate-500">
              No recent notifications
            </li>
          )}
        </ul>
      </Panel>
    </div>
  )
}

TransactionReport.propTypes = {
  onNotificationClick: PropTypes.func,
}

TransactionReport.defaultProps = {
  onNotificationClick: () => {},
}

export default TransactionReport