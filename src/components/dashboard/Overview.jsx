import React, { useEffect, useState } from "react";
import { COLORS, fmtCr } from "./utils";
import { formatNumber, InsightCard, KpiCard } from "./Helper";
import Chart from "./Chart";
import {
  CustomerProfile_LoanSizeDistributionAPI,
  Overview_DescriptionAPI,
  Overview_LoanStatusDistributionAPI,
  Overview_MainAPI,
  Overview_MonthlyDisbursementsAPI,
  PortfolioHealth_NPAbySectorAPI,
} from "../../api/functions";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const Overview = () => {
  const [mainData, setMainData] = useState({});
  const [overViewDescription, setOverViewDescription] = useState({});
  const [loanStatusDistribution, setloanStatusDistribution] = useState([]);
  const [monthlyDisbursement, setmonthlyDisbursement] = useState([]);
  const [loanSizeDistribution, setLoanSizeDistribution] = useState([]);
  const [sectorNPA, setsectorNPA] = useState([]);

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
    loading5: false,
    loading6: false,
  });

  const totalLoan = loanStatusDistribution?.reduce((acc, val)=> val?.loan_count + acc, 0)
  const statusData = {
    labels: loanStatusDistribution?.map((item) => item?.loan_status),
    datasets: [
      {
        data: loanStatusDistribution?.map((item) => item?.loan_count),
        backgroundColor: [
          COLORS.paid,
          COLORS.npa,
          COLORS.pending,
          COLORS.foreclosure,
          COLORS.settled,
          COLORS["Waive Off"],
          "#64748b",
        ],
        borderWidth: 1,
        borderColor: "#c2c3c4",
      },
    ],
  };

  const monthlyData = {
    labels: monthlyDisbursement?.map((m) => m?.month_name),
    datasets: [
      {
        label: "Amount",
        data: monthlyDisbursement?.map((m) => m?.disbursed_amount),
        backgroundColor: "rgba(59,130,246,0.9)",
        borderColor: "#3b82f6",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const loanDistData = {
    labels: loanSizeDistribution?.map((range) => range?.loan_size_range),
    datasets: [
      {
        data: loanSizeDistribution?.map((loan) => loan?.total_loans),
        backgroundColor: [
          "#3b82f6",
          "#6366f1",
          "#8b5cf6",
          "#a855f7",
          "#ec4899",
          "#06d6a0",
        ],
        borderRadius: 5,
        borderWidth: 0,
      },
    ],
  };

  const sortedNPASector = [...(sectorNPA || [])]
    ?.sort((a, b) => b.total_loans - a.total_loans) // Highest to Lowest
    ?.slice(0, 10);

  const sectorData = {
    labels: sortedNPASector?.map((sector) => sector?.sector),
    datasets: [
      {
        label: "Loans",
        data: sortedNPASector?.map((sector) => sector?.total_loans),
        backgroundColor: "rgba(6,214,160,0.9)",
        borderColor: "#06d6a0",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const fetchOverview_Main = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await Overview_MainAPI(req);
      if (response.status) {
        setMainData(response.data);
      }else{
        toast.info(response.message || "Something went wrong!")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading1: false }));
    }
  };

  const fetchOverview_Description = async () => {
    setIsLoading((prev) => ({ ...prev, loading2: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await Overview_DescriptionAPI(req);
      if (response.status) {
        setOverViewDescription(response.data);
      }else{
        toast.info(response.message || "Something went wrong!")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading2: false }));
    }
  };

  const fetchOverview_LoanStatusDistribution = async () => {
    setIsLoading((prev) => ({ ...prev, loading3: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await Overview_LoanStatusDistributionAPI(req);
      if (response.status) {
        setloanStatusDistribution(response.data);
      }else{
        toast.info(response.message || "Something went wrong!")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading3: false }));
    }
  };

  const fetchOverview_MonthlyDisbursements = async () => {
    setIsLoading((prev) => ({ ...prev, loading4: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await Overview_MonthlyDisbursementsAPI(req);
      if (response.status) {
        setmonthlyDisbursement(response.data);
      }else{
        toast.info(response.message || "Something went wrong!")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading4: false }));
    }
  };

  const fetchCustomerProfile_LoanSizeDistribution = async () => {
    setIsLoading((prev) => ({ ...prev, loading5: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await CustomerProfile_LoanSizeDistributionAPI(req);
      if (response.status) {
        setLoanSizeDistribution(response.data);
      }else{
        toast.info(response.message || "Something went wrong!")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading5: false }));
    }
  };

  const fetchPortfolioHealthNPAbySector = async () => {
    setIsLoading((prev) => ({ ...prev, loading6: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await PortfolioHealth_NPAbySectorAPI(req);
      if (response.status) {
        setsectorNPA(response.data);
      }else{
        toast.info(response.message || "Something went wrong!")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading6: false }));
    }
  };

  useEffect(() => {
    fetchOverview_Main();
    fetchOverview_Description();
    fetchOverview_LoanStatusDistribution();
    fetchOverview_MonthlyDisbursements();
    fetchCustomerProfile_LoanSizeDistribution();
    fetchPortfolioHealthNPAbySector();
  }, []);

  return (
    <div className="space-y-5">
      {/* KPI Grid */}
      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1">
          <KpiCard
            icon="📋"
            label="Total Loans"
            value={mainData?.total_loans?.toLocaleString()}
            sub={`${mainData?.unique_customers?.toLocaleString()} unique customers`}
            color="#3b82f6"
            type={1}
          />
          <KpiCard
            icon="💰"
            label="Total Disbursed"
            value={formatNumber(mainData?.total_disbursed)}
            sub={`Avg ₹${mainData?.avg_per_loan} per loan`}
            color="#06d6a0"
            type={2}
          />
          <KpiCard
            icon="✅"
            label="Total Collected"
            value={`₹${formatNumber(mainData?.total_collected)}`}
            sub={`${mainData?.collection_rate}% collection rate`}
            color="#6ee7b7"
            type={3}
          />
          <KpiCard
            icon="🏦"
            label="Total Demand"
            value={`₹${formatNumber(mainData?.demand_amount)}`}
            // sub={`${mainData?.collection_rate}% collection rate`}
            color="#6ee7b7"
            type={3}
          />
          <KpiCard
            icon="⚠️"
            label="NPA Rate"
            value={`${mainData?.npa_rate}%`}
            sub={`${mainData?.total_npa?.toLocaleString()} loans at risk`}
            color="#ef4444"
            type={4}
          />
          {/* <KpiCard
            icon="🏦"
            label="Avg Credit Score"
            value={mainData?.avg_credit_score}
            sub="Sub-prime segment"
            color="#f59e0b"
            type={5}
          /> */}
          <KpiCard
            icon="🗺️"
            label="States Covered"
            value={mainData?.states_covered}
            sub="Primarily metro markets"
            color="#8b5cf6"
            type={6}
          />
        </div>
      ) : (
        <div className="text-center py-10 font-semibold">
          <p>Loading...</p>
        </div>
      )}

      {/* Insights */}
      {!isLoading?.loading2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          <InsightCard
            type="success"
            title="Strong Repayment Base"
            body={overViewDescription?.strong_repayment_base || "N/A"}
          />
          <InsightCard
            type="warn"
            title={`NPA Concentration in ${overViewDescription?.top_npa_sector}`}
            body={overViewDescription?.npa_concentration  || "N/A"}
          />
          <InsightCard
            type="danger"
            title="High Pending & Foreclosure Volume"
            body={overViewDescription?.high_pending_and_foreclosure_volume  || "N/A"}
          />
          <InsightCard
            type="info"
            title="Portfolio Scaling Rapidly"
            body={overViewDescription?.portfolio_scaling_rapidly  || "N/A"}
          />
        </div>
      ) : (
        <div className="text-center py-10 font-semibold">
          <p>Loading...</p>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {!isLoading?.loading3 ? (
          <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
            {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5"> */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Loan Status Distribution
                </div>
                <div className="text-[#64748b] text-[11px]">
                  All {totalLoan?.toLocaleString()} loans
                </div>
              </div>
            </div>
            <div className="relative max-h-[260px] w-fit m-auto">
              <Chart
                type="doughnut"
                data={statusData}
                options={{
                  cutout: "55%",
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: { color: "#94a3b8", padding: 5, boxWidth: 10 },
                    },
                  },
                  
                }}
              />
            </div>
          </div>
        ) : (
          <SkeletonLoader />
        )}

        {!isLoading?.loading4 ? (
          <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
            {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5"> */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Monthly Disbursements
                </div>
                <div className="text-[#64748b] text-[11px]">
                  Loan volume over time (₹)
                </div>
              </div>
            </div>
            <div className="relative max-h-[260px]">
              <Chart
                type="bar"
                data={monthlyData}
                options={{
                  scales: {
                    y: {
                      ticks: { callback: (v) => fmtCr(v) },
                      grid: { color: "#c2c3c4" },
                    },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <SkeletonLoader />
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {!isLoading?.loading5 ? (
          <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Loan Size Distribution
                </div>
                <div className="text-[#64748b] text-[11px]">
                  Number of loans by amount bucket
                </div>
              </div>
            </div>
            <div className="relative max-h-[260px]">
              <Chart
                type="bar"
                data={loanDistData}
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
          </div>
        ) : (
          <SkeletonLoader />
        )}

        {!isLoading?.loading6 ? (
          <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Top 10 Sectors by Volume
                </div>
                <div className="text-[#64748b] text-[11px]">
                  Number of loans
                </div>
              </div>
            </div>
            <div className="relative max-h-[260px]">
              <Chart
                type="bar"
                data={sectorData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { grid: { color: "#c2c3c4" } },
                    y: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } },
                    },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <SkeletonLoader />
        )}
      </div>
    </div>
  );
};

export default Overview;
