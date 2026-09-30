import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  ArrowDown,
  ArrowUp,
  MoreVertical,
} from "lucide-react";
import { Bar, Line } from "react-chartjs-2";

const chartBaseOptions = {
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
};

const lineOptions = {
  ...chartBaseOptions,
  scales: {
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      borderWidth: 1,
      tension: 0.4,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

const filledLineOptions = {
  ...chartBaseOptions,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  elements: {
    line: {
      borderWidth: 2,
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

const barOptions = {
  ...chartBaseOptions,
  scales: {
    x: {
      grid: {
        display: false,
        drawTicks: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        display: false,
        drawTicks: false,
      },
      ticks: {
        display: false,
      },
    },
  },
};

const DropdownMenu = ({ onClose }) => (
  <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg">
    <button
      type="button"
      onClick={onClose}
      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
    >
      Action
    </button>

    <button
      type="button"
      onClick={onClose}
      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
    >
      Another action
    </button>

    <button
      type="button"
      onClick={onClose}
      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
    >
      Something else here
    </button>

    <button
      type="button"
      disabled
      className="block w-full cursor-not-allowed px-4 py-2 text-left text-gray-400"
    >
      Disabled action
    </button>
  </div>
);

const WidgetCard = ({
  gradient,
  value,
  title,
  change,
  direction,
  chart,
  dropdownOpen,
  setDropdownOpen,
}) => (
  <div
    className={`relative min-h-[260px] overflow-hidden rounded-lg p-5 text-white shadow-sm ${gradient}`}
  >
    <div className="relative z-20 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">
            {value}
          </span>

          <span className="flex items-center text-sm font-normal text-white/85">
            ({change}
            {direction === "up" ? (
              <ArrowUp size={15} className="ml-1" />
            ) : (
              <ArrowDown size={15} className="ml-1" />
            )}
            )
          </span>
        </div>

        <div className="mt-1 text-sm text-white/80">
          {title}
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="rounded-md p-1.5 text-white transition hover:bg-white/10"
          aria-label="Widget options"
        >
          <MoreVertical size={20} />
        </button>

        {dropdownOpen && (
          <DropdownMenu
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-[90px]">
      {chart}
    </div>
  </div>
);

const WidgetsDropdown = ({ className = "", withCharts = false }) => {
  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState(null);

  const labels = useMemo(
    () => [
      t("january"),
      t("february"),
      t("march"),
      t("april"),
      t("may"),
      t("june"),
      t("july"),
    ],
    [t],
  );

  const firstChartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "transparent",
          borderColor: "rgba(255,255,255,.55)",
          pointBackgroundColor: "#321fdb",
          data: [65, 59, 84, 84, 51, 55, 40],
        },
      ],
    }),
    [labels],
  );

  const secondChartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "transparent",
          borderColor: "rgba(255,255,255,.55)",
          pointBackgroundColor: "#39f",
          data: [1, 18, 9, 17, 34, 22, 11],
        },
      ],
    }),
    [labels],
  );

  const conversionChartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgba(255,255,255,.2)",
          borderColor: "rgba(255,255,255,.55)",
          data: [78, 81, 80, 45, 34, 12, 40],
          fill: true,
        },
      ],
    }),
    [labels],
  );

  const sessionsLabels = useMemo(
    () => [
      t("january"),
      t("february"),
      t("march"),
      t("april"),
      t("may"),
      t("june"),
      t("july"),
      t("august"),
      t("september"),
      t("october"),
      t("november"),
      t("december"),
      t("january"),
      t("february"),
      t("march"),
      t("april"),
    ],
    [t],
  );

  const sessionsChartData = useMemo(
    () => ({
      labels: sessionsLabels,
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgba(255,255,255,.2)",
          borderColor: "rgba(255,255,255,.55)",
          data: [
            78,
            81,
            80,
            45,
            34,
            12,
            40,
            85,
            65,
            23,
            12,
            98,
            34,
            84,
            67,
            82,
          ],
          barPercentage: 0.6,
        },
      ],
    }),
    [sessionsLabels],
  );

  const closeMenusOnOutsideClick = () => {
    setOpenMenu(null);
  };

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeMenusOnOutsideClick();
        }
      }}
    >
      {/* Users */}
      <WidgetCard
        gradient="bg-gradient-to-br from-blue-600 to-blue-700"
        value="26K"
        change="-12.4%"
        direction="down"
        title={t("users")}
        dropdownOpen={openMenu === "users"}
        setDropdownOpen={(value) =>
          setOpenMenu(value ? "users" : null)
        }
        chart={
          withCharts ? (
            <div className="h-[90px] w-full px-3">
              <Line
                data={firstChartData}
                options={lineOptions}
              />
            </div>
          ) : null
        }
      />

      {/* Income */}
      <WidgetCard
        gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
        value="$6.200"
        change="40.9%"
        direction="up"
        title={t("income")}
        dropdownOpen={openMenu === "income"}
        setDropdownOpen={(value) =>
          setOpenMenu(value ? "income" : null)
        }
        chart={
          withCharts ? (
            <div className="h-[90px] w-full px-3">
              <Line
                data={secondChartData}
                options={lineOptions}
              />
            </div>
          ) : null
        }
      />

      {/* Conversion Rate */}
      <WidgetCard
        gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
        value="2.49%"
        change="84.7%"
        direction="up"
        title={t("conversionRate")}
        dropdownOpen={openMenu === "conversion"}
        setDropdownOpen={(value) =>
          setOpenMenu(value ? "conversion" : null)
        }
        chart={
          withCharts ? (
            <div className="h-[90px] w-full">
              <Line
                data={conversionChartData}
                options={filledLineOptions}
              />
            </div>
          ) : null
        }
      />

      {/* Sessions */}
      <WidgetCard
        gradient="bg-gradient-to-br from-red-500 to-red-600"
        value="44K"
        change="-23.6%"
        direction="down"
        title={t("sessions")}
        dropdownOpen={openMenu === "sessions"}
        setDropdownOpen={(value) =>
          setOpenMenu(value ? "sessions" : null)
        }
        chart={
          withCharts ? (
            <div className="h-[90px] w-full px-3">
              <Bar
                data={sessionsChartData}
                options={barOptions}
              />
            </div>
          ) : null
        }
      />
    </div>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

DropdownMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

WidgetCard.propTypes = {
  gradient: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  change: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(["up", "down"]).isRequired,
  chart: PropTypes.node,
  dropdownOpen: PropTypes.bool.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
};

export default WidgetsDropdown;