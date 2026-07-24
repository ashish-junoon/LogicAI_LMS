// ============ LOAN INFO COMPONENT ============
const LoanInfoSection = ({ loanData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loanDetails = {
    loanId: loanData?.loanId || "L-2024-001234",
    applicationDate: loanData?.applicationDate || "2024-01-15",
    loanAmount: loanData?.loanAmount || 500000,
    interestRate: loanData?.interestRate || 8.5,
    tenure: loanData?.tenure || 60,
    monthlyEMI: loanData?.monthlyEMI || 10256,
    totalInterest: loanData?.totalInterest || 115360,
    totalPayable: loanData?.totalPayable || 615360,
    purpose: loanData?.purpose || "Home Renovation",
    status: loanData?.status || "Pending",
    disbursementDate: loanData?.disbursementDate || null,
    nextPaymentDate: loanData?.nextPaymentDate || "2024-02-01",
    remainingAmount: loanData?.remainingAmount || 410240,
    overdueDays: loanData?.overdueDays || 0,
  };

  return (
    <div className="space-y-4">
      {/* Loan Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-gradient-to-r from-primary/90 to-primary rounded-lg text-white">
          <p className="text-xs opacity-90">Loan Amount</p>
          <p className="text-lg font-bold">{formatCurrency(loanDetails.loanAmount)}</p>
          <p className="text-xs opacity-75 mt-1">Tenure: {loanDetails.tenure} months</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-white">
          <p className="text-xs opacity-90">Monthly EMI</p>
          <p className="text-lg font-bold">{formatCurrency(loanDetails.monthlyEMI)}</p>
          <p className="text-xs opacity-75 mt-1">Rate: {loanDetails.interestRate}%</p>
        </div>
      </div>

      {/* Loan Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Lead ID</p>
          <p className="text-xs font-semibold text-gray-800 font-mono">{loanDetails.loanId}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Purpose</p>
          <p className="text-xs font-semibold text-gray-800">{loanDetails.purpose}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Application Date</p>
          <p className="text-xs font-semibold text-gray-800">{formatDate(loanDetails.applicationDate)}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Payable</p>
          <p className="text-xs font-semibold text-gray-800">{formatCurrency(loanDetails.totalPayable)}</p>
        </div>
      </div>
    </div>
  );
};


export default LoanInfoSection;