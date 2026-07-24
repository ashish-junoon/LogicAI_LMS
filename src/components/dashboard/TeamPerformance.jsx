import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import { formatNumber, Pill } from "./Helper";
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
      <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider border-b border-gray-200 pb-2">
        Relationship Manager Performance
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5"> */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">RM - Loans Originated</div>
              <div className="text-[#64748b] text-[11px]">
                Total loans per manager
              </div>
            </div>
          </div>
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
        </div>

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-semibold">RM - Paid vs NPA</div>
              <div className="text-[#64748b] text-[11px]">
                Portfolio quality comparison
              </div>
            </div>
          </div>
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
        </div>
      </div>

      {/* RM Table */}
      <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm font-semibold">
              Team Performance Summary
            </div>
            <div className="text-[#64748b] text-[11px]">
              All relationship managers (≥20 loans)
            </div>
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                Relationship Manager
              </th>
              <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                Loans
              </th>
              <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                Total Amount
              </th>
              <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                Paid
              </th>
              <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                NPA
              </th>
              <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
                NPA Rate
              </th>
              <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-gray-500">
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
                    className="hover:bg-[rgba(59,130,246,0.04)]"
                  >
                    <td className="px-3 py-2.5 text-[13px] font-semibold border-b border-gray-200">
                      {r.rm_Name}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">
                      {r.loan_Count?.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">
                      {formatNumber(r.loan_Amount || 0)}
                    </td>
                    {/* <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">{fmtCr(r.loan_Amount || 0)}</td> */}
                    <td className="px-3 py-2.5 text-[13px] text-[#06d6a0] border-b border-gray-200">
                      {r.paid_Count}{" "}
                      <span className="text-[#64748b]">({paidRate}%)</span>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-[#ef4444] border-b border-gray-200">
                      {r.npa_Count}{" "}
                      <span className="text-[#64748b]">({npaRate}%)</span>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">
                      {npaRate}%
                    </td>
                    <td className="px-3 py-2.5 text-[13px] border-b border-gray-200">
                      <Pill color={status[0]}>{status[1]}</Pill>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamPerformance;
