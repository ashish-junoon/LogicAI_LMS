import React, { useEffect, useState } from "react";
import { COLORS, STATUS_RAMP, fmtCr } from "./utils";
import { formatNumber, InsightCard, KpiCard, Panel } from "./Helper";
import Chart from "./Chart";
import {
  Overview_DescriptionAPI,
  Overview_MainAPI,
  PortfolioHealth_NPAbySectorAPI,
} from "../../api/dashboard";
import { toast } from "react-toastify";
import SkeletonLoader from "../utils/SkeletonLoader";
import LoanStatusPiechart from "./overview/LoanStatusPiechart";
import DisbursmentBarchart from "./overview/DisbursmentBarchart";
import LoanSizeBarchart from "./overview/LoanSizeChart";
import LoanVolumeBarchart from "./overview/LoanVolumeBarchart";

const Overview = ({ selectedProductsName }) => {
  const [mainData, setMainData] = useState({});
  const [overViewDescription, setOverViewDescription] = useState({});

  const [isLoading, setIsLoading] = useState({
    loading1: false,
    loading2: false,
  });


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
        // console.info(response.message || "Something went wrong!");
        console.log(response?.message + " error in overview main api")
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
        // console.info(response.message || "Something went wrong!");
        console.log(response?.message + " error in overview description api")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, loading2: false }));
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
        // console.info(response.message || "Something went wrong!");
        console.log(response?.message + " error in PortfolioHealth_NPAbySectorAPI")
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
        <LoanStatusPiechart selectedProductsName={selectedProductsName} />
        <DisbursmentBarchart selectedProductsName={selectedProductsName} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <LoanSizeBarchart selectedProductsName={selectedProductsName} />
        <LoanVolumeBarchart selectedProductsName={selectedProductsName} />
      </div>
    </div>
  );
};

export default Overview;
