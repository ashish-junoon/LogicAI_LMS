import React from "react";
import {
  RiBankCardLine,
  RiCalendarLine,
  RiMoneyRupeeCircleLine,
  RiPercentLine,
  RiTimeLine,
  RiWallet3Line,
} from "react-icons/ri";

const LoanOverviewMultiple = ({ activeLoan = [] }) => {
  const getLoanDetails = (loan) => {
    const isOverdue = loan?.loan_status === "Overdue";

    return [
      {
        label: "Max Loan Amount",
        value: `₹${loan?.loan_amount ?? "0"}`,
        icon: RiMoneyRupeeCircleLine,
      },
      {
        label: "Interest Rate",
        value: `${loan?.roI_percentage ?? "0"}%`,
        icon: RiPercentLine,
      },
      {
        label: "Tenure",
        value:
          loan?.tenure != null
            ? `${loan.tenure}${
                ["PU", "IP"].includes(loan?.product_code)
                  ? " days"
                  : ["RFT", "RFR"].includes(loan?.product_code)
                    ? " months"
                    : ""
              }`
            : "-",
        icon: RiTimeLine,
      },
      {
        label: "Disbursed Amount",
        value: `₹${loan?.disbursement_amount ?? "0"}`,
        icon: RiWallet3Line,
      },
      {
        label: "Disbursement Date",
        value: loan?.disbursement_date?.split(" ")[0] ?? "-",
        icon: RiCalendarLine,
      },
      {
        label: "Repayment Amount",
        value: `₹${loan?.repayment_amount ?? "0"}`,
        icon: RiMoneyRupeeCircleLine,
      },
      {
        label: "Repayment Date",
        value: loan?.repayment_date?.split(" ")[0] ?? "-",
        icon: RiCalendarLine,
      },
      {
        label: "Loan Status",
        value: loan?.loan_status ?? "-",
        icon: RiBankCardLine,
        status: true,
      },
      {
        label: "Annual Percentage Rate",
        value: loan?.annualPercentageRate ?? "-",
        icon: RiPercentLine,
      },
    ];
  };

  if (!activeLoan?.length) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
        No loan details available
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {activeLoan.map((loan, loanIndex) => {
        const isOverdue = loan?.loan_status === "Overdue";
        const loanDetails = getLoanDetails(loan);

        return (
          <div
            key={loanIndex}
            className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
          >
            {/* Top Border */}
            <div
              className={`h-1 ${
                isOverdue ? "bg-red-500" : "bg-primary"
              }`}
            />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RiBankCardLine size={18} />
                </div>

                <div>
                  <h2 className="text-[14px] font-semibold text-slate-600">
                    Loan Overview
                  </h2>

                  <p className="text-xs text-slate-500">
                    Loan ID: {loan?.loan_id ?? "-"}
                  </p>

                  {(loan?.repayment_id != "False")  && <p className="text-xs text-slate-500">
                    Repayment ID: {loan?.repayment_id}
                  </p>}
                </div>
              </div>

              {/* Status */}
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isOverdue
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isOverdue ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />

                {loan?.loan_status || "Active"}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {loanDetails.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="border-b border-r border-slate-100 px-3 py-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon size={14} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium leading-4 text-slate-400">
                          {item.label}
                        </p>

                        <p
                          className={`truncate text-[12px] font-semibold leading-4 ${
                            item.danger
                              ? "text-red-600"
                              : item.highlight
                                ? "text-[#3E3E75]"
                                : "text-slate-700"
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoanOverviewMultiple;