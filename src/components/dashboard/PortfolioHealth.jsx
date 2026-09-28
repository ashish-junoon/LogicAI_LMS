import React, { useEffect, useState } from "react";
import { KpiCard, Pill, ProgressBar, Panel } from "./Helper";
import {
  PortfolioHealth_CreditScoreDistributionAPI,
  PortfolioHealth_NPAbySectorAPI,
  PortfolioHealthAnalysisAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import NPABySectorRateChart from "./portfolioHealth/NPABySectorRate";
import CreditScoreDistributionChart from "./portfolioHealth/CreditScoreDistribution";

const PortfolioHealth = ({ selectedProductsName }) => {
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

  const totalLoans = csDistribution?.reduce(
    (sum, item) => sum + item.total_loans,
    0
  );

  const maxItem =
    csDistribution?.length > 0
      ? csDistribution.reduce((max, item) =>
          item.total_loans > max.total_loans ? item : max
        )
      : null;

  const creditScoreresult = {
    maxTotalLoans: maxItem?.total_loans,
    creditScoreRange: maxItem?.credit_score_range,
    percentage: ((maxItem?.total_loans / totalLoans) * 100).toFixed(2),
  };

  const fetchPortfolioHealthAnalysis = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };
      const response = await PortfolioHealthAnalysisAPI(req);
      if (response.status) {
        setPortfolioHealthAnalysis(response.data);
      } else {
        console.info(response.message || "Something went wrong!");
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
        product_code: selectedProductsName,
      };
      const response = await PortfolioHealth_NPAbySectorAPI(req);
      if (response.status) {
        const filteredData = response?.data?.filter?.(
          (l) => l?.total_loans >= 30
        );
        setsectorNPA(filteredData);
      } else {
        console.info(response.message || "Something went wrong!");
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
        product_code: selectedProductsName,
      };
      const response = await PortfolioHealth_CreditScoreDistributionAPI(req);
      if (response.status) {
        setcsDistribution(response.data);
      } else {
        console.info(response.message || "Something went wrong!");
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
            value={PortfolioHealthAnalysis?.total_pending?.toLocaleString(
              "en-IN"
            )}
            sub={`${PortfolioHealthAnalysis?.total_pending_per}%`}
            type={2}
          />
          <KpiCard
            label="Foreclosure"
            value={PortfolioHealthAnalysis?.total_foreclouser?.toLocaleString(
              "en-IN"
            )}
            sub={`${PortfolioHealthAnalysis?.total_foreclouser_per}%`}
            type={4}
          />
          <KpiCard
            label="Settled"
            value={PortfolioHealthAnalysis?.total_settled?.toLocaleString(
              "en-IN"
            )}
            sub={`${PortfolioHealthAnalysis?.total_settled_per}%`}
            type={1}
          />
        </div>
      ) : (
        <div className="text-center py-6 text-[#8B98A6] text-sm">
          Loading…
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <NPABySectorRateChart
          sectorNPA={sectorNPA}
          isLoading={isLoading.loading2}
        />
        <CreditScoreDistributionChart
          csDistribution={csDistribution}
          creditScoreresult={creditScoreresult}
          isLoading={isLoading.loading3}
        />
      </div>

      {/* Sector NPA Table */}
      <Panel
        title="Sector NPA Breakdown"
        sub="Sectors with ≥30 loans, sorted by NPA rate"
        className="overflow-x-auto"
      >
        {!isLoading?.loading2 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Sector",
                  "Total Loans",
                  "NPA Count",
                  "NPA Rate",
                  "Risk Level",
                  "NPA Rate Bar",
                ].map((h) => (
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
                        color={
                          s.total_npa_per >= 20
                            ? "#C1443C"
                            : s.total_npa_per >= 15
                              ? "#B9800F"
                              : "#1F8F68"
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center w-full py-10 text-[#8B98A6] text-sm">
            Loading…
          </div>
        )}
      </Panel>
    </div>
  );
};

export default PortfolioHealth;