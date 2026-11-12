// import React, {
//   useEffect,
//   useState,
// } from 'react'

// import axiosInstance from '../../axiosInstance'

// const LoginHistory = () => {
//   const [
//     loginHistory,
//     setLoginHistory,
//   ] = useState([])

//   const [loading, setLoading] =
//     useState(true)

//   const [error, setError] =
//     useState('')

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)

//     return date.toLocaleDateString(
//       'en-GB',
//       {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric',
//       },
//     )
//   }

//   const fetchLoginHistory =
//     async () => {
//       try {
//         setLoading(true)
//         setError('')

//         const response =
//           await axiosInstance.get(
//             '/auth/login-history',
//           )

//         if (response.data.success) {
//           setLoginHistory(
//             response.data.data
//               .loginHistory,
//           )
//         }
//       } catch (err) {
//         console.error(
//           'Error fetching login history:',
//           err,
//         )

//         setError(
//           'Failed to load login history',
//         )
//       } finally {
//         setLoading(false)
//       }
//     }

//   useEffect(() => {
//     fetchLoginHistory()
//   }, [])

//   /* Loading */
//   if (loading) {
//     return (
//       <div
//         className="
//           mt-4
//           pb-10
//           transition-all
//           duration-300
//         "
//       >
//         <div
//           className="
//             rounded
//             border-t-[3px]
//             border-[#2759A2]
//             bg-white
//             p-8
//             text-center
//             text-sm
//             text-gray-600
//             shadow-sm
//           "
//         >
//           Loading login history...
//         </div>
//       </div>
//     )
//   }

//   /* Error */
//   if (error) {
//     return (
//       <div
//         className="
//           mt-4
//           pb-10
//           transition-all
//           duration-300
//         "
//       >
//         <div
//           className="
//             rounded
//             border-t-[3px]
//             border-[#2759A2]
//             bg-white
//             p-8
//             text-center
//             text-sm
//             text-red-500
//             shadow-sm
//           "
//         >
//           <div>{error}</div>

//           <button
//             type="button"
//             onClick={
//               fetchLoginHistory
//             }
//             className="
//               mt-4
//               rounded
//               bg-[#2759A2]
//               px-4
//               py-2
//               text-sm
//               font-medium
//               text-white
//               transition-colors
//               hover:bg-[#1f4a89]
//             "
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div
//       className="
//         mt-4
//         pb-10
//         transition-all
//         duration-300
//       "
//     >
//       <div
//         className="
//           overflow-hidden
//           rounded
//           border-t-[3px]
//           border-[#2759A2]
//           bg-white
//           py-1
//           shadow-sm
//         "
//       >
//         {/* Header */}
//         <h2
//           className="
//             mb-2
//             px-3
//             text-xl
//             font-light
//             text-[#444444]
//           "
//         >
//           Login History
//         </h2>

//         {/* Table Container */}
//         <div
//           className="
//             relative
//             max-h-[400px]
//             overflow-y-auto
//             overflow-x-auto
//           "
//         >
//           {loginHistory.length ===
//           0 ? (
//             <div
//               className="
//                 p-8
//                 text-center
//                 text-sm
//                 text-gray-500
//               "
//             >
//               No login history found
//             </div>
//           ) : (
//             <table
//               className="
//                 w-full
//                 table-fixed
//                 border-collapse
//                 text-sm
//               "
//             >
//               <thead>
//                 <tr
//                   className="
//                     text-[#444444]
//                     shadow-sm
//                   "
//                 >
//                   <th
//                     className="
//                       w-[18%]
//                       px-3
//                       py-2
//                       text-left
//                       font-semibold
//                     "
//                   >
//                     Name
//                   </th>

//                   <th
//                     className="
//                       w-[18%]
//                       px-3
//                       py-2
//                       text-left
//                       font-semibold
//                     "
//                   >
//                     Email
//                   </th>

//                   <th
//                     className="
//                       w-[20%]
//                       px-3
//                       py-2
//                       text-left
//                       font-semibold
//                     "
//                   >
//                     Browser
//                   </th>

//                   <th
//                     className="
//                       w-[20%]
//                       px-3
//                       py-2
//                       text-left
//                       font-semibold
//                     "
//                   >
//                     IP
//                   </th>

