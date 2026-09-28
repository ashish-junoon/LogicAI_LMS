import React, { memo } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";

const RevenueComponentsChart = memo(({ data, isLoading }) => {
  const revenueData = {
    labels: ["Principal", "ROI", "Penal"],
    datasets: [
      {
        data: [
          data?.principal_collected,
          data?.roi_collected,
          data?.penal_collected,
        ],
        backgroundColor: ["#1F8F68", "#2F6FA6", "#B9800F"],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  return (
    <Panel title="Revenue Components" sub="Principal vs ROI vs Penal collected">
      {!isLoading ? (
        <div className="relative max-h-65 w-fit m-auto">
          <Chart
            type="doughnut"
            data={revenueData}
            options={{
              cutout: "65%",
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  labels: {
                    color: "#5B6B7A",
                    padding: 14,
                    font: { size: 10.5 },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <SkeletonLoader />
      )}
    </Panel>
  );
});

export default RevenueComponentsChart;