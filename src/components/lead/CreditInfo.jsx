import { RiBankCardLine } from "react-icons/ri";

const CreditInfo = ({ userInfo }) => {
  const creditData = {
    score: userInfo.creditScore || 765,
    totalAccounts: 8,
    activeAccounts: 4,
    creditUtilization: 32,
    paymentHistory: "100%",
    totalOutstanding: 450000,
  };

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
      <div className="bg-gradient-to-r from-primary/5 to-indigo-50 p-4 rounded-lg border border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Credit Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(creditData.score)}`}>
              {creditData.score}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Status: <span className={`font-semibold ${getScoreColor(creditData.score)}`}>
                {creditData.score >= 750 ? "Excellent" : creditData.score >= 700 ? "Good" : "Fair"}
              </span>
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full ${getScoreBg(creditData.score)} flex items-center justify-center`}>
            <RiBankCardLine className={`text-2xl ${getScoreColor(creditData.score)}`} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Accounts</p>
          <p className="text-base font-semibold text-gray-800">{creditData.totalAccounts}</p>
          <p className="text-[10px] text-gray-400">Active: {creditData.activeAccounts}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Utilization</p>
          <p className="text-base font-semibold text-gray-800">{creditData.creditUtilization}%</p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div
              className={`h-1 rounded-full ${creditData.creditUtilization < 30 ? "bg-green-500" : "bg-yellow-500"}`}
              style={{ width: `${creditData.creditUtilization}%` }}
            />
          </div>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Payment History</p>
          <p className="text-base font-semibold text-green-600">{creditData.paymentHistory}</p>
          <p className="text-[10px] text-gray-400">On-time</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Outstanding</p>
          <p className="text-base font-semibold text-gray-800">₹{(creditData.totalOutstanding / 100000).toFixed(1)}L</p>
          <p className="text-[10px] text-gray-400">All accounts</p>
        </div>
      </div>
    </div>
  );
};

export default CreditInfo;