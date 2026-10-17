import { RiBankCardLine } from "react-icons/ri";

const sampleEmiDetails = [
  {
    loanType: "Home Loan",
    lender: "HDFC Bank",
    loanAmount: 2500000,
    monthlyEmi: 22500,
    outstanding: 1840000,
    nextDueDate: "05 Nov 2026",
  },
  {
    loanType: "Vehicle Loan",
    lender: "ICICI Bank",
    loanAmount: 800000,
    monthlyEmi: 16800,
    outstanding: 336000,
    nextDueDate: "10 Nov 2026",
  },
  {
    loanType: "Personal Loan",
    lender: "Axis Bank",
    loanAmount: 250000,
    monthlyEmi: 8250,
    outstanding: 99000,
    nextDueDate: "15 Nov 2026",
  },
];

const formatCurrency = (amount) =>
  `₹${amount.toLocaleString("en-IN")}`;

const CreditInfo = ({ creditData }) => {
  if (!creditData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <RiBankCardLine className="mb-3 text-3xl text-gray-400" />
        <p className="text-sm font-semibold text-gray-700">
          No credit score available
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Credit information has not been received for this customer.
        </p>
      </div>
    );
  }

  const score = creditData?.credit_score;
  const hasScore =
    score !== null && score !== "" && Number.isFinite(Number(score));
  const scoreValue = hasScore ? Number(score) : null;

  const getScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 750) return "bg-green-100";
    if (score >= 650) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-4">
      {/* Credit Score */}
      <div className="bg-linear-to-r from-primary/5 to-indigo-50 p-4 rounded-lg border border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Credit Score</p>
            <p className={`text-3xl font-bold ${hasScore ? getScoreColor(scoreValue) : "text-gray-400"}`}>
              {hasScore ? score : "—"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Status: <span className={`font-semibold ${hasScore ? getScoreColor(scoreValue) : "text-gray-500"}`}>
                {creditData?.status || "Not available"}
              </span>
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full ${hasScore ? getScoreBg(scoreValue) : "bg-gray-100"} flex items-center justify-center`}>
            <RiBankCardLine className={`text-2xl ${hasScore ? getScoreColor(scoreValue) : "text-gray-400"}`} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bureau</p>
          <p className="text-base font-semibold text-gray-800">{creditData?.bureau_name || "—"}</p>
          <p className="text-[10px] text-gray-400">{creditData?.customer_type || "—"}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Credit Type</p>
          <p className="text-base font-semibold text-gray-800">{creditData?.credit_type || "—"}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Request ID</p>
          <p className="text-sm font-semibold text-gray-800 break-all">{creditData?.request_id || "—"}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Requested On</p>
          <p className="text-sm font-semibold text-gray-800">{creditData?.request_date || "—"}</p>
        </div>
      </div>

      {/* Sample EMI breakdown */}
      <section className="overflow-hidden rounded-lg border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
          <div>
            <h3 className="text-xs font-semibold text-gray-800">EMI Breakdown</h3>
            <p className="text-[10px] text-gray-500">
              Sample data for UI preview
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-700">
            Dummy data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-white text-[9px] uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Loan / Lender</th>
                <th className="px-3 py-2 font-semibold">Loan Amount</th>
                <th className="px-3 py-2 font-semibold">Monthly EMI</th>
                <th className="px-3 py-2 font-semibold">Outstanding</th>
                <th className="px-3 py-2 font-semibold">Next Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px] text-gray-700">
              {sampleEmiDetails.map((emi) => (
                <tr key={emi.loanType}>
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-800">{emi.loanType}</p>
                    <p className="text-[10px] text-gray-500">{emi.lender}</p>
                  </td>
                  <td className="px-3 py-2">{formatCurrency(emi.loanAmount)}</td>
                  <td className="px-3 py-2 font-medium">
                    {formatCurrency(emi.monthlyEmi)}
                  </td>
                  <td className="px-3 py-2">
                    {formatCurrency(emi.outstanding)}
                  </td>
                  <td className="px-3 py-2">{emi.nextDueDate}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-800">
              <tr>
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2">
                  {formatCurrency(
                    sampleEmiDetails.reduce((total, emi) => total + emi.loanAmount, 0),
                  )}
                </td>
                <td className="px-3 py-2">
                  {formatCurrency(
                    sampleEmiDetails.reduce((total, emi) => total + emi.monthlyEmi, 0),
                  )}
                </td>
                <td className="px-3 py-2">
                  {formatCurrency(
                    sampleEmiDetails.reduce((total, emi) => total + emi.outstanding, 0),
                  )}
                </td>
                <td className="px-3 py-2">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {creditData?.credit_report_link && (
        <a className="text-xs text-primary hover:underline" href={creditData.credit_report_link} target="_blank" rel="noreferrer">
          View credit report
        </a>
      )}
    </div>
  );
};

export default CreditInfo;