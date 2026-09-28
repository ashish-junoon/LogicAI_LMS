import React, { memo, useEffect, useState } from "react";
import { Panel } from "../Helper";
import Chart from "../Chart";
import SkeletonLoader from "../../utils/SkeletonLoader";
import { SectorGeographic_HouseTypeSplitAPI } from "../../../api/dashboard";
import { toast } from "react-toastify";

const HouseTypeSplitChart = memo(({ selectedProductsName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [houseChartData, sethouseChartData] = useState({});

  const houseData = {
    labels: ["Owned", "Rented"],
    datasets: [
      {
        data: [houseChartData?.owned, houseChartData?.rented],
        backgroundColor: ["#2F6FA6", "#6B54C7"],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const fetchSectorGeographic_HouseTypeSplit = async () => {
    setIsLoading(true);
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };
      const response = await SectorGeographic_HouseTypeSplitAPI(req);
      if (response.status) {
        sethouseChartData(response.data);
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
    fetchSectorGeographic_HouseTypeSplit();
  }, [selectedProductsName]);

  return (
    <Panel title="House Type Split" sub="Owned vs Rented borrowers">
      {!isLoading ? (
        <>
          <div className="relative max-h-[260px]">
            <Chart
              type="doughnut"
              data={houseData}
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
          <div className="mt-3.5 text-[11.5px] text-[#5B6B7A] leading-relaxed space-y-1">
            <p>
              <span className="text-[#2F6FA6] font-medium">Owned (53.4%)</span>{" "}
              — Slightly lower risk profile, asset-backed stability
            </p>
            <p>
              <span className="text-[#6B54C7] font-medium">Rented (46.6%)</span>{" "}
              — Higher flexibility needs, slightly elevated NPA tendency
            </p>
          </div>
        </>
      ) : (
        <SkeletonLoader />
      )}
    </Panel>
  );
});

export default HouseTypeSplitChart;