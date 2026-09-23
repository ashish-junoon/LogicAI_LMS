import React, { useEffect, useState } from "react";
import { formatNumber, KpiCard, SectionCard } from "./Helper";
import Chart from "./Chart";
import { InsightCard } from "./Helper";
import {
  CustomerProfile_DescriptionAPI,
  CustomerProfile_LoanSizeDistributionAPI,
  CustomerProfileAnalysisAPI,
  PortfolioHealth_CreditScoreDistributionAPI,
} from "../../api/functions";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const CustomerProfile = () => {
  const [CustomerProfileAnalysis, setCustomerProfileAnalysis] = useState({});
  const [csDistribution, setcsDistribution] = useState([]);
  const [LoanSizeDistribution, setLoanSizeDistribution] = useState([]);
  const [profileDescription, setprofileDescription] = useState({});

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
  });

  const csDetailData = {
    labels: csDistribution?.map((item) => item?.credit_score_range),
    datasets: [
      {
        data: csDistribution?.map((item) => item?.total_loans),
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

  const loanDistDetailData = {
    labels: LoanSizeDistribution?.map((item) => item?.loan_size_range),
    datasets: [
      {
        data: LoanSizeDistribution?.map((item) => item?.total_loans),
        backgroundColor: [
          "#3b82f6",
          "#6366f1",
          "#8b5cf6",
          "#a855f7",
          "#ec4899",
          "#06d6a0",
        ],
        borderWidth: 2,
        borderColor: "#c2c3c4",
      },
    ],
  };

  const fetchCustomerProfileAnalysis = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await CustomerProfileAnalysisAPI(req);
      if (response.status) {
        setCustomerProfileAnalysis(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading1: false }));
    }
  };

  const fetchCreditScoreDistribution = async () => {
    setIsLoading((prev) => ({ ...prev, loading2: true }));
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
      setIsLoading((prev) => ({ ...prev, loading2: false }));
    }
  };

  const fetchCustomerProfile_LoanSizeDistribution = async () => {
    setIsLoading((prev) => ({ ...prev, loading3: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await CustomerProfile_LoanSizeDistributionAPI(req);
      if (response.status) {
        setLoanSizeDistribution(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading3: false }));
    }
  };

  const fetchCustomerProfile_Description = async () => {
    setIsLoading((prev) => ({ ...prev, loading4: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await CustomerProfile_DescriptionAPI(req);
      if (response.status) {
        setprofileDescription(response.data);
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
    fetchCustomerProfileAnalysis();
    fetchCreditScoreDistribution();
    fetchCustomerProfile_LoanSizeDistribution();
    fetchCustomerProfile_Description();
  }, []);

  return (
    <div className="space-y-7">
      {/* <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider border-b border-gray-200 pb-2">
        Customer Profile Analysis
      </div> */}

      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Unique Customers"
            value={CustomerProfileAnalysis?.unique_customers?.toLocaleString()}
            sub={`Across ${CustomerProfileAnalysis?.total_loans?.toLocaleString()} loans`}
            color="#3b82f6"
            type={1}
          />
          <KpiCard
            label="Avg Monthly Salary"
            value={`₹${formatNumber(CustomerProfileAnalysis?.avg_monthly_salary)}`}
            //   value="₹1.2 L"
            sub={`Median ₹${formatNumber(CustomerProfileAnalysis?.median_salary)}`}
            //   sub={`Median ₹1.02 L`}
            color="#06d6a0"
            type={2}
          />
          <KpiCard
            label="Avg Loan Amount"
            value={`₹${formatNumber(CustomerProfileAnalysis?.avg_loan_amt)}`}
            //   value={`₹32.5 K`}
            sub="Range ₹1K – ₹1.05 L"
            color="#f59e0b"
            type={3}
          />
          <KpiCard
            label="Avg Credit Score"
            value={CustomerProfileAnalysis?.avg_credit_score}
            sub={`Median in ${CustomerProfileAnalysis?.avg_credit_score_median_value} band`}
            color="#8b5cf6"
            type={4}
          />
        </div>
      ) : (
        <div className="py-10 text-center text-sm font-medium text-slate-400">
          Loading customer profile…
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Credit Score Segments"
          subtitle="Borrower risk distribution"
          accent="bg-amber-500"
        >
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={csDetailData}
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
          title="Loan Size Distribution"
          subtitle="Portfolio concentration by loan band"
          accent="bg-violet-500"
        >
          {!isLoading?.loading3 ? (
            <div className="relative max-h-[320px] w-fit m-auto">
              <Chart
                type="pie"
                data={loanDistDetailData}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: { color: "#94a3b8", padding: 12, boxWidth: 10 },
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

      {!isLoading?.loading4 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <InsightCard
            type="info"
            title="Repeat Borrowers"
            body={profileDescription?.repeat_borrowers}
          />
          <InsightCard
            type="warn"
            title="Sub-prime Credit Concentration"
            body={profileDescription?.sub_prime_credit_concentration}
          />
          <InsightCard
            type="success"
            title="Stable Salary Profile"
            body={profileDescription?.stable_Salary_Profile}
          />
          <InsightCard
            type="info"
            title={`${profileDescription?.sector_name} Dominance`}
            body={profileDescription?.sector_dominance}
          />
        </div>
      ) : (
        <div className="py-10 text-center text-sm font-medium text-slate-400">
          Loading insights…
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
