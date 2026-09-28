import React, { memo, useEffect, useState } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";
import { SectorGeographic_MonthlyLoanCountAPI } from "../../../api/dashboard";
import { toast } from "react-toastify";

const SectorMonthlyLoanCountChart = memo(({ selectedProductsName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyLoanCount, setMonthlyLoanCount] = useState([]);

  const monthlyCountData = {
    labels: monthlyLoanCount?.map((m) => m.disbursed_loan_date),
    datasets: [
      {
        label: "Loans",
        data: monthlyLoanCount?.map((m) => m.disbursed_loan_count),
        borderColor: "#1F8F68",
        backgroundColor: "rgba(31,143,104,0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 2.5,
        pointBackgroundColor: "#1F8F68",
      },
    ],
  };

  const fetchSectorGeographic_MonthlyLoanCount = async () => {
    setIsLoading(true);
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };
      const response = await SectorGeographic_MonthlyLoanCountAPI(req);
      if (response.status) {
        setMonthlyLoanCount(response.data);
      } else {
        console.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectorGeographic_MonthlyLoanCount();
  }, [selectedProductsName]);

  return (
    <Panel title="Monthly Loan Count" sub="Number of loans disbursed per month">
      {!isLoading ? (
        <div className="relative max-h-[260px]">
          <Chart
            type="line"
            data={monthlyCountData}
            options={{
              scales: {
                y: { grid: { color: "#E8EBEE" } },
                x: { grid: { display: false } },
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

export default SectorMonthlyLoanCountChart;