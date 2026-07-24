import React, { useEffect, useState } from "react";
import { formatNumber, KpiCard } from "./Helper";
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

const Collection = () => {
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
      <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider border-b border-gray-200 pb-2">
        Financial Performance
      </div>

      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <KpiCard
            label="Total Disbursed"
            value={CustomerProfileAnalysis?.unique_customers?.toLocaleString()}
            sub={`Principal out`}
            color="#3b82f6"
            type={1}
          />
          <KpiCard
            label="Total Collected"
            value={`₹${formatNumber(CustomerProfileAnalysis?.avg_monthly_salary)}`}
            //   value="₹1.2 L"
            sub={`86.9% recovery`}
            //   sub={`Median ₹1.02 L`}
            color="#06d6a0"
            type={2}
          />
          <KpiCard
            label="ROI Collected"
            value={`₹${formatNumber(CustomerProfileAnalysis?.avg_loan_amt)}`}
            //   value={`₹32.5 K`}
            sub="Interest income"
            color="#f59e0b"
            type={3}
          />
          <KpiCard
            label="Penal Collected"
            value={CustomerProfileAnalysis?.avg_credit_score}
            sub={`Penalty income`}
            color="#8b5cf6"
            type={4}
          />
          <KpiCard
            label="Outstanding"
            value={CustomerProfileAnalysis?.avg_credit_score}
            sub={`Uncollected amount`}
            color="#8b5cf6"
            type={5}
          />
          <KpiCard
            label="Avg ROI Rate"
            value={`${CustomerProfileAnalysis?.avg_credit_score}%`}
            sub={`Daily interest rate`}
            color="#8b5cf6"
            type={6}
          />
        </div>
      ) : (
        <div className="text-center py-10 font-semibold">
          <p>Loading...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">Credit Score Segments</div>
              <div className="text-[#64748b] text-[11px]">
                Borrower risk distribution
              </div>
            </div>
          </div>
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
        </div>

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5"> */}
          {/* <div className="flex justify-between items-center mb-4">
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
            </div> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">Credit Score Segments</div>
              <div className="text-[#64748b] text-[11px]">
                Borrower risk distribution
              </div>
            </div>
          </div>
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              {/* <Chart
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
              /> */}
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </div>

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">Credit Score Segments</div>
              <div className="text-[#64748b] text-[11px]">
                Borrower risk distribution
              </div>
            </div>
          </div>
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
        </div>
      </div>

      <div className="border border-gray-200 p-5 rounded-xl bg-gray-150 bg-gray-50">
        <p className="font-semibold">Collection Efficiency Summary</p>
        <p className="font-gray-200 text-[12px]">
          Disbursed vs Collected breakdown
        </p>
        <div className="grid grid-cols-6 gap-2 mt-3">
          {[
            {
              label: "Principal Collected",
              value: "₹15.7 Cr",
            },
            {
              label: "ROI Collected",
              value: "₹4.9 Cr",
            },
            {
              label: "Penal Collected",
              value: "₹33.3 L",
            },
            {
              label: "NPA Exposure",
              value: "₹3.7 Cr",
            },
            {
              label: "Collection Rate",
              value: "86.9%",
            },
            {
              label: "NPA Rate",
              value: "16.3%",
            },
          ]?.map((item) => {
            return (
              <div className="bg-white border border-gray-200 shadow-lg rounded-lg py-3 px-3.5">
                <p className="uppercase text-[10px] font-semibold">{item?.label}</p>
                <p className="font-bold text-green-600 text-[18px]">
                  {item?.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Collection;
