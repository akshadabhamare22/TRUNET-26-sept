// import React, {
//   useEffect,
//   useState,
// } from 'react'
// import { Link } from 'react-router-dom'
// import {
//   Users,
//   ShoppingCart,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'

// const IndentCard = () => {
//   const [centerCount, setCenterCount] =
//     useState(0)

//   const [indentSummary, setIndentSummary] =
//     useState({
//       totalRequests: 0,
//       completed: 0,
//       incomplete: 0,
//     })

//   const [loading, setLoading] =
//     useState(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const centerRes =
//           await axiosInstance.get(
//             '/centers',
//           )

//         if (centerRes.data.success) {
//           setCenterCount(
//             centerRes.data.pagination
//               .totalItems,
//           )
//         }

//         const indentRes =
//           await axiosInstance.get(
//             '/stockrequest/indent-count',
//           )

//         if (indentRes.data.success) {
//           setIndentSummary({
//             totalRequests:
//               indentRes.data
//                 .totalRequests || 0,

//             completed:
//               indentRes.data.completed ||
//               0,

//             incomplete:
//               indentRes.data.incomplete ||
//               0,
//           })
//         }
//       } catch (error) {
//         console.error(
//           'Error fetching dashboard data:',
//           error,
//         )
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   return (
//     <div className="transition-all duration-300">
//       {/* Heading */}
//       <h2
//         className="
//           mb-3
//           text-2xl
//           font-light
//           text-[#333333]
//         "
//       >
//         Dashboard
//       </h2>

//       {/* Cards */}
//       <div className="flex flex-wrap gap-4">
//         {/* Centers Card */}
//         <div
//           className="
//             flex
//             w-[18.5rem]
//             overflow-hidden
//             bg-white
//             shadow-sm
//           "
//         >
//           <div
//             className="
//               flex
//               items-center
//               justify-center
//               bg-[#00c0ef]
//               p-7
//             "
//           >
//             <Users
//               size={40}
//               strokeWidth={2}
//               className="text-white"
//             />
//           </div>

//           <div
//             className="
//               flex
//               flex-col
//               justify-center
//               bg-white
//               py-1
//               pl-3
//             "
//           >
//             <Link
//               to="/center-list"
//               className="
//                 text-sm
//                 text-[#3C8DBC]
//                 no-underline
//                 transition-colors
//                 duration-200
//                 hover:text-[#72AFDB]
//               "
//             >
//               CENTERS
//             </Link>

//             <div
//               className="
//                 text-lg
//                 font-bold
//                 text-[#333333]
//               "
//             >
//               {loading
//                 ? 'Loading...'
//                 : centerCount}
//             </div>
//           </div>
//         </div>

//         {/* Total Indent Card */}
//         <div
//           className="
//             flex
//             w-[18.5rem]
//             overflow-hidden
//             bg-white
//             shadow-sm
//           "
//         >
//           <div
//             className="
//               flex
//               items-center
//               justify-center
//               bg-[#00A65A]
//               p-7
//             "
//           >
//             <ShoppingCart
//               size={40}
//               strokeWidth={2}
//               className="text-white"
//             />
//           </div>

//           <div
//             className="
//               flex
//               flex-col
//               justify-center
//               bg-white
//               py-1
//               pl-3
//             "
//           >
//             <Link
//               to="/order/index/indent"
//               className="
//                 text-sm
//                 text-[#3C8DBC]
//                 no-underline
//                 transition-colors
//                 duration-200
//                 hover:text-[#72AFDB]
//               "
//             >
//               TOTAL INDENT
//             </Link>

//             <div
//               className="
//                 text-lg
//                 font-bold
//                 text-[#333333]
//               "
//             >
//               {loading
//                 ? 'Loading...'
//                 : `${indentSummary.totalRequests}/${indentSummary.completed}`}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default IndentCard

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ShoppingCart, ArrowRight } from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import { Panel, Donut } from './Dashboardshared'

