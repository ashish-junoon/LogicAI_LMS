import React from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiMoneyRupeeCircleLine,
  RiCalendarLine,
  RiFileList3Line,
} from "react-icons/ri";

const LoanStatusSummary = ({ lead }) => {
  const isClosed = lead?.loan_status?.toLowerCase() === "closed" || "settle" || "foreclosure";
  const isNpa = lead?.stage === "npa";
  const isOverDue = lead?.stage === "overdue";

  return (
    <div
      className={`
        rounded-xl
        border  
        p-4
        ${
          isClosed
            ? "border-emerald-300 bg-emerald-50/30"
            : isNpa
              ? "border-red-300 bg-red-50/30"
              : "border-blue-300 bg-blue-50"
        }
      `}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* STATUS */}

        <div className="flex items-center gap-3">
          <div
            className={`
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-full
              ${
                isClosed
                  ? "bg-emerald-100 text-emerald-600"
                  : isNpa
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
              }
            `}
          >
            {isClosed ? (
              <RiCheckboxCircleLine size={24} />
            ) : isNpa ? (
              <RiCloseCircleLine size={24} />
            ) : (
              <GiTakeMyMoney size={24} />
            )}
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-400">
              Loan Status
            </p>

            <h3 className="text-sm font-semibold text-slate-800">
              {isClosed ? "Loan Closed" : "Loan Active"}
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-500">
              {isClosed
                ? "This loan has been successfully closed."
                : "Loan has been disbursed and is currently active."}
            </p>
          </div>
        </div>

        {/* DETAILS */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* LOAN AMOUNT */}

          <div
            className="
              rounded-lg
              border border-slate-200
              bg-white
              px-3 py-2
            "
          >
            <div className="flex items-center gap-1.5">
              <RiMoneyRupeeCircleLine size={14} className="text-primary" />

              <span className="text-[10px] text-slate-400">Loan Amount</span>
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-700">
              ₹{lead?.loan_amount?.toLocaleString("en-IN") || "0"}
            </p>
          </div>

          {/* DISBURSEMENT DATE */}

          <div
            className="
              rounded-lg
              border border-slate-200
              bg-white
              px-3 py-2
            "
          >
            <div className="flex items-center gap-1.5">
              <RiCalendarLine size={14} className="text-primary" />

              <span className="text-[10px] text-slate-400">Disbursed On</span>
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-700">
              {lead?.disbursement_date?.split(" ")[0] || "-"}
            </p>
          </div>

          {/* LOAN ID */}

          <div
            className="
              col-span-2
              rounded-lg
              border border-slate-200
              bg-white
              px-3 py-2
              sm:col-span-1
            "
          >
            <div className="flex items-center gap-1.5">
              <RiFileList3Line size={14} className="text-primary" />

              <span className="text-[10px] text-slate-400">Loan ID</span>
            </div>

            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
              {lead?.loan_id || lead?.id || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatusSummary;
