import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
)

const CenterUsage = () => {
  const data = {
    labels: [
      'Fiber 6F',
      'Fiber 4F',
      'Fiber 12F',
      'Small Sleeve',
      'Planesheets',
      'Fiber 24F',
      'Fiber 48F',
      'Blue Jointer',
      'Visiting Card',
      'Cable Tie 300 mm(pkt)',
    ],

    datasets: [
      {
        data: [
          105402,
          63824,
          61906,
          68000,
          57118,
          9000,
          8320,
          4850,
          4849,
          3600,
        ],
        backgroundColor: '#61BEAB',
        borderWidth: 0,
        barThickness: 107,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: {
        bottom: 30,
      },
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed.y.toLocaleString()}`,
        },
      },
    },

    scales: {
      x: {
        ticks: {
          maxRotation: 40,
          minRotation: 30,
          align: 'end',
          color: '#333',
          padding: 1,
        },

        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,
        min: 0,
        max: 200000,

        ticks: {
          stepSize: 12500,
          color: '#333',
          autoSkip: false,
          maxTicksLimit: 17,

          callback: (value) =>
            value % 12500 === 0
              ? value.toLocaleString()
              : '',
        },

        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div
      className="
        mt-6
        h-[720px]
        rounded-lg
        border-t-[3px]
        border-[#2759A2]
        bg-white
        px-2
        pb-6
        shadow-sm
      "
    >
      {/* Header */}
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="
            m-0
            text-xl
            font-light
            text-[#444444]
          "
        >
          Center Usage
        </h2>

        <select
          className="
            mt-2
            border
            border-gray-300
            bg-white
            px-3
            py-2
            text-sm
            text-gray-600
            outline-none
            focus:border-[#2759A2]
            focus:ring-1
            focus:ring-[#2759A2]
          "
          defaultValue="30 Days"
        >
          <option value="30 Days">
            30 Days
          </option>

          <option value="60 Days">
            60 Days
          </option>

          <option value="90 Days">
            90 Days
          </option>

          <option value="1 Year">
            1 Year
          </option>
        </select>
      </div>

      {/* Chart */}
      <div
        className="
          mt-[3.25rem]
          h-[calc(100%-70px)]
          px-5
        "
      >
        <Bar
          data={data}
          options={options}
        />
      </div>
    </div>
  )
}

export default CenterUsage