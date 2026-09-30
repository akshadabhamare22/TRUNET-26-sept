import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Facebook,
  Linkedin,
  Twitter,
  CalendarDays,
} from "lucide-react";
import { Line } from "react-chartjs-2";

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
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

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];

const createChartData = (data) => ({
  labels,
  datasets: [
    {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderColor: "rgba(255,255,255,0.55)",
      pointHoverBackgroundColor: "#fff",
      borderWidth: 2,
      data,
      fill: true,
    },
  ],
});

const SocialWidget = ({
  icon,
  values,
  background,
  chartData,
  withCharts,
  className = "",
}) => {
  return (
    <div
      className={`relative min-h-[150px] overflow-hidden rounded-lg shadow-sm ${className}`}
      style={{ background }}
    >
      {withCharts && (
        <div className="absolute inset-0 opacity-90">
          <Line
            data={createChartData(chartData)}
            options={chartOptions}
          />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
        <div className="flex items-center justify-center">
          {icon}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/20 pt-3">
          {values.map((item) => (
            <div key={item.title}>
              <div className="text-xl font-semibold">
                {item.value}
              </div>
              <div className="mt-0.5 text-xs text-white/75">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WidgetsBrand = ({ className = "", withCharts = false }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}
    >
      {/* Facebook */}
      <SocialWidget
        background="#3b5998"
        withCharts={withCharts}
        chartData={[65, 59, 84, 84, 51, 55, 40]}
        icon={<Facebook size={52} strokeWidth={1.5} />}
        values={[
          {
            title: t("friends"),
            value: "89K",
          },
          {
            title: t("feeds"),
            value: "459",
          },
        ]}
      />

      {/* Twitter */}
      <SocialWidget
        background="#00aced"
        withCharts={withCharts}
        chartData={[1, 13, 9, 17, 34, 41, 38]}
        icon={<Twitter size={52} strokeWidth={1.5} />}
        values={[
          {
            title: t("followers"),
            value: "973k",
          },
          {
            title: t("tweets"),
            value: "1.792",
          },
        ]}
      />

      {/* LinkedIn */}
      <SocialWidget
        background="#4875b4"
        withCharts={withCharts}
        chartData={[78, 81, 80, 45, 34, 12, 40]}
        icon={<Linkedin size={52} strokeWidth={1.5} />}
        values={[
          {
            title: t("contacts"),
            value: "500",
          },
          {
            title: t("feeds"),
            value: "1.292",
          },
        ]}
      />

      {/* Events */}
      <SocialWidget
        background="#f9b115"
        withCharts={withCharts}
        chartData={[35, 23, 56, 22, 97, 23, 64]}
        icon={<CalendarDays size={52} strokeWidth={1.5} />}
        values={[
          {
            title: t("events"),
            value: "12+",
          },
          {
            title: t("meetings"),
            value: "4",
          },
        ]}
      />
    </div>
  );
};

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsBrand;