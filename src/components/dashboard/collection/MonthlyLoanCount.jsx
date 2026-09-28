import React, { memo, useEffect, useState } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";
import { Financials_MonthlyRevenueTrendAPI } from "../../../api/dashboard";
import { toast } from "react-toastify";

const MonthlyLoanCountChart = memo(({ selectedProductsName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyLoanCount, setMonthlyLoanCount] = useState([]);

  const monthlyRevenueData = {
    labels: monthlyLoanCount?.map((m) => m.month_name),
    datasets: [
      {
        label: "Loans",
        data: monthlyLoanCount?.map((m) => m.monthlyrevenue_Amount),
        borderColor: "#1F8F68",
        backgroundColor: "rgba(31,143,104,0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 2.5,
        pointBackgroundColor: "#1F8F68",
      },
    ],
  };

  const fetchMonthlyLoanCount = async () => {
    setIsLoading(true);
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };

      const response = await Financials_MonthlyRevenueTrendAPI(req);

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
    fetchMonthlyLoanCount();
  }, [selectedProductsName]);

  return (
    <Panel title="Monthly Loan Count" sub="Number of loans disbursed per month">
      {!isLoading ? (
        <div className="relative max-h-[260px] w-full">
          <Chart
            type="line"
            data={monthlyRevenueData}
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

export default MonthlyLoanCountChart;