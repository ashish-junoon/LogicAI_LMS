import React, { useEffect, useState } from "react";
import { formatNumber, KpiCard, Panel } from "./Helper";
import {
  Financial_PerformanceAPI,
  Financials_CollectionEfficiencySummaryAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";
import ROIDistributionChart from "./collection/ROIDistributionChart";
import RevenueComponentsChart from "./collection/RevenueComponents";
import MonthlyLoanCountChart from "./collection/MonthlyLoanCount";
import LoanTenureDistributionChart from "./collection/LoanTenureDistribution";

const Collection = ({ selectedProductsName }) => {
  const [financialPerformance, setfinancialPerformance] = useState({});
  const [collectionEfficiencySummary, setCollectionEfficiencySummary] =
    useState({});

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading3: false,
  });

  const fetchFinancial_Performance = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };

      const response = await Financial_PerformanceAPI(req);

      if (response.status) {
        setfinancialPerformance(response.data[0]);
      } else {
        console.info(response.message || "Something went wrong!");
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
        product_code: selectedProductsName,
      };

      const response = await Financials_CollectionEfficiencySummaryAPI(req);

      if (response.status) {
        setCollectionEfficiencySummary(response.data[0]);
      } else {
        console.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading3: false }));
    }
  };

  function pct(a, b) {
    return b ? ((a / b) * 100).toFixed(1) : "0.0";
  }

  useEffect(() => {
    fetchFinancial_Performance();
    fetchFinancials_CollectionEfficiencySummary();
  }, [selectedProductsName]);

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
          <KpiCard
            label="Total Disbursed"
            value={formatNumber(financialPerformance?.total_disbursed)}
            sub="Principal out"
            type={1}
          />
          <KpiCard
            label="Total Collected"
            value={`₹${formatNumber(financialPerformance?.total_collected)}`}
            sub={`${pct(
              financialPerformance?.total_collected,
              financialPerformance?.total_disbursed
            )}% recovery`}
            type={5}
          />
          <KpiCard
            label="ROI Collected"
            value={`₹${formatNumber(financialPerformance?.roi_collected)}`}
            sub="Interest income"
            type={2}
          />
          <KpiCard
            label="Penal Collected"
            value={formatNumber(financialPerformance?.penal_collected)}
            sub="Penalty income"
            type={4}
          />
          <KpiCard
            label="Outstanding"
            value={formatNumber(financialPerformance?.outstanding)}
            sub="Uncollected amount"
            type={3}
          />
          <KpiCard
            label="Avg ROI Rate"
            value={`${financialPerformance?.avg_roi_rate}%`}
            sub="Daily interest rate"
            type={6}
          />
        </div>
      ) : (
        <div className="text-center py-10 text-[#8B98A6] text-sm">
          Loading…
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ROIDistributionChart selectedProductsName={selectedProductsName} />

        <RevenueComponentsChart
          data={collectionEfficiencySummary}
          isLoading={isLoading.loading3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MonthlyLoanCountChart selectedProductsName={selectedProductsName} />

        <LoanTenureDistributionChart
          selectedProductsName={selectedProductsName}
        />
      </div>

      <Panel
        title="Collection Efficiency Summary"
        sub="Disbursed vs Collected breakdown"
      >
        {!isLoading?.loading3 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(collectionEfficiencySummary)?.map(([key, value]) => {
              const isRate = ["collection_rate", "npa_rate"];

              return (
                <div
                  key={key}
                  className="bg-[#F7F8F9] border border-[#E8EBEE] px-3.5 py-3"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8B98A6]">
                    {key?.replaceAll("_", " ")}
                  </p>
                  <p
                    className="mt-1 text-[16px] font-semibold tabular-nums"
                    style={{
                      color: effColors[key] || "#16202B",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
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
      </Panel>
    </div>
  );
};

export default Collection;