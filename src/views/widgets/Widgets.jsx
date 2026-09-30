import React, { useMemo } from "react";
import {
  ArrowRight,
  Bell,
  Basket,
  BarChart3,
  BellRing,
  ChartPie,
  Laptop,
  MessageCircle,
  Moon,
  People,
  Settings,
  ShoppingBasket,
  Gauge,
  User,
  UserPlus,
} from "lucide-react";
import {
  Bar,
  Line,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import WidgetsBrand from "./WidgetsBrand";
import WidgetsDropdown from "./WidgetsDropdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
);

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const chartLabels = [
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
  "S",
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
  "S",
  "M",
];

const createRandomData = () =>
  chartLabels.map(() => random(40, 100));

const miniChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};

const lineChartOptions = {
  ...miniChartOptions,
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
    },
  },
};

const MiniBarChart = ({ className = "", datasetClass = "" }) => {
  const data = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          data: createRandomData(),
          backgroundColor:
            datasetClass === "danger"
              ? "#dc3545"
              : datasetClass === "primary"
                ? "#321fdb"
                : "#2eb85c",
          borderColor: "transparent",
          borderWidth: 1,
        },
      ],
    }),
    [datasetClass],
  );

  return (
    <div className={`mx-auto h-10 w-20 ${className}`}>
      <Bar data={data} options={miniChartOptions} />
    </div>
  );
};

const MiniLineChart = ({ datasetClass = "danger" }) => {
  const color =
    datasetClass === "danger"
      ? "#dc3545"
      : datasetClass === "success"
        ? "#2eb85c"
        : "#39f";

  const data = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          data: createRandomData(),
          backgroundColor: "transparent",
          borderColor: color,
          borderWidth: 2,
          fill: false,
        },
      ],
    }),
    [color],
  );

  return (
    <div className="mx-auto h-10 w-20">
      <Line data={data} options={lineChartOptions} />
    </div>
  );
};

