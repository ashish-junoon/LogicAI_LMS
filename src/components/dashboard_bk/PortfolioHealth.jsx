import React, { useEffect, useState } from "react";
import { KpiCard, Pill, ProgressBar } from "./Helper";
import Chart from "./Chart";
import {
  PortfolioHealth_CreditScoreDistributionAPI,
  PortfolioHealth_NPAbySectorAPI,
  PortfolioHealthAnalysisAPI,
} from "../../api/functions";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const PortfolioHealth = () => {
  const [PortfolioHealthAnalysis, setPortfolioHealthAnalysis] = useState({});
  const [csDistribution, setcsDistribution] = useState([]);
  const [sectorNPA, setsectorNPA] = useState([]);

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
    loading3: false,
  });
  
  const sectorList = [...sectorNPA];
  sectorList?.sort((a,b)=> a.total_npa_per - b.total_npa_per)

  const npaRateData = {
    labels: sectorNPA?.slice(0, 12)?.map((s) => s.sector),
    datasets: [
      {
        data: sectorNPA?.slice(0, 12)?.map((s) => s.total_npa_per),
        backgroundColor: sectorNPA
          ?.slice(0, 12)
          ?.map((s) =>
            s.total_npa_per > 20
              ? "#ef4444"
              : s.total_npa_per > 15
                ? "#f97316"
                : "#f59e0b",
          ),
        borderRadius: 4,
        borderWidth: 0,
      },
    ],
  };

  const totalLoans = csDistribution?.reduce(
    (sum, item) => sum + item.total_loans,
    0,
  );

  const maxItem =
    csDistribution?.length > 0
      ? csDistribution.reduce((max, item) =>
          item.total_loans > max.total_loans ? item : max,
        )
      : null;

  const creditScoreresult = {
    maxTotalLoans: maxItem?.total_loans,
    creditScoreRange: maxItem?.credit_score_range,
    percentage: ((maxItem?.total_loans / totalLoans) * 100).toFixed(2),
  };

  const creditScoreData = {
    labels: csDistribution?.map((label) => label?.credit_score_range),
    datasets: [
      {
        label: "",
        data: csDistribution?.map((data) => data?.total_loans),
        backgroundColor: [
          "#dc2626",
          "#f97316",
          "#f59e0b",
          "#3b82f6",
          "#06d6a0",
          "#10b981",
        ],
        borderRadius: 5,
        borderWidth: 0,
      },
    ],
  };

  const fetchPortfolioHealthAnalysis = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await PortfolioHealthAnalysisAPI(req);
      if (response.status) {
        setPortfolioHealthAnalysis(response.data);
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
        const filteredData = response?.data?.filter?.(
          (l) => l?.total_loans >= 30,
        );
        // console.log(filteredData);
        // setsectorNPA(response.data);
        setsectorNPA(filteredData);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading2: false }));
    }
  };

  const fetchCreditScoreDistribution = async () => {
    setIsLoading((prev) => ({ ...prev, loading3: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await PortfolioHealth_CreditScoreDistributionAPI(req);
      if (response.status) {
        setcsDistribution(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading3: false }));
    }
  };

  useEffect(() => {
    fetchPortfolioHealthAnalysis();
    fetchPortfolioHealthNPAbySector();
    fetchCreditScoreDistribution();
  }, []);

  return (
    <div className="space-y-7">
      {/* <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider border-b border-gray-200 pb-2">
        Portfolio Health Analysis
      </div> */}

      {/* Status KPIs */}
      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KpiCard
            label="Paid"
            value={PortfolioHealthAnalysis?.total_paid?.toLocaleString("en-IN")}
            sub={`${PortfolioHealthAnalysis?.total_paid_per}%`}
            color="#06d6a0"
            type={1}
          />
          <KpiCard
            label="NPA"
            value={PortfolioHealthAnalysis?.total_npa?.toLocaleString("en-IN")}
            sub={`${PortfolioHealthAnalysis?.total_npa_per}%`}
            color="#ef4444"
            type={2}
          />
          <KpiCard
            label="Pending"
            value={PortfolioHealthAnalysis?.total_pending?.toLocaleString(
              "en-IN",
            )}
            sub={`${PortfolioHealthAnalysis?.total_pending_per}%`}
            color="#f59e0b"
            type={3}
          />
          <KpiCard
            label="Foreclosure"
            value={PortfolioHealthAnalysis?.total_foreclouser?.toLocaleString(
              "en-IN",
            )}
            sub={`${PortfolioHealthAnalysis?.total_foreclouser_per}%`}
            color="#8b5cf6"
            type={4}
          />
          <KpiCard
            label="Settled"
            value={PortfolioHealthAnalysis?.total_settled?.toLocaleString(
              "en-IN",
            )}
            sub={`${PortfolioHealthAnalysis?.total_settled_per}%`}
            color="#3b82f6"
            type={5}
          />
        </div>
      ) : (
        <div className="text-center h-4">Loading...</div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5"> */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">NPA by Sector (Rate)</div>
              <div className="text-[#64748b] text-[11px]">
                % of loans in NPA per sector
              </div>
            </div>
          </div>
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={npaRateData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: {
                      max: 30,
                      ticks: { callback: (v) => v + "%" },
                      grid: { color: "#c2c3c4" },
                    },
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

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">
                Credit Score Distribution
              </div>
              <div className="text-[#64748b] text-[11px]">
                Borrower risk profile
              </div>
            </div>
          </div>
          {!isLoading?.loading3 ? (
            <>
              <div className="relative max-h-[260px]">
                <Chart
                  type="bar"
                  data={creditScoreData}
                  options={{
                    scales: {
                      y: { grid: { color: "#c2c3c4" } },
                      x: { grid: { display: false } },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-3.5 p-3 bg-gray-200 rounded-lg text-xs text-gray-900">
                <strong className="text-primary">Risk Note:</strong>{" "}
                <span className="font-semibold">
                  {creditScoreresult?.percentage}% of borrowers (
                  {creditScoreresult?.maxTotalLoans}) fall in the{" "}
                  {creditScoreresult?.creditScoreRange} range — just below fair
                  credit threshold. This segment requires closer monitoring.
                </span>
              </div>
            </>
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>

      {/* Sector NPA Table */}
      <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 overflow-x-auto">
        {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5 overflow-x-auto"> */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm font-semibold">Sector NPA Breakdown</div>
            <div className="text-[#64748b] text-[11px]">
              Sectors with ≥30 loans, sorted by NPA rate
            </div>
          </div>
        </div>
        {!isLoading?.loading2 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                  Sector
                </th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                  Total Loans
                </th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                  NPA Count
                </th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                  NPA Rate
                </th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                  Risk Level
                </th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                  NPA Rate Bar
                </th>
              </tr>
            </thead>

            <tbody>
              {sectorList?.map((s) => {
                const riskClass =
                  s.total_npa_per >= 20
                    ? "red"
                    : s.total_npa_per >= 15
                      ? "yellow"
                      : "green";
                const riskLabel =
                  s.total_npa_per >= 20
                    ? "High"
                    : s.total_npa_per >= 15
                      ? "Medium"
                      : "Low";
                return (
                  <tr
                    key={s.sector}
                    className="hover:bg-[rgba(59,130,246,0.04)]"
                  >
                    <td className="px-3 py-2.5 text-[13px] font-semibold border-b border-gray-200">
                      {s.sector}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">
                      {s.total_loans.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">
                      {s.npa_count}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] font-semibold border-b border-gray-200">
                      {s.total_npa_per}%
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">
                      <Pill color={riskClass}>{riskLabel}</Pill>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200 w-40">
                      <ProgressBar
                        value={s.total_npa_per}
                        color={
                          s.total_npa_per >= 20
                            ? "#ef4444"
                            : s.total_npa_per >= 15
                              ? "#f97316"
                              : "#06d6a0"
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center w-full col-span-full py-10">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioHealth;
