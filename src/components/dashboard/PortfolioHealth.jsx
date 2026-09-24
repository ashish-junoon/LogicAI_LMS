import React, { useEffect, useState } from "react";
import { KpiCard, Pill, ProgressBar, Panel } from "./Helper";
import Chart from "./Chart";
import {
  PortfolioHealth_CreditScoreDistributionAPI,
  PortfolioHealth_NPAbySectorAPI,
  PortfolioHealthAnalysisAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const PortfolioHealth = ({selectedProductsName}) => {
  const [PortfolioHealthAnalysis, setPortfolioHealthAnalysis] = useState({});
  const [csDistribution, setcsDistribution] = useState([]);
  const [sectorNPA, setsectorNPA] = useState([]);

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
    loading3: false,
  });

  const sectorList = [...sectorNPA];
  sectorList?.sort((a, b) => a.total_npa_per - b.total_npa_per);

  const npaRateData = {
    labels: sectorNPA?.slice(0, 12)?.map((s) => s.sector),
    datasets: [
      {
        data: sectorNPA?.slice(0, 12)?.map((s) => s.total_npa_per),
        backgroundColor: sectorNPA
          ?.slice(0, 12)
          ?.map((s) =>
            s.total_npa_per > 20
              ? "#C1443C"
              : s.total_npa_per > 15
                ? "#B9800F"
                : "#1F8F68",
          ),
        borderRadius: 2,
        borderWidth: 0,
      },
    ],
  };

  const totalLoans = csDistribution?.reduce((sum, item) => sum + item.total_loans, 0);

  const maxItem =
    csDistribution?.length > 0
      ? csDistribution.reduce((max, item) => (item.total_loans > max.total_loans ? item : max))
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
        backgroundColor: ["#C1443C", "#B9800F", "#96690F", "#2F6FA6", "#1F8F68", "#1B7A59"],
        borderRadius: 2,
        borderWidth: 0,
      },
    ],
  };

  const fetchPortfolioHealthAnalysis = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
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
      const req = { from_date: "", to_date: "", product_code: selectedProductsName};
      const response = await PortfolioHealth_NPAbySectorAPI(req);
      if (response.status) {
        const filteredData = response?.data?.filter?.((l) => l?.total_loans >= 30);
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
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
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
  }, [selectedProductsName]);

  return (
    <div className="space-y-6">
      {/* Status KPIs */}
      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KpiCard
            label="Paid"
            value={PortfolioHealthAnalysis?.total_paid?.toLocaleString("en-IN")}
            sub={`${PortfolioHealthAnalysis?.total_paid_per}%`}
            type={5}
          />
          <KpiCard
            label="NPA"
            value={PortfolioHealthAnalysis?.total_npa?.toLocaleString("en-IN")}
            sub={`${PortfolioHealthAnalysis?.total_npa_per}%`}
            type={3}
          />
          <KpiCard
            label="Pending"
            value={PortfolioHealthAnalysis?.total_pending?.toLocaleString("en-IN")}
            sub={`${PortfolioHealthAnalysis?.total_pending_per}%`}
            type={2}
          />
          <KpiCard
            label="Foreclosure"
            value={PortfolioHealthAnalysis?.total_foreclouser?.toLocaleString("en-IN")}
            sub={`${PortfolioHealthAnalysis?.total_foreclouser_per}%`}
            type={4}
          />
          <KpiCard
            label="Settled"
            value={PortfolioHealthAnalysis?.total_settled?.toLocaleString("en-IN")}
            sub={`${PortfolioHealthAnalysis?.total_settled_per}%`}
            type={1}
          />
        </div>
      ) : (
        <div className="text-center py-6 text-[#8B98A6] text-sm">Loading…</div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="NPA by Sector (Rate)" sub="% of loans in NPA per sector">
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={npaRateData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { max: 30, ticks: { callback: (v) => v + "%" }, grid: { color: "#E8EBEE" } },
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

        <Panel title="Credit Score Distribution" sub="Borrower risk profile">
          {!isLoading?.loading3 ? (
            <>
              <div className="relative max-h-[260px]">
                <Chart
                  type="bar"
                  data={creditScoreData}
                  options={{
                    scales: { y: { grid: { color: "#E8EBEE" } }, x: { grid: { display: false } } },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
              <div className="mt-3.5 p-3 bg-[#F7F8F9] border border-[#E8EBEE] border-l-2 border-l-[#96690F] text-[12px] text-[#5B6B7A] leading-relaxed">
                <span className="text-[#96690F] font-medium">Risk Note — </span>
                {creditScoreresult?.percentage}% of borrowers ({creditScoreresult?.maxTotalLoans}) fall
                in the {creditScoreresult?.creditScoreRange} range — just below fair credit threshold.
                This segment requires closer monitoring.
              </div>
            </>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>
      </div>

      {/* Sector NPA Table */}
      <Panel title="Sector NPA Breakdown" sub="Sectors with ≥30 loans, sorted by NPA rate" className="overflow-x-auto">
        {!isLoading?.loading2 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Sector", "Total Loans", "NPA Count", "NPA Rate", "Risk Level", "NPA Rate Bar"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-[10px] font-medium text-[#8B98A6] uppercase tracking-[0.08em] border-b border-[#DCE1E6]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sectorList?.map((s) => {
                const riskClass = s.total_npa_per >= 20 ? "red" : s.total_npa_per >= 15 ? "yellow" : "green";
                const riskLabel = s.total_npa_per >= 20 ? "High" : s.total_npa_per >= 15 ? "Medium" : "Low";
                return (
                  <tr key={s.sector} className="hover:bg-black/[0.02]">
                    <td className="px-3 py-2.5 text-[13px] font-medium text-[#16202B] border-b border-[#E8EBEE]">
                      {s.sector}
                    </td>
                    <td
                      className="px-3 py-2.5 text-[13px] text-[#5B6B7A] tabular-nums border-b border-[#E8EBEE]"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {s.total_loans.toLocaleString()}
                    </td>
                    <td
                      className="px-3 py-2.5 text-[13px] text-[#5B6B7A] tabular-nums border-b border-[#E8EBEE]"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {s.npa_count}
                    </td>
                    <td
                      className="px-3 py-2.5 text-[13px] font-medium text-[#16202B] tabular-nums border-b border-[#E8EBEE]"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {s.total_npa_per}%
                    </td>
                    <td className="px-3 py-2.5 border-b border-[#E8EBEE]">
                      <Pill color={riskClass}>{riskLabel}</Pill>
                    </td>
                    <td className="px-3 py-2.5 border-b border-[#E8EBEE] w-40">
                      <ProgressBar
                        value={s.total_npa_per}
                        color={s.total_npa_per >= 20 ? "#C1443C" : s.total_npa_per >= 15 ? "#B9800F" : "#1F8F68"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center w-full py-10 text-[#8B98A6] text-sm">Loading…</div>
        )}
      </Panel>
    </div>
  );
};

export default PortfolioHealth;
