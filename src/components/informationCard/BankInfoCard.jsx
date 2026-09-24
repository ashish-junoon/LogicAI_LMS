import React from "react";
import {
  RiBankLine,
  RiFileTextLine,
} from "react-icons/ri";

import { useLoanDetails } from "../../provider/loanContext";
import { mask } from "../utils/common";
import { bankListData } from "../../content/data";

const BankInfoCard = () => {
  const { loanDetails } = useLoanDetails();

  const bankDetails = {
    bankName: loanDetails?.bank_name || "-",
    accountNumber: mask(loanDetails?.account_number) || "-",
    ifscCode: loanDetails?.ifsc_code || "-",
    accountHolderName: loanDetails?.customer_name || "-",
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-slate-200
          bg-gradient-to-r
          from-primary/10
          via-white
          to-white
          px-4
          py-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-primary/10
            bg-primary/10
          "
        >
          <RiBankLine className="text-xl text-primary" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Bank Information
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Customer bank account information
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-4">
        {loanDetails?.account_number ? (
          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50/50
              p-4
            "
          >
            {/* Bank Header */}
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                "
              >
                <RiBankLine size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">
                  Bank Name
                </p>

                <p className="truncate text-sm font-semibold text-slate-800">
                  {bankListData?.find((bank) => bank.bankId === loanDetails?.ifsc_code?.slice(0,4))?.bankName}
                </p>
              </div>
            </div>

            {/* Bank Details */}

            <div
              className="
                grid
                grid-cols-2
                gap-x-6
                gap-y-4
                sm:grid-cols-4
              "
            >
              {/* Account Number */}

              <div>
                <p className="mb-1 text-[10px] text-slate-400">
                  Account Number
                </p>

                <p className="text-xs font-semibold tracking-wide text-slate-700">
                  {bankDetails.accountNumber}
                </p>
              </div>

              {/* IFSC */}

              <div>
                <p className="mb-1 text-[10px] text-slate-400">
                  IFSC Code
                </p>

                <p className="text-xs font-semibold text-slate-700">
                  {bankDetails.ifscCode}
                </p>
              </div>

              {/* Account Holder */}

              <div className="col-span-2">
                <p className="mb-1 text-[10px] text-slate-400">
                  Account Holder Name
                </p>

                <p className="truncate text-xs font-semibold text-slate-700">
                  {bankDetails.accountHolderName}
                </p>
              </div>
            </div>

            {/* Read Only Badge */}

            <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-3">
              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-2.5
                  py-1
                  text-[10px]
                  font-medium
                  text-slate-500
                "
              >
                READ ONLY
              </span>

              <span className="text-[10px] text-slate-400">
                Bank information cannot be edited here.
              </span>
            </div>
          </div>
        ) : (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-slate-50/50
              px-4
              py-10
              text-center
            "
          >
            <RiBankLine
              size={28}
              className="mx-auto mb-2 text-slate-300"
            />

            <p className="text-sm font-semibold text-slate-600">
              No Bank Information Available
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Bank account information has not been added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankInfoCard;
