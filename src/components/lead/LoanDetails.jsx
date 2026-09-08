import React, { useState } from "react";
import Icon from "../utils/Icon";

const LoanDetails = () => {
  const [loan] = useState({
    id: 1,
    loanType: "Home Loan",
    loanAmount: 5000000,
    totalEMI: 60,
    paidEMI: 24,
    remainingEMI: 36,
    monthlyEMI: 42500,
    nextEMIDate: "2026-06-15",
    interestRate: 8.5,
    status: "Active",
    bankName: "HDFC Bank",
    loanAccountNo: "HL-2026-001234",
    startDate: "2024-06-15",
    endDate: "2027-06-15",
    lastPaidDate: "2026-05-15",
    emiDetails: [
      { emiNo: 1, date: "2024-07-15", amount: 42500, principal: 32500, interest: 10000, status: "Paid" },
      { emiNo: 2, date: "2024-08-15", amount: 42500, principal: 32800, interest: 9700, status: "Paid" },
      { emiNo: 3, date: "2024-09-15", amount: 42500, principal: 33100, interest: 9400, status: "Paid" },
      { emiNo: 4, date: "2024-10-15", amount: 42500, principal: 33400, interest: 9100, status: "Paid" },
      { emiNo: 5, date: "2024-11-15", amount: 42500, principal: 33700, interest: 8800, status: "Paid" },
      { emiNo: 6, date: "2024-12-15", amount: 42500, principal: 34000, interest: 8500, status: "Paid" },
      { emiNo: 7, date: "2025-01-15", amount: 42500, principal: 34300, interest: 8200, status: "Paid" },
      { emiNo: 8, date: "2025-02-15", amount: 42500, principal: 34600, interest: 7900, status: "Paid" },
      { emiNo: 9, date: "2025-03-15", amount: 42500, principal: 34900, interest: 7600, status: "Paid" },
      { emiNo: 10, date: "2025-04-15", amount: 42500, principal: 35200, interest: 7300, status: "Paid" },
      { emiNo: 11, date: "2025-05-15", amount: 42500, principal: 35500, interest: 7000, status: "Paid" },
      { emiNo: 12, date: "2025-06-15", amount: 42500, principal: 35800, interest: 6700, status: "Paid" },
      { emiNo: 13, date: "2025-07-15", amount: 42500, principal: 36100, interest: 6400, status: "Paid" },
      { emiNo: 14, date: "2025-08-15", amount: 42500, principal: 36400, interest: 6100, status: "Paid" },
      { emiNo: 15, date: "2025-09-15", amount: 42500, principal: 36700, interest: 5800, status: "Paid" },
      { emiNo: 16, date: "2025-10-15", amount: 42500, principal: 37000, interest: 5500, status: "Paid" },
      { emiNo: 17, date: "2025-11-15", amount: 42500, principal: 37300, interest: 5200, status: "Paid" },
      { emiNo: 18, date: "2025-12-15", amount: 42500, principal: 37600, interest: 4900, status: "Paid" },
      { emiNo: 19, date: "2026-01-15", amount: 42500, principal: 37900, interest: 4600, status: "Paid" },
      { emiNo: 20, date: "2026-02-15", amount: 42500, principal: 38200, interest: 4300, status: "Paid" },
      { emiNo: 21, date: "2026-03-15", amount: 42500, principal: 38500, interest: 4000, status: "Paid" },
      { emiNo: 22, date: "2026-04-15", amount: 42500, principal: 38800, interest: 3700, status: "Paid" },
      { emiNo: 23, date: "2026-05-15", amount: 42500, principal: 39100, interest: 3400, status: "Paid" },
      { emiNo: 24, date: "2026-06-15", amount: 42500, principal: 39400, interest: 3100, status: "Pending" },
      { emiNo: 25, date: "2026-07-15", amount: 42500, principal: 39700, interest: 2800, status: "Upcoming" },
      { emiNo: 26, date: "2026-08-15", amount: 42500, principal: 40000, interest: 2500, status: "Upcoming" },
      { emiNo: 27, date: "2026-09-15", amount: 42500, principal: 40300, interest: 2200, status: "Upcoming" },
      { emiNo: 28, date: "2026-10-15", amount: 42500, principal: 40600, interest: 1900, status: "Upcoming" },
      { emiNo: 29, date: "2026-11-15", amount: 42500, principal: 40900, interest: 1600, status: "Upcoming" },
      { emiNo: 30, date: "2026-12-15", amount: 42500, principal: 41200, interest: 1300, status: "Upcoming" },
    ],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Defaulted":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return "RiCheckboxCircleLine";
      case "Pending":
        return "RiTimeLine";
      case "Upcoming":
        return "RiCalendarCheckLine";
      default:
        return "RiInformationLine";
    }
  };

  // Calculate summary statistics
  const totalPaid = loan.emiDetails.filter(e => e.status === "Paid").length;
  const totalPending = loan.emiDetails.filter(e => e.status === "Pending").length;
  const totalUpcoming = loan.emiDetails.filter(e => e.status === "Upcoming").length;
  const totalPrincipalPaid = loan.emiDetails
    .filter(e => e.status === "Paid")
    .reduce((sum, e) => sum + e.principal, 0);
  const totalInterestPaid = loan.emiDetails
    .filter(e => e.status === "Paid")
    .reduce((sum, e) => sum + e.interest, 0);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = loan.emiDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(loan.emiDetails.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-2">
      {/* Loan Summary Cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon name="RiBankLine" size={16} color="#3B82F6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Loan Amount</p>
              <p className="text-[14px] font-bold text-slate-700">{formatCurrency(loan.loanAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Icon name="RiMoneyDollarCircleLine" size={16} color="#10B981" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Monthly EMI</p>
              <p className="text-[14px] font-bold text-slate-700">{formatCurrency(loan.monthlyEMI)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Icon name="RiPercentLine" size={16} color="#F59E0B" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Interest Rate</p>
              <p className="text-[14px] font-bold text-slate-700">{loan.interestRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Icon name="RiCalendarLine" size={16} color="#8B5CF6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">EMI Left</p>
              <p className="text-[14px] font-bold text-slate-700">{loan.remainingEMI}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center text-primary">
                <Icon name="RiHomeLine" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{loan.loanAccountNo}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{loan.bankName}</span>
                  {/* <span>•</span> */}
                  {/* <span>Account: {loan.loanAccountNo}</span> */}
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(loan.status)}`}>
                    {loan.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Next EMI Date</p>
              <p className="text-sm font-semibold text-slate-800">{loan.nextEMIDate}</p>
            </div>
          </div>
        </div>

        {/* EMI Statistics */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Total EMI</p>
              <p className="text-sm font-bold text-slate-800">{loan.totalEMI}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Paid</p>
              <p className="text-sm font-bold text-emerald-600">{totalPaid}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Pending</p>
              <p className="text-sm font-bold text-amber-600">{totalPending}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Upcoming</p>
              <p className="text-sm font-bold text-blue-600">{totalUpcoming}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Total Principal Paid</p>
              <p className="text-sm font-bold text-slate-800">{formatCurrency(totalPrincipalPaid)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Total Interest Paid</p>
              <p className="text-sm font-bold text-slate-800">{formatCurrency(totalInterestPaid)}</p>
            </div>
          </div>
        </div>

        {/* EMI Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider">EMI No.</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Principal</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Interest</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((emi, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 text-sm font-medium text-slate-700">
                    #{emi.emojiNo || emi.emiNo}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-slate-600">{emi.date}</td>
                  <td className="px-4 py-2.5 text-sm text-right font-semibold text-slate-700">
                    {formatCurrency(emi.amount)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-right text-emerald-600 font-medium">
                    {formatCurrency(emi.principal)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-right text-blue-600 font-medium">
                    {formatCurrency(emi.interest)}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(emi.status)}`}>
                      <Icon name={getStatusIcon(emi.status)} size={12} />
                      {emi.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, loan.emiDetails.length)} of {loan.emiDetails.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              {/* {[...Array(totalPages)]?.map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 text-xs border rounded transition-colors cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-primary text-white border-primary"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))} */}

                <div className="bg-gray-200 text-gray-800 px-2.5 py-0.5 font-bold text-sm rounded-sm">
                  {currentPage}
                </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <Icon name="RiDownloadLine" size={18} color="white" />
          Download EMI Schedule
        </button>
        <button className="flex-1 bg-emerald-100 text-emerald-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <Icon name="RiBankCardLine" size={18} color="green" />
          Update EMI Payment
        </button>
        {/* <button className="flex-1 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <Icon name="RiBankCardLine" size={18} color="#5050b8" />
          Pay Next EMI
        </button> */}
        <button className="flex-1 bg-slate-200 text-slate-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <Icon name="RiPrinterLine" size={18} color="#5050b8" />
          Print Statement
        </button>
      </div>
    </div>
  );
};

export default LoanDetails;