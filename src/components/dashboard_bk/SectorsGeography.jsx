import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import { fmtCr } from "./utils";
import {
  PortfolioHealth_NPAbySectorAPI,
  SectorGeographic_DisbursementsbyStateAPI,
  SectorGeographic_HouseTypeSplitAPI,
  SectorGeographic_MonthlyLoanCountAPI,
} from "../../api/functions";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const SectorsGeography = () => {
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
    ?.sort((a, b) => b.loan_amount - a.loan_amount) // Highest to Lowest
    ?.slice(0, 10);

  const stateData = {
    labels: sortedStates?.map((item) => item.state_name),
    datasets: [
      {
        data: sortedStates?.map((item) => item.loan_amount),
        backgroundColor: "rgba(59,130,246,0.9)",
        borderColor: "#3b82f6",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const sortedNpaData = [...(sectorNPA || [])]
    ?.sort((a, b) => b.npa_count - a.npa_count) // Highest to Lowest
    ?.slice(0, 10);

  const npaAbsData = {
    labels: sortedNpaData?.map((item) => item?.sector),
    datasets: [
      {
        data: sortedNpaData?.map((item) => item?.npa_count),
        backgroundColor: "rgba(239,68,68,0.9)",
        borderColor: "#ef4444",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const monthlyCountData = {
    labels: monthlyLoanCount?.map((m) => m.disbursed_loan_date),
    datasets: [
      {
        label: "Loans",
        data: monthlyLoanCount?.map((m) => m.disbursed_loan_count),
        borderColor: "#06d6a0",
        backgroundColor: "rgba(6,214,160,0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#06d6a0",
      },
    ],
  };

  const houseData = {
    labels: ["Owned", "Rented"],
    datasets: [
      {
        // data: [3816, 3330],
        data: [houseChartData?.owned, houseChartData?.rented],
        backgroundColor: ["#3b82f6", "#8b5cf6"],
        borderWidth: 2,
        borderColor: "#c2c3c4",
      },
    ],
  };

  const fetchDisbursementsbyState = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

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
      const req = {
        from_date: "",
        to_date: "",
      };

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
      const req = {
        from_date: "",
        to_date: "",
      };

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
      const req = {
        from_date: "",
        to_date: "",
      };

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
  }, []);

  return (
    <div className="space-y-7">
      {/* <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider border-b border-gray-200 pb-2">
        Sector & Geographic Analysis
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5"> */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">
                Disbursements by State
              </div>
              <div className="text-[#64748b] text-[12px]">
                Total loan amount (₹)
              </div>
            </div>
          </div>
          {!isLoading?.loading1 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={stateData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: {
                      ticks: { callback: (v) => fmtCr(v) },
                      grid: { color: "#c2c3c4" },
                    },
                    y: { grid: { display: false } },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </div>

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">
                NPA Count by Top Sectors
              </div>
              <div className="text-[#64748b] text-[11px]">
                Absolute NPA volume
              </div>
            </div>
          </div>
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={npaAbsData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { grid: { color: "#c2c3c4" } },
                    y: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">Monthly Loan Count</div>
              <div className="text-[#64748b] text-[11px]">
                Number of loans disbursed per month
              </div>
            </div>
          </div>
          {!isLoading?.loading3 ? (
            <div className="relative max-h-[260px]">
              <Chart
                type="line"
                data={monthlyCountData}
                options={{
                  scales: {
                    y: { grid: { color: "#c2c3c4" } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </div>

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">House Type Split</div>
              <div className="text-[#64748b] text-[11px]">
                Owned vs Rented borrowers
              </div>
            </div>
          </div>
          {!isLoading?.loading4 ? (
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
                        labels: { color: "#94a3b8", padding: 16 },
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-3.5 text-xs text-[#64748b] leading-relaxed">
                <p className="font-semibold">
                  <strong className="text-primary">Owned (53.4%)</strong> —
                  Slightly lower risk profile, asset-backed stability
                </p>
                <p className="font-semibold">
                  <strong className="text-primary">Rented (46.6%)</strong> —
                  Higher flexibility needs, slightly elevated NPA tendency
                </p>
              </div>
            </>
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>
    </div>
  );
};

export default SectorsGeography;
