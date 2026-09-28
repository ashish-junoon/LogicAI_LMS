import React, { memo } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";

const NPABySectorRateChart = memo(({ sectorNPA, isLoading }) => {
  const npaRateData = {
    labels: sectorNPA?.slice(0, 12)?.map((s) => s.sector),
    datasets: [
      {
        data: sectorNPA?.slice(0, 12)?.map((s) => s.total_npa_per),
        backgroundColor: sectorNPA
          ?.slice(0, 12)
          ?.map((s) =>
            s.total_npa_per > 20
              ? "#C1443C"
              : s.total_npa_per > 15
                ? "#B9800F"
                : "#1F8F68"
          ),
        borderRadius: 2,
        borderWidth: 0,
      },
    ],
  };

  return (
    <Panel title="NPA by Sector (Rate)" sub="% of loans in NPA per sector">
      {!isLoading ? (
        <div className="relative max-h-[320px]">
          <Chart
            type="bar"
            data={npaRateData}
            options={{
              indexAxis: "y",
              scales: {
                x: {
                  max: 30,
                  ticks: { callback: (v) => v + "%" },
                  grid: { color: "#E8EBEE" },
                },
                y: {
                  grid: { display: false },
                  ticks: { font: { size: 10.5 } },
                },
              },
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      ) : (
        <SkeletonLoader />
      )}
    </Panel>
  );
});

export default NPABySectorRateChart;