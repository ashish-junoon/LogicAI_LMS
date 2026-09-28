import React, { memo, useEffect, useState } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";
import { Financials_LoanTenureDistributionAPI } from "../../../api/dashboard";
import { toast } from "react-toastify";

const LoanTenureDistributionChart = memo(({ selectedProductsName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loanTenureDistribution, setLoanTenureDistribution] = useState([]);

  const loanTenureDistributionDetailData = {
    labels: loanTenureDistribution?.map(
      (item) => item?.loan_tenure_distribution
    ),
    datasets: [
      {
        data: loanTenureDistribution?.map(
          (item) => item?.loan_tenure_distribution_count
        ),
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

  const fetchLoanTenureDistribution = async () => {
    setIsLoading(true);
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };

      const response = await Financials_LoanTenureDistributionAPI(req);

      if (response.status) {
        setLoanTenureDistribution(response.data);
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
    fetchLoanTenureDistribution();
  }, [selectedProductsName]);

  return (
    <Panel title="Loan Tenure Distribution" sub="Tenure in days">
      {!isLoading ? (
        <div className="relative max-h-[320px]">
          <Chart
            type="bar"
            data={loanTenureDistributionDetailData}
            options={{
              scales: {
                y: { grid: { color: "#E8EBEE" } },
                x: { grid: { display: false } },
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

export default LoanTenureDistributionChart;