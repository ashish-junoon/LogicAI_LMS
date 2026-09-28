import React, { memo, useEffect, useState } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";
import { fmtCr } from "../utils";
import { SectorGeographic_DisbursementsbyStateAPI } from "../../../api/dashboard";
import { toast } from "react-toastify";

const DisbursementsByStateChart = memo(({ selectedProductsName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [disbursementsbyState, setDisbursementsbyState] = useState([]);

  const sortedStates = [...(disbursementsbyState || [])]
    ?.sort((a, b) => b.loan_amount - a.loan_amount)
    ?.slice(0, 10);

  const stateData = {
    labels: sortedStates?.map((item) => item.state_name),
    datasets: [
      {
        data: sortedStates?.map((item) => item.loan_amount),
        backgroundColor: "rgba(47,111,166,0.85)",
        borderColor: "#2F6FA6",
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const fetchDisbursementsbyState = async () => {
    setIsLoading(true);
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };
      const response = await SectorGeographic_DisbursementsbyStateAPI(req);
      if (response.status) {
        setDisbursementsbyState(response.data);
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
    fetchDisbursementsbyState();
  }, [selectedProductsName]);

  return (
    <Panel title="Disbursements by State" sub="Total loan amount (₹)">
      {!isLoading ? (
        <div className="relative max-h-[320px]">
          <Chart
            type="bar"
            data={stateData}
            options={{
              indexAxis: "y",
              scales: {
                x: {
                  ticks: { callback: (v) => fmtCr(v) },
                  grid: { color: "#E8EBEE" },
                },
                y: { grid: { display: false } },
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

export default DisbursementsByStateChart;