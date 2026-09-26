import React, { useEffect, useState } from "react";
import { COLORS, STATUS_RAMP, fmtCr } from "./utils";
import { formatNumber, InsightCard, KpiCard, Panel } from "./Helper";
import Chart from "./Chart";
import {
  CustomerProfile_LoanSizeDistributionAPI,
  Overview_DescriptionAPI,
  Overview_LoanStatusDistributionAPI,
  Overview_MainAPI,
  Overview_MonthlyDisbursementsAPI,
  PortfolioHealth_NPAbySectorAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";

const Overview = ({ selectedProductsName }) => {
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

  const totalLoan = loanStatusDistribution?.reduce(
    (acc, val) => val?.loan_count + acc,
    0,
  );
  const statusData = {
    labels: loanStatusDistribution?.map((item) => item?.loan_status),
    datasets: [
      {
        data: loanStatusDistribution?.map((item) => item?.loan_count),
        // backgroundColor: STATUS_RAMP,
        backgroundColor: loanStatusDistribution?.map(
          (item) => COLORS[item?.loan_status?.toLowerCase()] || "#64748b",
        ),
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const monthlyData = {
    labels: monthlyDisbursement?.map((m) => m?.month_name),
    datasets: [
      {
        label: "Amount",
        data: monthlyDisbursement?.map((m) => m?.disbursed_amount),
        backgroundColor: "rgba(47,111,166,0.85)",
        borderColor: COLORS.settled,
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const loanDistData = {
    labels: loanSizeDistribution?.map((range) => range?.loan_size_range),
    datasets: [
      {
        data: loanSizeDistribution?.map((loan) => loan?.total_loans),
        backgroundColor: [
          "#2F6FA6",
          "#6B54C7",
          "#1F8F68",
          "#EB7F31",
          "#78A4CB",
          "#DF301C",
          "#F62477",
          "#1B4EF5",
        ],
        borderRadius: 2,
        borderWidth: 0,
      },
    ],
  };

  const sortedNPASector = [...(sectorNPA || [])]
    ?.sort((a, b) => b.total_loans - a.total_loans)
    ?.slice(0, 10);

  const sectorData = {
    labels: sortedNPASector?.map((sector) => sector?.sector),
    datasets: [
      {
        label: "Loans",
        data: sortedNPASector?.map((sector) => sector?.total_loans),
        // backgroundColor: "rgba(31,143,104,0.85)",
        backgroundColor: "#66BB6A",
        borderColor: COLORS.paid,
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const fetchOverview_Main = async () => {
    setIsLoading((prev) => ({ ...prev, loading1: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };
      const response = await Overview_MainAPI(req);
      if (response.status) {
        setMainData(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
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
        product_code: selectedProductsName,
      };
      const response = await Overview_DescriptionAPI(req);
      if (response.status) {
        setOverViewDescription(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
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
        product_code: selectedProductsName,
      };
      const response = await Overview_LoanStatusDistributionAPI(req);
      if (response.status) {
        setloanStatusDistribution(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
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
        product_code: selectedProductsName,
      };
      const response = await Overview_MonthlyDisbursementsAPI(req);
      if (response.status) {
        setmonthlyDisbursement(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
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
        product_code: selectedProductsName,
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
      setIsLoading((prev) => ({ ...prev, loading5: false }));
    }
  };

  const fetchPortfolioHealthNPAbySector = async () => {
    setIsLoading((prev) => ({ ...prev, loading6: true }));
    try {
      const req = {
        from_date: "",
        to_date: "",
        product_code: selectedProductsName,
      };
      const response = await PortfolioHealth_NPAbySectorAPI(req);
      if (response.status) {
        setsectorNPA(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
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
  }, [selectedProductsName]);

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      {!isLoading?.loading1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard
            label="Total Loans"
            value={mainData?.total_loans?.toLocaleString()}
            // sub={`${mainData?.unique_customers?.toLocaleString()} unique customers`}
            sub={`${mainData?.total_loans?.toLocaleString()} loans by customers`}
            type={1}
          />
          <KpiCard
            label="Total Disbursed"
            value={`₹${formatNumber(mainData?.total_disbursed)}`}
            sub="Principal deployed"
            type={6}
          />
          <KpiCard
            label="Total Collected"
            value={`₹${formatNumber(mainData?.total_collected)}`}
            sub={`${107.69}% collection rate`}
            type={5}
          />
          {/* <div className="relative group"> */}
            <KpiCard
              label="Total Demand"
              value={`₹${formatNumber(mainData?.demand_amount)}`}
              sub="Total Demand Amount"
              // sub="Hover for breakdown"
              type={3}
            />
            {/* <div className="absolute left-0 top-full mt-1 z-30 hidden group-hover:flex flex-col gap-1.5 w-56">
              <div className="bg-white border border-[#DCE1E6] shadow-lg px-3 py-2">
                <p className="text-[10px] text-[#8B98A6] uppercase tracking-wide">
                  NPA Demand Amount
                </p>
                <p
                  className="text-[15px] font-semibold text-[#C1443C]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  ₹{formatNumber(mainData?.npa_demand_amount)}
                </p>
              </div>
              <div className="bg-white border border-[#DCE1E6] shadow-lg px-3 py-2">
                <p className="text-[10px] text-[#8B98A6] uppercase tracking-wide">
                  Under NPA Demand Amount
                </p>
                <p
                  className="text-[15px] font-semibold text-[#C1443C]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  ₹{formatNumber(mainData?.under_npa_demand_amount)}
                </p>
              </div>
            </div>
          </div> */}
          <KpiCard
            label="NPA Rate"
            value={`${mainData?.npa_rate}%`}
            sub={`${mainData?.total_npa?.toLocaleString()} loans at risk`}
            type={3}
          />
          <KpiCard
            label="States Covered"
            value={mainData?.states_covered}
            sub="Primarily metro markets"
            type={4}
          />
          {/* <KpiCard
            label="Collection Rate"
            value={mainData?.collection_rate ? `${mainData.collection_rate}%` : "—"}
            sub="Of total demand"
            type={5}
          /> */}
        </div>
      ) : (
        <div className="text-center py-10 text-[#8B98A6] text-sm">Loading…</div>
      )}

      {/* Insights */}
      {!isLoading?.loading2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <InsightCard
            type="success"
            title="Strong Repayment Base"
            body={overViewDescription?.strong_repayment_base || "N/A"}
          />
          <InsightCard
            type="warn"
            title={`NPA Concentration in ${overViewDescription?.top_npa_sector}`}
            body={overViewDescription?.npa_concentration || "N/A"}
          />
          <InsightCard
            type="danger"
            title="High Pending & Foreclosure Volume"
            body={
              overViewDescription?.high_pending_and_foreclosure_volume || "N/A"
            }
          />
          <InsightCard
            type="info"
            title="Portfolio Scaling Rapidly"
            body={overViewDescription?.portfolio_scaling_rapidly || "N/A"}
          />
        </div>
      ) : (
        <div className="text-center py-10 text-[#8B98A6] text-sm">Loading…</div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {!isLoading?.loading3 ? (
          <Panel
            title="Loan Status Distribution"
            sub={`All ${totalLoan?.toLocaleString()} loans`}
          >
            <div className="relative max-h-[260px] w-fit m-auto">
              <Chart
                type="doughnut"
                data={statusData}
                options={{
                  cutout: "60%",
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: {
                        color: "#5B6B7A",
                        padding: 10,
                        boxWidth: 8,
                        font: { size: 10.5 },
                      },
                    },
                  },
                }}
              />
            </div>
          </Panel>
        ) : (
          <SkeletonLoader />
        )}

        {!isLoading?.loading4 ? (
          <Panel title="Monthly Disbursements" sub="Loan volume over time (₹)">
            <div className="relative max-h-[260px]">
              <Chart
                type="bar"
                data={monthlyData}
                options={{
                  scales: {
                    y: {
                      ticks: { callback: (v) => fmtCr(v) },
                      grid: { color: "#E8EBEE" },
                    },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          </Panel>
        ) : (
          <SkeletonLoader />
        )}
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {!isLoading?.loading5 ? (
          <Panel
            title="Loan Size Distribution"
            sub="Number of loans by amount bucket"
          >
            <div className="relative max-h-[260px]">
              <Chart
                type="bar"
                data={loanDistData}
                options={{
                  scales: {
                    y: { grid: { color: "#E8EBEE" } },
                    x: { grid: { display: false } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </Panel>
        ) : (
          <SkeletonLoader />
        )}

        {!isLoading?.loading6 ? (
          <Panel title="Top 10 Sectors by Volume" sub="Number of loans">
            <div className="relative max-h-[260px]">
              <Chart
                type="bar"
                data={sectorData}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { grid: { color: "#E8EBEE" } },
                    y: {
                      grid: { display: false },
                      ticks: { font: { size: 10.5 } },
                    },
                  },
                }}
              />
            </div>
          </Panel>
        ) : (
          <SkeletonLoader />
        )}
      </div>
    </div>
  );
};

export default Overview;
