import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import { fmtCr } from "./utils";
import { Panel } from "./Helper";
import {
  PortfolioHealth_NPAbySectorAPI,
  SectorGeographic_DisbursementsbyStateAPI,
  SectorGeographic_HouseTypeSplitAPI,
  SectorGeographic_MonthlyLoanCountAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const SectorsGeography = ({selectedProductsName}) => {
  const [disbursementsbyState, setDisbursementsbyState] = useState([]);
  const [sectorNPA, setsectorNPA] = useState([]);
  const [houseChartData, sethouseChartData] = useState({});

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
  });

  const [monthlyLoanCount, setMonthlyLoanCount] = useState([]);

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

  const fetchDisbursementsbyState = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
      const response = await SectorGeographic_DisbursementsbyStateAPI(req);
      if (response.status) {
        setDisbursementsbyState(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading1: false }));
    }
  };

  const fetchPortfolioHealthNPAbySector = async () => {
    setIsLoading((prev) => ({ ...prev, loading2: true }));
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
      const response = await PortfolioHealth_NPAbySectorAPI(req);
      if (response.status) {
        setsectorNPA(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading2: false }));
    }
  };

  const fetchSectorGeographic_MonthlyLoanCount = async () => {
    setIsLoading((prev) => ({ ...prev, loading3: true }));
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
      const response = await SectorGeographic_MonthlyLoanCountAPI(req);
      if (response.status) {
        setMonthlyLoanCount(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading3: false }));
    }
  };

  const fetchSectorGeographic_HouseTypeSplit = async () => {
    setIsLoading((prev) => ({ ...prev, loading4: true }));
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
      const response = await SectorGeographic_HouseTypeSplitAPI(req);
      if (response.status) {
        sethouseChartData(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading4: false }));
    }
  };

  useEffect(() => {
    fetchDisbursementsbyState();
    fetchPortfolioHealthNPAbySector();
    fetchSectorGeographic_MonthlyLoanCount();
    fetchSectorGeographic_HouseTypeSplit();
  }, [selectedProductsName]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Disbursements by State" sub="Total loan amount (₹)">
          {!isLoading?.loading1 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={stateData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { ticks: { callback: (v) => fmtCr(v) }, grid: { color: "#E8EBEE" } },
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

        <Panel title="NPA Count by Top Sectors" sub="Absolute NPA volume">
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={npaAbsData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { grid: { color: "#E8EBEE" } },
                    y: { grid: { display: false }, ticks: { font: { size: 10.5 } } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Monthly Loan Count" sub="Number of loans disbursed per month">
          {!isLoading?.loading3 ? (
            <div className="relative max-h-[260px]">
              <Chart
                type="line"
                data={monthlyCountData}
                options={{
                  scales: { y: { grid: { color: "#E8EBEE" } }, x: { grid: { display: false } } },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>

        <Panel title="House Type Split" sub="Owned vs Rented borrowers">
          {!isLoading?.loading4 ? (
            <>
              <div className="relative max-h-[260px]">
                <Chart
                  type="doughnut"
                  data={houseData}
                  options={{
                    cutout: "65%",
                    plugins: {
                      legend: { display: true, position: "bottom", labels: { color: "#5B6B7A", padding: 14, font: { size: 10.5 } } },
                    },
                  }}
                />
              </div>
              <div className="mt-3.5 text-[11.5px] text-[#5B6B7A] leading-relaxed space-y-1">
                <p><span className="text-[#2F6FA6] font-medium">Owned (53.4%)</span> — Slightly lower risk profile, asset-backed stability</p>
                <p><span className="text-[#6B54C7] font-medium">Rented (46.6%)</span> — Higher flexibility needs, slightly elevated NPA tendency</p>
              </div>
            </>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default SectorsGeography;