//                   <th
//                     className="
//                       w-[18%]
//                       px-3
//                       py-2
//                       text-left
//                       font-semibold
//                     "
//                   >
//                     Date
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loginHistory.map(
//                   (record, index) => {
//                     const user =
//                       record.user || {}

//                     return (
//                       <tr
//                         key={index}
//                         className="
//                           text-[#444444]
//                           transition-colors
//                           duration-150
//                           hover:bg-[#f7f7f7]
//                         "
//                       >
//                         <td
//                           className="
//                             overflow-hidden
//                             text-ellipsis
//                             whitespace-nowrap
//                             px-3
//                             py-1
//                           "
//                         >
//                           {user.fullName}
//                         </td>

//                         <td
//                           className="
//                             overflow-hidden
//                             text-ellipsis
//                             whitespace-nowrap
//                             px-3
//                             py-1
//                           "
//                         >
//                           {user.email}
//                         </td>

//                         <td
//                           className="
//                             overflow-hidden
//                             text-ellipsis
//                             whitespace-nowrap
//                             px-3
//                             py-1
//                           "
//                         >
//                           {record.browser}
//                         </td>

//                         <td
//                           className="
//                             overflow-hidden
//                             text-ellipsis
//                             whitespace-nowrap
//                             px-3
//                             py-1
//                           "
//                         >
//                           {record.ip}
//                         </td>

//                         <td
//                           className="
//                             overflow-hidden
//                             text-ellipsis
//                             whitespace-nowrap
//                             px-3
//                             py-1
//                           "
//                         >
//                           {formatDate(
//                             record.date,
//                           )}
//                         </td>
//                       </tr>
//                     )
//                   },
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginHistory


import React, { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

import axiosInstance from '../../axiosInstance'
import { Panel, Donut, tooltipStyle } from './Dashboardshared'

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || '?'

const LoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLoginHistory = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axiosInstance.get('/auth/login-history')

      if (response.data.success) {
        setLoginHistory(response.data.data.loginHistory)
      }
    } catch (err) {
      console.error('Error fetching login history:', err)
      setError('Failed to load login history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoginHistory()
  }, [])

  /* Chart data derived from the login records already loaded */
  const { perDay, browsers } = useMemo(() => {
    const days = new Map()
    const br = new Map()

    loginHistory.forEach((r) => {
      const d = new Date(r.date)
      if (!isNaN(d)) {
        const k = d.toISOString().slice(0, 10)
        days.set(k, (days.get(k) || 0) + 1)
      }
      const b = r.browser || 'Unknown'
      br.set(b, (br.get(b) || 0) + 1)
    })

    const sortedBrowsers = [...br.entries()].sort((a, b) => b[1] - a[1])
    const head = sortedBrowsers.slice(0, 4)
    const rest = sortedBrowsers.slice(4).reduce((s, [, v]) => s + v, 0)
    if (rest) head.push(['Others', rest])

    return {
      perDay: [...days.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14),
      browsers: head,
    }
  }, [loginHistory])

  if (loading) {
    return (
      <Panel>
        <div className="p-8 text-center text-sm text-slate-500">
          Loading login history...
        </div>
      </Panel>
    )
  }

  if (error) {
    return (
      <Panel>
        <div className="p-8 text-center text-sm text-red-500">
          <div>{error}</div>
          <button
            type="button"
            onClick={fetchLoginHistory}
            className="mt-4 rounded-lg bg-[#2759A2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1f4a89]"
          >
            Retry
          </button>
        </div>
      </Panel>
    )
  }

  const th =
    'sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-xs font-semibold text-slate-600'
  const td = 'truncate px-4 py-2.5'

  return (
    <div className="space-y-4">
      {loginHistory.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Logins per Day" className="lg:col-span-2">
            <div className="h-[280px] p-4">
              <Line
                data={{
                  labels: perDay.map(([k]) =>
                    new Date(k).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    }),
                  ),
                  datasets: [
                    {
                      data: perDay.map(([, v]) => v),
                      borderColor: '#2759A2',
                      backgroundColor: 'rgba(39,89,162,0.12)',
                      fill: true,
                      tension: 0.35,
                      pointRadius: 3,
                      pointBackgroundColor: '#fff',
                      pointBorderColor: '#2759A2',
                      pointBorderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: tooltipStyle },
                  scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: {
                      beginAtZero: true,
                      border: { display: false },
                      grid: { color: '#eef2f7' },
                      ticks: { precision: 0 },
                    },
                  },
                }}
              />
            </div>
          </Panel>

          <Panel title="Browsers">
            <div className="pt-3">
              <Donut
                labels={browsers.map(([l]) => l)}
                values={browsers.map(([, v]) => v)}
                centerSub="Logins"
                height={280}
              />
            </div>
          </Panel>
        </div>
      )}

      <Panel title="Login History" className="overflow-hidden">
        <div className="relative mt-3 max-h-[400px] overflow-auto">
          {loginHistory.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No login history found
            </div>
          ) : (
            <table className="w-full min-w-[720px] table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  <th className={`${th} w-[22%]`}>Name</th>
                  <th className={`${th} w-[22%]`}>Email</th>
                  <th className={`${th} w-[20%]`}>Browser</th>
                  <th className={`${th} w-[16%]`}>IP</th>
                  <th className={`${th} w-[20%]`}>Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loginHistory.map((record, index) => {
                  const user = record.user || {}

                  return (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className={td}>
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2759A2]/10 text-xs font-semibold text-[#2759A2]">
                            {initials(user.fullName)}
                          </span>
                          <span className="truncate font-medium text-slate-800">
                            {user.fullName}
                          </span>
                        </span>
                      </td>
                      <td className={td}>{user.email}</td>
                      <td className={td}>{record.browser}</td>
                      <td className={td}>{record.ip}</td>
                      <td className={td}>{formatDate(record.date)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default LoginHistory