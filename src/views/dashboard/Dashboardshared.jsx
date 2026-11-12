// import React from 'react'
// import { Doughnut } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js'

// ChartJS.register(
//   ArcElement,
//   BarElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   Filler,
// )

// ChartJS.defaults.font.family = 'inherit'
// ChartJS.defaults.color = '#64748b'

// export const COLORS = [
//   '#2759A2',
//   '#61BEAB',
//   '#F5A524',
//   '#8B5CF6',
//   '#EF6C6C',
//   '#38BDF8',
//   '#94A3B8',
// ]

// export const tooltipStyle = {
//   backgroundColor: '#0f172a',
//   padding: 10,
//   cornerRadius: 8,
//   titleFont: { weight: '600' },
//   boxPadding: 4,
// }

// export const Panel = ({
//   title,
//   right,
//   children,
//   className = '',
// }) => (
//   <section
//     className={`rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-16px_rgba(39,89,162,0.18)] ${className}`}
//   >
//     {(title || right) && (
//       <header className="flex flex-wrap items-center justify-between gap-3 px-5 pb-1 pt-4">
//         <div className="flex items-center gap-2.5">
//           <span className="h-5 w-1 rounded-full bg-[#2759A2]" />
//           <h2 className="text-base font-semibold tracking-tight text-slate-800">
//             {title}
//           </h2>
//         </div>
//         {right}
//       </header>
//     )}
//     {children}
//   </section>
// )

// const centerPlugin = {
//   id: 'centerText',
//   afterDraw(chart, _args, opts) {
//     if (!opts || !opts.text) return
//     const { ctx, chartArea } = chart
//     const x = (chartArea.left + chartArea.right) / 2
//     const y = (chartArea.top + chartArea.bottom) / 2
//     ctx.save()
//     ctx.textAlign = 'center'
//     ctx.textBaseline = 'middle'
//     ctx.fillStyle = '#0f172a'
//     ctx.font = '600 24px sans-serif'
//     ctx.fillText(opts.text, x, y - 6)
//     ctx.fillStyle = '#64748b'
//     ctx.font = '12px sans-serif'
//     ctx.fillText(opts.sub || '', x, y + 15)
//     ctx.restore()
//   },
// }

// /* Doughnut (default) or true pie (cutout="0%") */
// export const Donut = ({
//   labels,
//   values,
//   colors = COLORS,
//   centerValue,
//   centerSub,
//   height = 240,
//   cutout = '68%',
//   legend = 'bottom',
// }) => {
//   const total = values.reduce((a, b) => a + b, 0)

//   if (!total) {
//     return (
//       <div
//         className="flex items-center justify-center text-sm text-slate-400"
//         style={{ height }}
//       >
//         No data available
//       </div>
//     )
//   }

//   const isPie = cutout === '0%'

//   return (
//     <div className="px-4 pb-4" style={{ height }}>
//       <Doughnut
//         data={{
//           labels,
//           datasets: [
//             {
//               data: values,
//               backgroundColor: values.map(
//                 (_, i) => colors[i % colors.length],
//               ),
//               borderColor: '#fff',
//               borderWidth: values.map((v) => (v ? 3 : 0)),
//               hoverOffset: 6,
//             },
//           ],
//         }}
//         options={{
//           responsive: true,
//           maintainAspectRatio: false,
//           cutout,
//           plugins: {
//             legend: {
//               display: legend !== 'none',
//               position: legend === 'none' ? 'bottom' : legend,
//               labels: {
//                 usePointStyle: true,
//                 pointStyle: 'circle',
//                 boxWidth: 8,
//                 padding: 14,
//               },
//             },
//             tooltip: tooltipStyle,
//             centerText: isPie
//               ? undefined
//               : {
//                   text: centerValue ?? String(total),
//                   sub: centerSub,
//                 },
//           },
//         }}
//         plugins={[centerPlugin]}
//       />
//     </div>
//   )
// }

import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
)

ChartJS.defaults.font.family = 'inherit'
ChartJS.defaults.color = '#64748b'

export const COLORS = [
  '#2759A2',
  '#61BEAB',
  '#F5A524',
  '#8B5CF6',
  '#EF6C6C',
  '#38BDF8',
  '#94A3B8',
]

export const tooltipStyle = {
  backgroundColor: '#0f172a',
  padding: 10,
  cornerRadius: 8,
  titleFont: { weight: '600' },
  boxPadding: 4,
}

export const Panel = ({
  title,
  right,
  children,
  className = '',
}) => (
  <section
    className={`rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-16px_rgba(39,89,162,0.18)] ${className}`}
  >
    {(title || right) && (
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 pb-1 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-1 rounded-full bg-[#2759A2]" />
          <h2 className="text-base font-semibold tracking-tight text-slate-800">
            {title}
          </h2>
        </div>
        {right}
      </header>
    )}
    {children}
  </section>
)

const centerPlugin = {
  id: 'centerText',
  afterDraw(chart, _args, opts) {
    if (!opts || !opts.text) return
    const { ctx, chartArea } = chart
    const x = (chartArea.left + chartArea.right) / 2
    const y = (chartArea.top + chartArea.bottom) / 2
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = opts.color || '#0f172a'
    ctx.font = '600 24px sans-serif'
    ctx.fillText(opts.text, x, y - 6)
    ctx.fillStyle = opts.subColor || '#64748b'
    ctx.font = '12px sans-serif'
    ctx.fillText(opts.sub || '', x, y + 15)
    ctx.restore()
  },
}

/* Doughnut (default) or true pie (cutout="0%") */
export const Donut = ({
  labels,
  values,
  colors = COLORS,
  centerValue,
  centerSub,
  height = 240,
  cutout = '68%',
  legend = 'bottom',
  borderColor = '#fff',
  centerColor,
  centerSubColor,
}) => {
  const total = values.reduce((a, b) => a + b, 0)

  if (!total) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400"
        style={{ height }}
      >
        No data available
      </div>
    )
  }

  const isPie = cutout === '0%'

  return (
    <div className="px-4 pb-4" style={{ height }}>
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: values.map(
                (_, i) => colors[i % colors.length],
              ),
              borderColor,
              borderWidth: values.map((v) => (v ? 3 : 0)),
              hoverOffset: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout,
          plugins: {
            legend: {
              display: legend !== 'none',
              position: legend === 'none' ? 'bottom' : legend,
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 8,
                padding: 14,
              },
            },
            tooltip: tooltipStyle,
            centerText: isPie
              ? undefined
              : {
                  text: centerValue ?? String(total),
                  sub: centerSub,
                  color: centerColor,
                  subColor: centerSubColor,
                },
          },
        }}
        plugins={[centerPlugin]}
      />
    </div>
  )
}