const Stat = ({
  to,
  label,
  value,
  sub,
  icon: Icon,
  from,
  toColor,
  children,
}) => (
  <Link
    to={to}
    className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white no-underline shadow-[0_14px_30px_-14px_rgba(15,23,42,0.45)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2759A2]"
    style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${toColor})` }}
  >
    {/* Soft highlight */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.28),transparent_55%)]"
    />

    {/* Rings radiating from the icon (behind it, away from the text) */}
    <div
      aria-hidden
      className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full border border-white/15"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full border border-white/20"
    />

    <div className="relative flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium text-white/85">{label}</div>
        <div className="mt-1 text-5xl font-bold leading-none tracking-tight">
          {value}
        </div>
        {sub && <div className="mt-2 text-xs text-white/75">{sub}</div>}
      </div>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-1xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-sm">
        <Icon size={26} strokeWidth={2} />
      </div>
    </div>

    <div className="relative mt-6">{children}</div>
  </Link>
)

const IndentCard = () => {
  const [centerCount, setCenterCount] = useState(0)
  const [indentSummary, setIndentSummary] = useState({
    totalRequests: 0,
    completed: 0,
    incomplete: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centerRes = await axiosInstance.get('/centers')

        if (centerRes.data.success) {
          setCenterCount(centerRes.data.pagination.totalItems)
        }

        const indentRes = await axiosInstance.get(
          '/stockrequest/indent-count',
        )

        if (indentRes.data.success) {
          setIndentSummary({
            totalRequests: indentRes.data.totalRequests || 0,
            completed: indentRes.data.completed || 0,
            incomplete: indentRes.data.incomplete || 0,
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-slate-800">
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Stat
          to="/center-list"
          label="Centers"
          value={loading ? 'Loading...' : centerCount}
          icon={Users}
          from="#0c2345"
          toColor="#4ea2e3"
        >
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3.5 py-2 text-sm font-medium ring-1 ring-white/25 transition-colors group-hover:bg-white/25">
            View all centers
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </Stat>

        <Stat
          to="/order/index/indent"
          label="Total Indent"
          value={
            loading
              ? 'Loading...'
              : `${indentSummary.totalRequests}/${indentSummary.completed}`
          }
          sub={loading ? '' : 'requests / completed'}
          icon={ShoppingCart}
          from="#18422b"
          toColor="#2acf56"
        >
          {(() => {
            const { totalRequests, completed, incomplete } = indentSummary
            const pct = totalRequests
              ? Math.round((completed / totalRequests) * 100)
              : 0
            return (
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-white/90">
                  <span className="font-medium">
                    {loading ? '' : `${completed} completed`}
                  </span>
                  <span>{loading ? '' : `${incomplete} incomplete`}</span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-white/25"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: `${loading ? 0 : pct}%` }}
                  />
                </div>
                <div className="mt-2 text-xs font-semibold">
                  {loading ? '' : `${pct}% completed`}
                </div>
              </div>
            )
          })()}
        </Stat>

        <Panel
          title="Indent Status"
          className="md:col-span-2 lg:col-span-1"
        >
          {loading ? (
            <p className="px-5 py-8 text-sm text-slate-500">Loading...</p>
          ) : (
            <div className="flex items-center gap-5 px-5 pb-4 pt-2">
              <div className="w-[150px] shrink-0">
                <Donut
                  labels={['Completed', 'Incomplete']}
                  values={[indentSummary.completed, indentSummary.incomplete]}
                  colors={['#00A65A', '#F5A524']}
                  centerValue={String(indentSummary.totalRequests)}
                  centerSub="Total"
                  height={150}
                  legend="none"
                />
              </div>

              <ul className="m-0 flex-1 list-none space-y-3 p-0">
                {[
                  ['Completed', indentSummary.completed, '#03c16c'],
                  ['Incomplete', indentSummary.incomplete, '#F5A524'],
                ].map(([name, count, color]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {name}
                    </span>
                    <span className="font-semibold text-slate-800">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

export default IndentCard