const ProgressBar = ({ value = 75, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    info: "bg-cyan-500",
  };

  return (
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full ${colors[color] || colors.blue}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const WidgetStatsB = ({
  value,
  title,
  text,
  progress = 0,
  color = "blue",
  inverse = false,
}) => {
  const colorMap = {
    primary: "bg-blue-600",
    info: "bg-cyan-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  return (
    <div
      className={`h-full rounded-lg border p-4 shadow-sm ${
        inverse
          ? `${colorMap[color] || colorMap.primary} text-white border-transparent`
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">{value}</div>
          <div
            className={`mt-1 text-sm ${
              inverse ? "text-white/80" : "text-gray-600"
            }`}
          >
            {title}
          </div>
        </div>
      </div>

      <ProgressBar
        value={progress}
        color={inverse ? "blue" : color}
      />

      {text && (
        <p
          className={`mt-3 text-xs ${
            inverse ? "text-white/80" : "text-gray-500"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

const WidgetStatsE = ({
  chart,
  title,
  value,
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
    {chart}

    <div className="mt-2 text-center">
      <div className="text-lg font-semibold text-gray-800">
        {value}
      </div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  </div>
);

const WidgetStatsF = ({
  icon,
  title,
  value,
  color = "primary",
  footer,
  padding = true,
}) => {
  const colorMap = {
    primary: "bg-blue-600",
    info: "bg-cyan-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${
        padding ? "p-4" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${
            colorMap[color] || colorMap.primary
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-xs uppercase text-gray-500">
            {title}
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-800">
            {value}
          </div>
        </div>
      </div>

      {footer && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          {footer}
        </div>
      )}
    </div>
  );
};

const WidgetStatsC = ({
  icon,
  value,
  title,
  progress = 75,
  color = "blue",
  inverse = false,
}) => {
  const colors = {
    blue: "bg-blue-600",
    cyan: "bg-cyan-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${
        inverse
          ? `${colors[color] || colors.blue} border-transparent text-white`
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            inverse
              ? "bg-white/15"
              : "bg-gray-100"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div
            className={`text-xl font-semibold ${
              inverse ? "text-white" : "text-gray-800"
            }`}
          >
            {value}
          </div>

          <div
            className={`text-sm ${
              inverse ? "text-white/80" : "text-gray-500"
            }`}
          >
            {title}
          </div>
        </div>
      </div>

      <ProgressBar
        value={progress}
        color={inverse ? "blue" : color}
      />
    </div>
  );
};

const Widgets = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Widgets
        </h2>
      </div>

      <div className="space-y-6 p-5">
        {/* Widgets Dropdown */}
        <section>
          <WidgetsDropdown />
        </section>

        {/* Widget Stats B */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WidgetStatsB
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
              title="Widget title"
              value="89.9%"
              color="success"
            />

            <WidgetStatsB
              value="12.124"
              title="Widget title"
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
              color="info"
            />

            <WidgetStatsB
              value="$98.111,00"
              title="Widget title"
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
              color="warning"
            />

            <WidgetStatsB
              value="2 TB"
              title="Widget title"
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
              color="primary"
            />
          </div>
        </section>

        {/* Inverse Widget Stats B */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WidgetStatsB
              color="success"
              inverse
              value="89.9%"
              title="Widget title"
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
            />

            <WidgetStatsB
              color="info"
              inverse
              value="12.124"
              title="Widget title"
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
            />

            <WidgetStatsB
              color="warning"
              inverse
              value="$98.111,00"
              title="Widget title"
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
            />

            <WidgetStatsB
              color="primary"
              inverse
              value="2 TB"
              title="Widget title"
              progress={89.9}
              text="Lorem ipsum dolor sit amet enim."
            />
          </div>
        </section>

        {/* Widget Stats E */}
        <section>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <WidgetStatsE
              chart={<MiniBarChart datasetClass="danger" />}
              title="title"
              value="1,123"
            />

            <WidgetStatsE
              chart={<MiniBarChart datasetClass="primary" />}
              title="title"
              value="1,123"
            />

            <WidgetStatsE
              chart={<MiniBarChart datasetClass="success" />}
              title="title"
              value="1,123"
            />

            <WidgetStatsE
              chart={<MiniLineChart datasetClass="danger" />}
              title="title"
              value="1,123"
            />

            <WidgetStatsE
              chart={<MiniLineChart datasetClass="success" />}
              title="title"
              value="1,123"
            />

            <WidgetStatsE
              chart={<MiniLineChart datasetClass="info" />}
              title="title"
              value="1,123"
            />
          </div>
        </section>

        {/* Widget Stats F */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WidgetStatsF
              icon={<Settings size={24} />}
              title="income"
              value="$1.999,50"
              color="primary"
            />

            <WidgetStatsF
              icon={<User size={24} />}
              title="income"
              value="$1.999,50"
              color="info"
            />

            <WidgetStatsF
              icon={<Moon size={24} />}
              title="income"
              value="$1.999,50"
              color="warning"
            />

            <WidgetStatsF
              icon={<Bell size={24} />}
              title="income"
              value="$1.999,50"
              color="danger"
            />
          </div>
        </section>

        {/* Widget Stats F with footer */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WidgetStatsF
              icon={<Settings size={24} />}
              title="income"
              value="$1.999,50"
              color="primary"
              footer={
                <a
                  href="https://coreui.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-blue-600"
                >
                  View more
                  <ArrowRight size={16} />
                </a>
              }
            />

            <WidgetStatsF
              icon={<Laptop size={24} />}
              title="income"
              value="$1.999,50"
              color="info"
              footer={
                <a
                  href="https://coreui.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-blue-600"
                >
                  View more
                  <ArrowRight size={16} />
                </a>
              }
            />

            <WidgetStatsF
              icon={<Moon size={24} />}
              title="income"
              value="$1.999,50"
              color="warning"
              footer={
                <a
                  href="https://coreui.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-blue-600"
                >
                  View more
                  <ArrowRight size={16} />
                </a>
              }
            />

            <WidgetStatsF
              icon={<Bell size={24} />}
              title="income"
              value="$1.999,50"
              color="danger"
              footer={
                <a
                  href="https://coreui.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-blue-600"
                >
                  View more
                  <ArrowRight size={16} />
                </a>
              }
            />
          </div>
        </section>

        {/* Widget Stats F without padding */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WidgetStatsF
              icon={<Settings size={24} />}
              title="income"
              value="$1.999,50"
              color="primary"
              padding={false}
            />

            <WidgetStatsF
              icon={<User size={24} />}
              title="income"
              value="$1.999,50"
              color="info"
              padding={false}
            />

            <WidgetStatsF
              icon={<Moon size={24} />}
              title="income"
              value="$1.999,50"
              color="warning"
              padding={false}
            />

            <WidgetStatsF
              icon={<Bell size={24} />}
              title="income"
              value="$1.999,50"
              color="danger"
              padding={false}
            />
          </div>
        </section>

        {/* Brand widgets */}
        <section>
          <WidgetsBrand />
        </section>

        <section>
          <WidgetsBrand withCharts />
        </section>

        {/* Widget Stats C - Card Group */}
        <section>
          <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-lg border border-gray-200 sm:grid-cols-2 lg:grid-cols-5">
            <WidgetStatsC
              icon={<People size={36} />}
              value="87.500"
              title="Visitors"
              progress={75}
              color="cyan"
            />

            <WidgetStatsC
              icon={<UserPlus size={36} />}
              value="385"
              title="New Clients"
              progress={75}
              color="green"
            />

            <WidgetStatsC
              icon={<ShoppingBasket size={36} />}
              value="1238"
              title="Products sold"
              progress={75}
              color="yellow"
            />

            <WidgetStatsC
              icon={<ChartPie size={36} />}
              value="28%"
              title="Returning Visitors"
              progress={75}
              color="blue"
            />

            <WidgetStatsC
              icon={<Gauge size={36} />}
              value="5:34:11"
              title="Avg. Time"
              progress={75}
              color="red"
            />
          </div>
        </section>

        {/* Widget Stats C - Six columns */}
        <section>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <WidgetStatsC
              icon={<People size={36} />}
              value="87.500"
              title="Visitors"
              progress={75}
              color="cyan"
            />

            <WidgetStatsC
              icon={<UserPlus size={36} />}
              value="385"
              title="New Clients"
              progress={75}
              color="green"
            />

            <WidgetStatsC
              icon={<ShoppingBasket size={36} />}
              value="1238"
              title="Products sold"
              progress={75}
              color="yellow"
            />

            <WidgetStatsC
              icon={<ChartPie size={36} />}
              value="28%"
              title="Returning Visitors"
              progress={75}
              color="blue"
            />

            <WidgetStatsC
              icon={<Gauge size={36} />}
              value="5:34:11"
              title="Avg. Time"
              progress={75}
              color="red"
            />

            <WidgetStatsC
              icon={<MessageCircle size={36} />}
              value="972"
              title="Comments"
              progress={75}
              color="cyan"
            />
          </div>
        </section>

        {/* Inverse Widget Stats C */}
        <section>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <WidgetStatsC
              color="cyan"
              icon={<People size={36} />}
              value="87.500"
              title="Visitors"
              inverse
              progress={75}
            />

            <WidgetStatsC
              color="green"
              icon={<UserPlus size={36} />}
              value="385"
              title="New Clients"
              inverse
              progress={75}
            />

            <WidgetStatsC
              color="yellow"
              icon={<ShoppingBasket size={36} />}
              value="1238"
              title="Products sold"
              inverse
              progress={75}
            />

            <WidgetStatsC
              color="blue"
              icon={<ChartPie size={36} />}
              value="28%"
              title="Returning Visitors"
              inverse
              progress={75}
            />

            <WidgetStatsC
              color="red"
              icon={<Gauge size={36} />}
              value="5:34:11"
              title="Avg. Time"
              inverse
              progress={75}
            />

            <WidgetStatsC
              color="cyan"
              icon={<MessageCircle size={36} />}
              value="972"
              title="Comments"
              inverse
              progress={75}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Widgets;