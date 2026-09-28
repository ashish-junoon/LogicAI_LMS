import React, { memo, useEffect, useState } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";
import { PortfolioHealth_NPAbySectorAPI } from "../../../api/dashboard";
import { toast } from "react-toastify";

const NPABySectorChart = memo(({ selectedProductsName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sectorNPA, setsectorNPA] = useState([]);

  const sortedNpaData = [...(sectorNPA || [])]
    ?.sort((a, b) => b.npa_count - a.npa_count)
    ?.slice(0, 10);

  const npaAbsData = {
    labels: sortedNpaData?.map((item) => item?.sector),
    datasets: [
      {
        data: sortedNpaData?.map((item) => item?.npa_count),
        backgroundColor: "rgba(193,68,60,0.85)",
        borderColor: "#C1443C",
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const fetchPortfolioHealthNPAbySector = async () => {
    setIsLoading(true);
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };
      const response = await PortfolioHealth_NPAbySectorAPI(req);
      if (response.status) {
        setsectorNPA(response.data);
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
    fetchPortfolioHealthNPAbySector();
  }, [selectedProductsName]);

  return (
    <Panel title="NPA Count by Top Sectors" sub="Absolute NPA volume">
      {!isLoading ? (
        <div className="relative max-h-[320px]">
          <Chart
            type="bar"
            data={npaAbsData}
            options={{
              indexAxis: "y",
              scales: {
                x: { grid: { color: "#E8EBEE" } },
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

export default NPABySectorChart;