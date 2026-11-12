// import React from 'react'
// import { Bar } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
// } from 'chart.js'

// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
// )

// const CenterUsage = () => {
//   const data = {
//     labels: [
//       'Fiber 6F',
//       'Fiber 4F',
//       'Fiber 12F',
//       'Small Sleeve',
//       'Planesheets',
//       'Fiber 24F',
//       'Fiber 48F',
//       'Blue Jointer',
//       'Visiting Card',
//       'Cable Tie 300 mm(pkt)',
//     ],

//     datasets: [
//       {
//         data: [
//           105402,
//           63824,
//           61906,
//           68000,
//           57118,
//           9000,
//           8320,
//           4850,
//           4849,
//           3600,
//         ],
//         backgroundColor: '#61BEAB',
//         borderWidth: 0,
//         barThickness: 107,
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,

//     layout: {
//       padding: {
//         bottom: 30,
//       },
//     },

//     plugins: {
//       legend: {
//         display: false,
//       },

//       tooltip: {
//         callbacks: {
//           label: (context) =>
//             `${context.label}: ${context.parsed.y.toLocaleString()}`,
//         },
//       },
//     },

//     scales: {
//       x: {
//         ticks: {
//           maxRotation: 40,
//           minRotation: 30,
//           align: 'end',
//           color: '#333',
//           padding: 1,
//         },

//         grid: {
//           display: false,
//         },
//       },

//       y: {
//         beginAtZero: true,
//         min: 0,
//         max: 200000,

//         ticks: {
//           stepSize: 12500,
//           color: '#333',
//           autoSkip: false,
//           maxTicksLimit: 17,

//           callback: (value) =>
//             value % 12500 === 0
//               ? value.toLocaleString()
//               : '',
//         },

//         grid: {
//           display: false,
//         },
//       },
//     },
//   }

//   return (
//     <div
//       className="
//         mt-6
//         h-[720px]
//         rounded-lg
//         border-t-[3px]
//         border-[#2759A2]
//         bg-white
//         px-2
//         pb-6
//         shadow-sm
//       "
//     >
//       {/* Header */}
//       <div
//         className="
//           mb-2
//           flex
//           items-center
//           justify-between
//         "
//       >
//         <h2
//           className="
//             m-0
//             text-xl
//             font-light
//             text-[#444444]
//           "
//         >
//           Center Usage
//         </h2>

//         <select
//           className="
//             mt-2
//             border
//             border-gray-300
//             bg-white
//             px-3
//             py-2
//             text-sm
//             text-gray-600
//             outline-none
//             focus:border-[#2759A2]
//             focus:ring-1
//             focus:ring-[#2759A2]
//           "
//           defaultValue="30 Days"
//         >
//           <option value="30 Days">
//             30 Days
//           </option>

//           <option value="60 Days">
//             60 Days
//           </option>

//           <option value="90 Days">
//             90 Days
//           </option>

//           <option value="1 Year">
//             1 Year
//           </option>
//         </select>
//       </div>

//       {/* Chart */}
//       <div
//         className="
//           mt-[3.25rem]
//           h-[calc(100%-70px)]
//           px-5
//         "
//       >
//         <Bar
//           data={data}
//           options={options}
//         />
//       </div>
//     </div>
//   )
// }

// export default CenterUsage


// import React, { useMemo, useState } from 'react'
// import { Bar } from 'react-chartjs-2'

// import { Panel, Donut, COLORS, tooltipStyle } from './Dashboardshared'

// const USAGE = [
//   ['Fiber 6F', 105402],
//   ['Fiber 4F', 63824],
//   ['Fiber 12F', 61906],
//   ['Small Sleeve', 68000],
//   ['Planesheets', 57118],
//   ['Fiber 24F', 9000],
//   ['Fiber 48F', 8320],
//   ['Blue Jointer', 4850],
//   ['Visiting Card', 4849],
//   ['Cable Tie 300 mm(pkt)', 3600],
// ].sort((a, b) => b[1] - a[1])

// const CenterUsage = () => {
//   const [range, setRange] = useState('30 Days')

//   const pie = useMemo(() => {
//     const top = USAGE.slice(0, 5)
//     const rest = USAGE.slice(5).reduce((s, [, v]) => s + v, 0)
//     return {
//       labels: [...top.map(([l]) => l), 'Others'],
//       values: [...top.map(([, v]) => v), rest],
//     }
//   }, [])

//   const data = {
//     labels: USAGE.map(([l]) => l),
//     datasets: [
//       {
//         data: USAGE.map(([, v]) => v),
//         backgroundColor: '#2759A2',
//         hoverBackgroundColor: '#61BEAB',
//         borderRadius: 8,
//         borderSkipped: false,
//         maxBarThickness: 48,
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         ...tooltipStyle,
//         callbacks: {
//           label: (ctx) => `${ctx.label}: ${ctx.parsed.y.toLocaleString()}`,
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: { display: false },
//         border: { display: false },
//         ticks: { maxRotation: 40, minRotation: 30, color: '#475569' },
//       },
//       y: {
//         beginAtZero: true,
//         border: { display: false },
//         grid: { color: '#eef2f7' },
//         ticks: {
//           color: '#475569',
//           callback: (v) => v.toLocaleString(),
//         },
//       },
//     },
//   }

