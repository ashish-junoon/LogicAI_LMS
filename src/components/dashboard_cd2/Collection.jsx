import React, { useEffect, useState } from "react";
import { formatNumber, KpiCard, SectionCard } from "./Helper";
import Chart from "./Chart";
import { InsightCard } from "./Helper";
import {
  CustomerProfile_DescriptionAPI,
  CustomerProfileAnalysisAPI,
  Financial_PerformanceAPI,
  Financials_CollectionEfficiencySummaryAPI,
  Financials_LoanTenureDistributionAPI,
  Financials_MonthlyRevenueTrendAPI,
  Financials_ROIDistributionAPI,
  PortfolioHealth_CreditScoreDistributionAPI,
} from "../../api/functions.js";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const Collection = () => {
  const [financialPerformance, setfinancialPerformance] = useState({});
  const [collectionEfficiencySummary, setCollectionEfficiencySummary] = useState({});
  const [loanTenureDistribution, setLoanTenureDistribution] = useState([]);
  const [monthlyLoanCount, setMonthlyLoanCount] = useState([]);
  const [ROIDistribution, setROIDistribution] = useState([]);
  const [profileDescription, setprofileDescription] = useState({});

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
    loading5: false,
  });

  const loanTenureDistributionDetailData = {
    labels: loanTenureDistribution?.map(
      (item) => item?.loan_tenure_distribution,
    ),
    datasets: [
      {
        data: loanTenureDistribution?.map(
          (item) => item?.loan_tenure_distribution_count,
        ),
        backgroundColor: [
          "#dc2626",
          "#f97316",
          "#f59e0b",
          "#3b82f6",
          "#06d6a0",
          "#10b981",
        ],
        borderRadius: 6,
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
        borderColor: "#06d6a0",
        backgroundColor: "rgba(6,214,160,0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#06d6a0",
      },
    ],
  };

  const RoiDistributionDetailsData = {
    labels: ROIDistribution?.map((item) => item?.roi_distribution),
    datasets: [
      {
        data: ROIDistribution?.map((item) => item?.roi_distribution_count),
        backgroundColor: [
          "#dc2626",
          "#f97316",
          "#f59e0b",
          "#3b82f6",
          "#06d6a0",
          "#10b981",
        ],
        borderWidth: 0,
        borderRadius: 6,
        // borderColor: "#c2c3c4",
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
        backgroundColor: ["#06d6a0", "#3b82f6", "#f59e0b"],
        borderWidth: 1,
        borderColor: "#c2c3c4",
      },
    ],
  };

  const fetchFinancial_Performance = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

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
      const req = {
        from_date: "",
        to_date: "",
      };

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
      const req = {
        from_date: "",
        to_date: "",
      };

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
      const req = {
        from_date: "",
        to_date: "",
      };

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
      const req = {
        from_date: "",
        to_date: "",
      };

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

  function pct(a,b){return b?(a/b*100).toFixed(1):'0.0';}

  useEffect(() => {
    fetchFinancial_Performance();
    fetchFinancials_CollectionEfficiencySummary();
    fetchloanTenureDistributionDetailData();
    fetchFinancials_MonthlyRevenueTrend();
    fetchFinancials_ROIDistribution();
  }, []);

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
          Financial Performance
        </div>
      </div>

      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard
            label="Total Disbursed"
            value={formatNumber(financialPerformance?.total_disbursed)}
            star
            sub={`Principal out`}
            color="#3b82f6"
            type={1}
          />
          <KpiCard
            label="Total Collected"
            value={`₹${formatNumber(financialPerformance?.total_collected)}`}
            star
            // sub={`${(
            //   (financialPerformance?.total_collected /
            //     financialPerformance?.total_disbursed) *
            //   100
            // ).toFixed(2)}% recovery`}
            sub={`${pct(financialPerformance?.total_collected, financialPerformance?.total_disbursed)}% recovery`}
            color="#06d6a0"
            type={2}
          />
          <KpiCard
            label="ROI Collected"
            value={`₹${formatNumber(financialPerformance?.roi_collected)}`}
            star
            //   value={`₹32.5 K`}
            sub="Interest income"
            color="#f59e0b"
            type={3}
          />
          <KpiCard
            label="Penal Collected"
            value={formatNumber(financialPerformance?.penal_collected)}
            star
            sub={`Penalty income`}
            color="#8b5cf6"
            type={4}
          />
          <KpiCard
            label="Outstanding"
            value={formatNumber(financialPerformance?.outstanding)}
            star
            sub={`Uncollected amount`}
            color="#8b5cf6"
            type={5}
          />
          <KpiCard
            label="Avg ROI Rate"
            value={`${financialPerformance?.avg_roi_rate}%`}
            sub={`Daily interest rate`}
            color="#8b5cf6"
            type={6}
          />
        </div>
      ) : (
        <div className="py-10 text-center text-sm font-medium text-slate-400">
          Loading financial performance…
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="ROI Distribution"
          subtitle="Interest rate bands"
          accent="bg-amber-500"
        >
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={RoiDistributionDetailsData}
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
          ) : (
            <SkeletonLoader />
          )}
        </SectionCard>

        <SectionCard
          title="Revenue Components"
          subtitle="Principal vs ROI vs Penal collected"
          accent="bg-emerald-500"
        >
          {!isLoading?.loading3 ? (
            <>
              <div className="relative max-h-[260px] w-fit m-auto">
                <Chart
                  type="doughnut"
                  data={revenueData}
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
            </>
          ) : (
            <SkeletonLoader />
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Monthly Loan Count"
          subtitle="Number of loans disbursed per month"
          accent="bg-blue-500"
        >
          {!isLoading?.loading4 ? (
            <div className="relative max-h-[260px] w-full">
              <Chart
                type="line"
                data={monthlyRevenueData}
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
        </SectionCard>

        <SectionCard
          title="Loan Tenure Distribution"
          subtitle="Tenure in days"
          accent="bg-violet-500"
        >
          {!isLoading?.loading5 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={loanTenureDistributionDetailData}
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
          ) : (
            <SkeletonLoader />
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Collection Efficiency Summary"
        subtitle="Disbursed vs Collected breakdown"
        accent="bg-emerald-500"
      >
        {!isLoading?.loading3 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(collectionEfficiencySummary)?.map(([key, value]) => {
              const isRate = ["collection_rate", "npa_rate"];
              const COLORS = {
                npa_exposure: "text-red-500",
                npa_rate: "text-red-500",
                principal_collected: "text-emerald-500",
                collection_rate: "text-emerald-500",
                roi_collected: "text-blue-500",
                penal_collected: "text-amber-500",
              };

              return (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200/70 bg-slate-50/60 px-3.5 py-3 transition-colors hover:bg-white hover:shadow-sm"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {key?.replaceAll("_", " ")}
                  </p>
                  <p className={`mt-1 font-bold ${COLORS[key] || "text-slate-700"} text-[18px]`}>
                    {isRate?.includes(key)
                      ? `${value}%`
                      : `₹${formatNumber(value)}`}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <SkeletonLoader />
        )}
      </SectionCard>
    </div>
  );
};

export default Collection;
