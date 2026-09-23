import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import { formatNumber, Pill, SectionCard } from "./Helper";
import { fmtCr } from "./utils";
import { TeamPerformance_TeamPerformanceSummaryAPI } from "../../api/functions";
// import Loader from "../utils/Loader";
import { toast } from "react-toastify";

const TeamPerformance = () => {
  const [RMPaidNpa, setRMPaidNpa] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sortedRMPaidNpa = [...(RMPaidNpa || [])]
    ?.sort((a, b) => b?.paid_Count - a?.paid_Count) // Highest to Lowest
    ?.slice(0, 8);

  const sortedRMPaidNpaList = [...(RMPaidNpa || [])]
    ?.sort((a, b) => b?.loan_Count - a?.loan_Count) // Highest to Lowest
    ?.filter((l) => l?.loan_Count >= 20);

  const rmLoanData = {
    labels: sortedRMPaidNpa?.map((r) => r.rm_Name),
    datasets: [
      {
        data: sortedRMPaidNpa?.map((r) => r.loan_Count),
        backgroundColor: "rgba(99,102,241,0.9)",
        borderColor: "#6366f1",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const rmQualityData = {
    labels: sortedRMPaidNpa?.map((r) => r.rm_Name),
    datasets: [
      {
        label: "Paid",
        data: sortedRMPaidNpa?.map((r) => r.paid_Count),
        backgroundColor: "rgba(6,214,160,0.9)",
        borderRadius: 4,
      },
      {
        label: "NPA",
        data: sortedRMPaidNpa?.map((r) => r.npa_Count),
        backgroundColor: "rgba(239,68,68,0.9)",
        borderRadius: 4,
      },
    ],
  };

  const fetchTeamPerformance_TeamPerformanceSummary = async () => {
    setIsLoading(true);
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await TeamPerformance_TeamPerformanceSummaryAPI(req);
      if (response.status) {
        setRMPaidNpa(response.data);
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamPerformance_TeamPerformanceSummary();
  }, []);

  // if (isLoading) return <Loader />;

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
          Relationship Manager Performance
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="RM - Loans Originated"
          subtitle="Total loans per manager"
          accent="bg-violet-500"
        >
          <div className="relative max-h-[320px]">
            <Chart
              type="bar"
              data={rmLoanData}
              options={{
                indexAxis: "y",
                scales: {
                  x: { grid: { color: "#c2c3c4" } },
                  y: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="RM - Paid vs NPA"
          subtitle="Portfolio quality comparison"
          accent="bg-emerald-500"
        >
          <div className="relative max-h-[320px]">
            <Chart
              type="bar"
              data={rmQualityData}
              options={{
                indexAxis: "y",
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: { color: "#c2c3c4", padding: 12 },
                  },
                },
                scales: {
                  x: { stacked: false, grid: { color: "#c2c3c4" } },
                  y: {
                    stacked: false,
                    grid: { display: false },
                    ticks: { font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </SectionCard>
      </div>

      {/* RM Table */}
      <SectionCard
        title="Team Performance Summary"
        subtitle="All relationship managers (≥20 loans)"
        accent="bg-blue-500"
        bodyClassName="overflow-x-auto"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-3 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                Relationship Manager
              </th>
              <th className="text-left px-3 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                Loans
              </th>
              <th className="text-left px-3 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                Total Amount
              </th>
              <th className="text-left px-3 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                Paid
              </th>
              <th className="text-left px-3 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                NPA
              </th>
              <th className="text-left px-3 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                NPA Rate
              </th>
              <th className="text-left px-3 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                Portfolio Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRMPaidNpaList
              ?.sort((a, b) => b.loan_Count - a.loan_Count)
              ?.map((r) => {
                const npaRate = r.npA_Count_Percentage;
                const paidRate = r.paid_Count_Percentage;

                const status =
                  parseFloat(npaRate) > 25
                    ? ["red", "⚠ Needs Review"]
                    : parseFloat(npaRate) > 15
                      ? ["yellow", "Monitor"]
                      : parseFloat(paidRate) > 5
                        ? ["blue", "Normal"]
                        : ["green", "Strong"];
                return (
                  <tr
                    key={r.rm_Name}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-3 py-3 text-[13px] font-semibold text-slate-700 border-b border-slate-100">
                      {r.rm_Name}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-slate-600 border-b border-slate-100">
                      {r.loan_Count?.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-slate-600 border-b border-slate-100">
                      {formatNumber(r.loan_Amount || 0)}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-emerald-500 font-medium border-b border-slate-100">
                      {r.paid_Count}{" "}
                      <span className="text-slate-400 font-normal">({paidRate}%)</span>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-red-500 font-medium border-b border-slate-100">
                      {r.npa_Count}{" "}
                      <span className="text-slate-400 font-normal">({npaRate}%)</span>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-slate-600 border-b border-slate-100">
                      {npaRate}%
                    </td>
                    <td className="px-3 py-3 text-[13px] border-b border-slate-100">
                      <Pill color={status[0]}>{status[1]}</Pill>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
};

export default TeamPerformance;