//   return (
//     <Panel
//       title="Center Usage"
//       right={
//         <select
//           value={range}
//           onChange={(e) => setRange(e.target.value)}
//           aria-label="Usage period"
//           className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/20"
//         >
//           <option value="30 Days">30 Days</option>
//           <option value="60 Days">60 Days</option>
//           <option value="90 Days">90 Days</option>
//           <option value="1 Year">1 Year</option>
//         </select>
//       }
//     >
//       <div className="grid gap-2 p-4 lg:grid-cols-3">
//         <div className="h-[420px] lg:col-span-2">
//           <Bar data={data} options={options} />
//         </div>

//         <div className="flex flex-col">
//           <p className="px-1 text-sm font-medium text-slate-600">
//             Usage share (top 5)
//           </p>
//           <Donut
//             labels={pie.labels}
//             values={pie.values}
//             colors={[...COLORS.slice(0, 5), '#CBD5E1']}
//             cutout="0%"
//             height={380}
//           />
//         </div>
//       </div>
//     </Panel>
//   )
// }

// export default CenterUsage

import React, { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { BarChart3, Trophy, Layers } from 'lucide-react'

import { Donut, tooltipStyle } from './Dashboardshared'

const USAGE = [
  ['Fiber 6F', 105402],
  ['Fiber 4F', 63824],
  ['Fiber 12F', 61906],
  ['Small Sleeve', 68000],
  ['Planesheets', 57118],
  ['Fiber 24F', 9000],
  ['Fiber 48F', 8320],
  ['Blue Jointer', 4850],
  ['Visiting Card', 4849],
  ['Cable Tie 300 mm(pkt)', 3600],
].sort((a, b) => b[1] - a[1])

const PIE_COLORS = [
  '#2F8CEB',
  '#21C8A5',
  '#FFB347',
  '#8B5CF6',
  '#FF7C8E',
  '#CBD5E1',
]

const panel =
  'rounded-xl bg-white shadow-[0_8px_24px_-14px_rgba(39,89,162,0.35)] ring-1 ring-slate-100'

const CenterUsage = () => {
  const [range, setRange] = useState('30 Days')

  const total = useMemo(
    () => USAGE.reduce((s, [, v]) => s + v, 0),
    [],
  )

  const pie = useMemo(() => {
    const top = USAGE.slice(0, 5)
    const rest = USAGE.slice(5).reduce((s, [, v]) => s + v, 0)
    return {
      labels: [...top.map(([l]) => l), 'Others'],
      values: [...top.map(([, v]) => v), rest],
    }
  }, [])

  const data = {
    labels: USAGE.map(([l]) => l),
    datasets: [
      {
        data: USAGE.map(([, v]) => v),
        backgroundColor: (context) => {
          const { chart } = context
          const { ctx, chartArea } = chart
          if (!chartArea) return '#2F8CEB'
          const g = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top,
          )
          g.addColorStop(0, '#90CAF9')
          g.addColorStop(1, '#2F8CEB')
          return g
        },
        hoverBackgroundColor: '#21C8A5',
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 44,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { maxRotation: 40, minRotation: 30, color: '#475569' },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: '#eef2f7' },
        ticks: { color: '#475569', callback: (v) => v.toLocaleString() },
      },
    },
  }

  /* Same bright gradients as the indent cards */
  const chips = [
    ['Total Usage', total.toLocaleString(), BarChart3, '#90CAF9', '#2F8CEB', 'rgba(47,140,235,0.6)'],
    ['Top Item', `${USAGE[0][0]} · ${USAGE[0][1].toLocaleString()}`, Trophy, '#FFB68A', '#FF7C8E', 'rgba(255,124,142,0.6)'],
    ['Items', String(USAGE.length), Layers, '#7BE0C3', '#21C8A5', 'rgba(33,200,165,0.6)'],
  ]

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-slate-200/70 p-5 shadow-[0_12px_28px_-16px_rgba(39,89,162,0.3)] md:p-6"
      style={{
        backgroundImage:
          'linear-gradient(135deg, #EAF3FF 0%, #F8FBFF 50%, #E6F9F3 100%)',
      }}
    >
      {/* Soft decorative circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#2F8CEB]/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-[#21C8A5]/10"
      />

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-1 rounded-full bg-[#2759A2]" />
          <h2 className="text-base font-semibold tracking-tight text-slate-800">
            Center Usage
          </h2>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          aria-label="Usage period"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/20"
        >
          {['30 Days', '60 Days', '90 Days', '1 Year'].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

    

      {/* Charts */}
      <div className="relative mt-4 grid gap-4 lg:grid-cols-3">
        <div className={`${panel} h-[400px] p-4 lg:col-span-2`}>
          <Bar data={data} options={options} />
        </div>

        <div className={`${panel} flex flex-col p-4`}>
          <p className="text-sm font-medium text-slate-600">
            Usage share (top 5)
          </p>

          <div className="-mx-4 mt-1">
            <Donut
              labels={pie.labels}
              values={pie.values}
              colors={PIE_COLORS}
              cutout="0%"
              height={210}
              legend="none"
            />
          </div>

          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-1.5 p-0 text-xs">
            {pie.labels.map((name, i) => (
              <li
                key={name}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  <span className="truncate">{name}</span>
                </span>
                <span className="font-semibold text-slate-800">
                  {Math.round((pie.values[i] / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CenterUsage