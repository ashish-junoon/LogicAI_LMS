import React from "react";
import {
  RiBankCardLine,
  RiCalendarLine,
  RiMoneyRupeeCircleLine,
  RiPercentLine,
  RiTimeLine,
  RiAlertLine,
  RiWallet3Line,
  RiExchangeDollarLine,
} from "react-icons/ri";

const LoanDetails = ({ activeLoan }) => {
  const isOverdue = activeLoan?.loan_status === "Overdue";

  const loanDetails = [
    {
      label: "Loan Amount",
      value: `₹${activeLoan?.loan_amount ?? "0"}`,
      icon: RiMoneyRupeeCircleLine,
    },
    {
      label: "Interest Rate",
      value: `${activeLoan?.roI_percentage ?? "0"}%`,
      icon: RiPercentLine,
    },
    {
      label: "Tenure",
      value: activeLoan?.tenure ?? "-",
      icon: RiTimeLine,
    },
    // {
    //   label: "Repay Frequency",
    //   value: activeLoan?.repayment_frequency ?? "-",
    //   icon: RiExchangeDollarLine,
    // },
    {
      label: "Disbursed Amount",
      value: `₹${activeLoan?.disbursement_amount ?? "0"}`,
      icon: RiWallet3Line,
    },
    {
      label: "Disbursement Date",
      value: activeLoan?.disbursement_date?.split(" ")[0] ?? "-",
      icon: RiCalendarLine,
    },
    {
      label: "Repayment Amount",
      value: `₹${activeLoan?.repayment_amount ?? "0"}`,
      icon: RiMoneyRupeeCircleLine,
    },
    {
      label: "Repayment Date",
      value: activeLoan?.repayment_date?.split(" ")[0] ?? "-",
      icon: RiCalendarLine,
    },
    {
      label: "Loan Status",
      value: activeLoan?.loan_status ?? "-",
      icon: RiBankCardLine,
      status: true,
    },
    {
      label: "Annual Percentage Rate",
      value: activeLoan?.annualPercentageRate ?? "-",
      icon: RiBankCardLine,
      status: true,
    },
    // {
    //   label: "Current Tenure",
    //   value: activeLoan?.current_tenure ?? "-",
    //   icon: RiTimeLine,
    // },
    // {
    //   label: "DPD",
    //   value: `${activeLoan?.penalty_days ?? 0} Days`,
    //   icon: RiAlertLine,
    //   danger: Number(activeLoan?.penalty_days) > 0,
    // },
    // {
    //   label: "DPD/Penal Charges",
    //   value: `₹${activeLoan?.penal_charges ?? "0"}`,
    //   icon: RiAlertLine,
    //   danger: Number(activeLoan?.penal_charges) > 0,
    // },
    // {
    //   label: "Current Interest",
    //   value: `₹${activeLoan?.due_interest_on_current_day ?? "0"}`,
    //   icon: RiPercentLine,
    // },
    // {
    //   label: "Total Outstanding",
    //   value: `₹${activeLoan?.due_amount_on_current_day ?? "0"}`,
    //   icon: RiMoneyRupeeCircleLine,
    //   highlight: true,
    // },
  ];

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        {/* Top Border */}
        <div
          className={`h-1 ${
            activeLoan?.loan_status === "Overdue"
              ? "bg-red-500"
              : "bg-primary"
          }`}
        />

        {/* ================= HEADER ================= */}
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
                Complete loan and repayment details
              </p>
            </div>
          </div>

          {/* Status */}
          <div
            className={`
              inline-flex w-fit items-center gap-2 rounded-full
              px-3 py-1.5 text-xs font-semibold
              ${
                isOverdue
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }
            `}
          >
            <span
              className={`
                h-2 w-2 rounded-full
                ${isOverdue ? "bg-red-500" : "bg-emerald-500"}
              `}
            />

            {activeLoan?.loan_status || "Active"}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {loanDetails.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  border-b border-r border-slate-100
                  px-3 py-3
                  transition-colors
                  hover:bg-slate-50
                "
              >
                <div className="flex items-center gap-2.5">
                  {/* Icon */}
                  <div
                    className={`
                      flex h-7 w-7 shrink-0 items-center justify-center
                      rounded-md bg-primary/10 text-primary
                    `}
                  >
                    <Icon size={14} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium leading-4 text-slate-400">
                      {item.label}
                    </p>

                    <p
                      className={`
                        truncate text-[12px] font-semibold leading-4
                        ${
                          item.danger
                            ? "text-red-600"
                            : item.highlight
                              ? "text-[#3E3E75]"
                              : "text-slate-700"
                        }
                      `}
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
    </div>
  );
};

export default LoanDetails;
