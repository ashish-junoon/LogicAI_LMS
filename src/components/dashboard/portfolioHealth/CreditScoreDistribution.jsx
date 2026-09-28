import React, { memo } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";

const CreditScoreDistributionChart = memo(
  ({ csDistribution, creditScoreresult, isLoading }) => {
    const creditScoreData = {
      labels: csDistribution?.map((label) => label?.credit_score_range),
      datasets: [
        {
          label: "",
          data: csDistribution?.map((data) => data?.total_loans),
          backgroundColor: [
            "#C1443C",
            "#B9800F",
            "#96690F",
            "#2F6FA6",
            "#1F8F68",
            "#1B7A59",
          ],
          borderRadius: 2,
          borderWidth: 0,
        },
      ],
    };

    return (
      <Panel title="Credit Score Distribution" sub="Borrower risk profile">
        {!isLoading ? (
          <>
            <div className="relative max-h-[260px]">
              <Chart
                type="bar"
                data={creditScoreData}
                options={{
                  scales: {
                    y: { grid: { color: "#E8EBEE" } },
                    x: { grid: { display: false } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            <div className="mt-3.5 p-3 bg-[#F7F8F9] border border-[#E8EBEE] border-l-2 border-l-[#96690F] text-[12px] text-[#5B6B7A] leading-relaxed">
              <span className="text-[#96690F] font-medium">Risk Note — </span>
              {creditScoreresult?.percentage}% of borrowers (
              {creditScoreresult?.maxTotalLoans}) fall in the{" "}
              {creditScoreresult?.creditScoreRange} range — just below fair
              credit threshold. This segment requires closer monitoring.
            </div>
          </>
        ) : (
          <SkeletonLoader />
        )}
      </Panel>
    );
  }
);

export default CreditScoreDistributionChart;