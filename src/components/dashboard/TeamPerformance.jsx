import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import { formatNumber, Pill, Panel } from "./Helper";
import { TeamPerformance_TeamPerformanceSummaryAPI } from "../../api/dashboard";
import { toast } from "react-toastify";

const TeamPerformance = ({selectedProductsName}) => {
  const [RMPaidNpa, setRMPaidNpa] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sortedRMPaidNpa = [...(RMPaidNpa || [])]
    ?.sort((a, b) => b?.paid_Count - a?.paid_Count)
    ?.slice(0, 8);

  const sortedRMPaidNpaList = [...(RMPaidNpa || [])]
    ?.sort((a, b) => b?.loan_Count - a?.loan_Count)
    ?.filter((l) => l?.loan_Count >= 20);

  const rmLoanData = {
    labels: sortedRMPaidNpa?.map((r) => r.rm_Name),
    datasets: [
      {
        data: sortedRMPaidNpa?.map((r) => r.loan_Count),
        backgroundColor: "rgba(107,84,199,0.85)",
        borderColor: "#6B54C7",
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const rmQualityData = {
    labels: sortedRMPaidNpa?.map((r) => r.rm_Name),
    datasets: [
      {
        label: "Paid",
        data: sortedRMPaidNpa?.map((r) => r.paid_Count),
        backgroundColor: "rgba(31,143,104,0.85)",
        borderRadius: 2,
      },
      {
        label: "NPA",
        data: sortedRMPaidNpa?.map((r) => r.npa_Count),
        backgroundColor: "rgba(193,68,60,0.85)",
        borderRadius: 2,
      },
    ],
  };

  const fetchTeamPerformance_TeamPerformanceSummary = async () => {
    setIsLoading(true);
    try {
      const req = { from_date: "", to_date: "", product_code: selectedProductsName };
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
  }, [selectedProductsName]);

  return (
    <div className="space-y-6">
      <div className="text-[11px] font-medium text-[#8B98A6] uppercase tracking-[0.12em] border-b border-[#DCE1E6] pb-2.5">
        Relationship Manager Performance
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="RM — Loans Originated" sub="Total loans per manager">
          <div className="relative max-h-[320px]">
            <Chart
              type="bar"
              data={rmLoanData}
              options={{
                indexAxis: "y",
                scales: {
                  x: { grid: { color: "#E8EBEE" } },
                  y: { grid: { display: false }, ticks: { font: { size: 10.5 } } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </Panel>

        <Panel title="RM — Paid vs NPA" sub="Portfolio quality comparison">
          <div className="relative max-h-[320px]">
            <Chart
              type="bar"
              data={rmQualityData}
              options={{
                indexAxis: "y",
                plugins: {
                  legend: { display: true, position: "top", labels: { color: "#5B6B7A", padding: 12, font: { size: 10.5 } } },
                },
                scales: {
                  x: { stacked: false, grid: { color: "#E8EBEE" } },
                  y: { stacked: false, grid: { display: false }, ticks: { font: { size: 10.5 } } },
                },
              }}
            />
          </div>
        </Panel>
      </div>

      {/* RM Table */}
      <Panel title="Team Performance Summary" sub="All relationship managers (≥20 loans)" className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Relationship Manager", "Loans", "Total Amount", "Paid", "NPA", "NPA Rate", "Portfolio Status"].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-[10px] font-medium text-[#8B98A6] uppercase tracking-[0.08em] border-b border-[#DCE1E6]"
                >
                  {h}
                </th>
              ))}
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
                    ? ["red", "Needs Review"]
                    : parseFloat(npaRate) > 15
                      ? ["yellow", "Monitor"]
                      : parseFloat(paidRate) > 5
                        ? ["blue", "Normal"]
                        : ["green", "Strong"];
                return (
                  <tr key={r.rm_Name} className="hover:bg-black/[0.02]">
                    <td className="px-3 py-2.5 text-[13px] font-medium text-[#16202B] border-b border-[#E8EBEE]">
                      {r.rm_Name}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-[#5B6B7A] tabular-nums border-b border-[#E8EBEE]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {r.loan_Count?.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-[#5B6B7A] tabular-nums border-b border-[#E8EBEE]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {formatNumber(r.loan_Amount || 0)}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-[#1F8F68] tabular-nums border-b border-[#E8EBEE]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {r.paid_Count} <span className="text-[#8B98A6]">({paidRate}%)</span>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-[#C1443C] tabular-nums border-b border-[#E8EBEE]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {r.npa_Count} <span className="text-[#8B98A6]">({npaRate}%)</span>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-[#16202B] tabular-nums border-b border-[#E8EBEE]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {npaRate}%
                    </td>
                    <td className="px-3 py-2.5 border-b border-[#E8EBEE]">
                      <Pill color={status[0]}>{status[1]}</Pill>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};

export default TeamPerformance;
