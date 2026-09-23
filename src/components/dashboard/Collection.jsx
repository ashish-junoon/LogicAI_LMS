import React, { useEffect, useState } from "react";
import { formatNumber, KpiCard, Panel } from "./Helper";
import Chart from "./Chart";
import {
  Financial_PerformanceAPI,
  Financials_CollectionEfficiencySummaryAPI,
  Financials_LoanTenureDistributionAPI,
  Financials_MonthlyRevenueTrendAPI,
  Financials_ROIDistributionAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const Collection = () => {
  const [financialPerformance, setfinancialPerformance] = useState({});
  const [collectionEfficiencySummary, setCollectionEfficiencySummary] = useState({});
  const [loanTenureDistribution, setLoanTenureDistribution] = useState([]);
  const [monthlyLoanCount, setMonthlyLoanCount] = useState([]);
  const [ROIDistribution, setROIDistribution] = useState([]);

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
    loading5: false,
  });

  const loanTenureDistributionDetailData = {
    labels: loanTenureDistribution?.map((item) => item?.loan_tenure_distribution),
    datasets: [
      {
        data: loanTenureDistribution?.map((item) => item?.loan_tenure_distribution_count),
        backgroundColor: ["#C1443C", "#B9800F", "#96690F", "#2F6FA6", "#1F8F68", "#1B7A59"],
        borderRadius: 2,
        borderWidth: 0,
      },
    ],
  };

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

  const RoiDistributionDetailsData = {
    labels: ROIDistribution?.map((item) => item?.roi_distribution),
    datasets: [
      {
        data: ROIDistribution?.map((item) => item?.roi_distribution_count),
        backgroundColor: ["#C1443C", "#B9800F", "#96690F", "#2F6FA6", "#1F8F68", "#1B7A59"],
        borderWidth: 0,
        borderRadius: 2,
      },
    ],
  };

  const revenueData = {
    labels: ["Principal", "ROI", "Penal"],
    datasets: [
      {
        data: [
          collectionEfficiencySummary?.principal_collected,
          collectionEfficiencySummary?.roi_collected,
          collectionEfficiencySummary?.penal_collected,
        ],
        backgroundColor: ["#1F8F68", "#2F6FA6", "#B9800F"],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const fetchFinancial_Performance = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = { from_date: "", to_date: "" };
      const response = await Financial_PerformanceAPI(req);
      if (response.status) {
        setfinancialPerformance(response.data[0]);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading1: false }));
    }
  };

  const fetchFinancials_CollectionEfficiencySummary = async () => {
    setIsLoading((prev) => ({ ...prev, loading3: true }));
    try {
      const req = { from_date: "", to_date: "" };
      const response = await Financials_CollectionEfficiencySummaryAPI(req);
      if (response.status) {
        setCollectionEfficiencySummary(response.data[0]);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading3: false }));
    }
  };

  const fetchloanTenureDistributionDetailData = async () => {
    setIsLoading((prev) => ({ ...prev, loading5: true }));
    try {
      const req = { from_date: "", to_date: "" };
      const response = await Financials_LoanTenureDistributionAPI(req);
      if (response.status) {
        setLoanTenureDistribution(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading5: false }));
    }
  };

  const fetchFinancials_MonthlyRevenueTrend = async () => {
    setIsLoading((prev) => ({ ...prev, loading4: true }));
    try {
      const req = { from_date: "", to_date: "" };
      const response = await Financials_MonthlyRevenueTrendAPI(req);
      if (response.status) {
        setMonthlyLoanCount(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading4: false }));
    }
  };

  const fetchFinancials_ROIDistribution = async () => {
    setIsLoading((prev) => ({ ...prev, loading2: true }));
    try {
      const req = { from_date: "", to_date: "" };
      const response = await Financials_ROIDistributionAPI(req);
      if (response.status) {
        setROIDistribution(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading2: false }));
    }
  };

  function pct(a, b) {
    return b ? ((a / b) * 100).toFixed(1) : "0.0";
  }

  useEffect(() => {
    fetchFinancial_Performance();
    fetchFinancials_CollectionEfficiencySummary();
    fetchloanTenureDistributionDetailData();
    fetchFinancials_MonthlyRevenueTrend();
    fetchFinancials_ROIDistribution();
  }, []);

  const effColors = {
    npa_exposure: "#C1443C",
    npa_rate: "#C1443C",
    principal_collected: "#1F8F68",
    collection_rate: "#1F8F68",
    roi_collected: "#2F6FA6",
    penal_collected: "#B9800F",
  };

  return (
    <div className="space-y-6">
      <div className="text-[11px] font-medium text-[#8B98A6] uppercase tracking-[0.12em] border-b border-[#DCE1E6] pb-2.5">
        Financial Performance
      </div>

      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Total Disbursed" value={formatNumber(financialPerformance?.total_disbursed)} sub="Principal out" type={1} />
          <KpiCard
            label="Total Collected"
            value={`₹${formatNumber(financialPerformance?.total_collected)}`}
            sub={`${pct(financialPerformance?.total_collected, financialPerformance?.total_disbursed)}% recovery`}
            type={5}
          />
          <KpiCard label="ROI Collected" value={`₹${formatNumber(financialPerformance?.roi_collected)}`} sub="Interest income" type={2} />
          <KpiCard label="Penal Collected" value={formatNumber(financialPerformance?.penal_collected)} sub="Penalty income" type={4} />
          <KpiCard label="Outstanding" value={formatNumber(financialPerformance?.outstanding)} sub="Uncollected amount" type={3} />
          <KpiCard label="Avg ROI Rate" value={`${financialPerformance?.avg_roi_rate}%`} sub="Daily interest rate" type={6} />
        </div>
      ) : (
        <div className="text-center py-10 text-[#8B98A6] text-sm">Loading…</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="ROI Distribution" sub="Interest rate bands">
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={RoiDistributionDetailsData}
                options={{
                  scales: { y: { grid: { color: "#E8EBEE" } }, x: { grid: { display: false } } },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>

        <Panel title="Revenue Components" sub="Principal vs ROI vs Penal collected">
          {!isLoading?.loading3 ? (
            <div className="relative max-h-[260px] w-fit m-auto">
              <Chart
                type="doughnut"
                data={revenueData}
                options={{
                  cutout: "65%",
                  plugins: {
                    legend: { display: true, position: "bottom", labels: { color: "#5B6B7A", padding: 14, font: { size: 10.5 } } },
                  },
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
          {!isLoading?.loading4 ? (
            <div className="relative max-h-[260px] w-full">
              <Chart
                type="line"
                data={monthlyRevenueData}
                options={{
                  scales: { y: { grid: { color: "#E8EBEE" } }, x: { grid: { display: false } } },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>

        <Panel title="Loan Tenure Distribution" sub="Tenure in days">
          {!isLoading?.loading5 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={loanTenureDistributionDetailData}
                options={{
                  scales: { y: { grid: { color: "#E8EBEE" } }, x: { grid: { display: false } } },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>
      </div>

      <Panel title="Collection Efficiency Summary" sub="Disbursed vs Collected breakdown">
        {!isLoading?.loading3 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(collectionEfficiencySummary)?.map(([key, value]) => {
              const isRate = ["collection_rate", "npa_rate"];
              return (
                <div key={key} className="bg-[#F7F8F9] border border-[#E8EBEE] px-3.5 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8B98A6]">
                    {key?.replaceAll("_", " ")}
                  </p>
                  <p
                    className="mt-1 text-[16px] font-semibold tabular-nums"
                    style={{ color: effColors[key] || "#16202B", fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {isRate?.includes(key) ? `${value}%` : `₹${formatNumber(value)}`}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <SkeletonLoader />
        )}
      </Panel>
    </div>
  );
};

export default Collection;
