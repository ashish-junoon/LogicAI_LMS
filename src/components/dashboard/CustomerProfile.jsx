import React, { useEffect, useState } from "react";
import { formatNumber, KpiCard, InsightCard, Panel } from "./Helper";
import Chart from "./Chart";
import {
  CustomerProfile_DescriptionAPI,
  CustomerProfile_LoanSizeDistributionAPI,
  CustomerProfileAnalysisAPI,
  PortfolioHealth_CreditScoreDistributionAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const CustomerProfile = ({selectedProductsName}) => {
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
        backgroundColor: ["#C1443C", "#B9800F", "#96690F", "#2F6FA6", "#1F8F68", "#1B7A59"],
        borderRadius: 2,
        borderWidth: 0,
      },
    ],
  };

  const loanDistDetailData = {
    labels: LoanSizeDistribution?.map((item) => item?.loan_size_range),
    datasets: [
      {
        data: LoanSizeDistribution?.map((item) => item?.total_loans),
        backgroundColor: ["#2F6FA6", "#6B54C7", "#1F8F68", "#B9800F", "#C1443C", "#96690F"],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const fetchCustomerProfileAnalysis = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
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
      setIsLoading((prev) => ({ ...prev, loading2: false }));
    }
  };

  const fetchCustomerProfile_LoanSizeDistribution = async () => {
    setIsLoading((prev) => ({ ...prev, loading3: true }));
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
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
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
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
  }, [selectedProductsName]);

  return (
    <div className="space-y-6">
      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Unique Customers"
            value={CustomerProfileAnalysis?.unique_customers?.toLocaleString()}
            sub={`Across ${CustomerProfileAnalysis?.total_loans?.toLocaleString()} loans`}
            type={1}
          />
          <KpiCard
            label="Avg Monthly Salary"
            value={`₹${formatNumber(CustomerProfileAnalysis?.avg_monthly_salary)}`}
            sub={`Median ₹${formatNumber(CustomerProfileAnalysis?.median_salary)}`}
            type={5}
          />
          <KpiCard
            label="Avg Loan Amount"
            value={`₹${formatNumber(CustomerProfileAnalysis?.avg_loan_amt)}`}
            sub="Range ₹1K – ₹1.05L"
            type={2}
          />
          <KpiCard
            label="Avg Credit Score"
            value={CustomerProfileAnalysis?.avg_credit_score}
            sub={`Median in ${CustomerProfileAnalysis?.avg_credit_score_median_value} band`}
            type={4}
          />
        </div>
      ) : (
        <div className="text-center py-10 text-[#8B98A6] text-sm">Loading…</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Credit Score Segments" sub="Borrower risk distribution">
          {!isLoading?.loading2 ? (
            <div className="relative max-h-[320px]">
              <Chart
                type="bar"
                data={csDetailData}
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

        <Panel title="Loan Size Distribution" sub="Portfolio concentration by loan band">
          {!isLoading?.loading3 ? (
            <div className="relative max-h-[320px] w-fit m-auto">
              <Chart
                type="pie"
                data={loanDistDetailData}
                options={{
                  plugins: {
                    legend: { display: true, position: "bottom", labels: { color: "#5B6B7A", padding: 10, boxWidth: 8, font: { size: 10.5 } } },
                  },
                }}
              />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </Panel>
      </div>

      {!isLoading?.loading4 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <InsightCard type="info" title="Repeat Borrowers" body={profileDescription?.repeat_borrowers} />
          <InsightCard type="warn" title="Sub-prime Credit Concentration" body={profileDescription?.sub_prime_credit_concentration} />
          <InsightCard type="success" title="Stable Salary Profile" body={profileDescription?.stable_Salary_Profile} />
          <InsightCard type="info" title={`${profileDescription?.sector_name} Dominance`} body={profileDescription?.sector_dominance} />
        </div>
      ) : (
        <div className="text-center py-10 text-[#8B98A6] text-sm">Loading…</div>
      )}
    </div>
  );
};

export default CustomerProfile;
