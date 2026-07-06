import React, { useState } from "react";
import Accordion from "../../components/utils/Accordion";
import TextInput from "../../components/fields/TextInput";
import Button from "../../components/utils/Button";
import PersonalInfo from "../../components/forms/PersonalInfo";
import AddressInfo from "../../components/forms/AddressInfo ";
import KycInfo from "../../components/forms/KycInfo";
import BankInfo from "../../components/forms/BankInfo";
import GuarantorInfo from "../../components/forms/GuarantorInfo";
import LoanInfo from "../../components/forms/LoanInfo";
import AadhaarVerification from "../../components/AadharVerification"
import Modal from "../../components/utils/Modal";

// Icons
import {
  RiCheckboxCircleFill,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiBankCardLine,
  RiPercentLine,
} from "react-icons/ri";
import ConfirmationModal from "../../components/utils/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const ApplyLoan = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [isLoanSubmitted, setisLoanSubmitted] = useState(false);
  const [isFillByAadhaar, setisFillByAadhaar] = useState(false);

  const navigate = useNavigate()

  return (
    <>
      <section>
        <div>
          <Button
            btnName="Fill Details By Addhar" 
            btnIcon="RiIdCardLine"
            onClick={()=> setisFillByAadhaar(true)}
            style="bg-blue-500 hover:bg-blue-600 text-white mb-2 cursor-pointer" />
        </div>

        <div className="space-y-2">
          <PersonalInfo
            open={activeAccordion === 0}
            onToggle={() => {
              activeAccordion == 0
                ? setActiveAccordion(10)
                : setActiveAccordion(0);
            }}
            onNext={() => setActiveAccordion(1)}
          />
          <AddressInfo
            open={activeAccordion === 1}
            onToggle={() => {
              activeAccordion == 1
                ? setActiveAccordion(10)
                : setActiveAccordion(1);
            }}
            onNext={() => setActiveAccordion(2)}
          />
          <KycInfo
            open={activeAccordion === 2}
            onToggle={() => {
              activeAccordion == 2
                ? setActiveAccordion(10)
                : setActiveAccordion(2);
            }}
            onNext={() => setActiveAccordion(3)}
          />
          <BankInfo
            open={activeAccordion === 3}
            onToggle={() => {
              activeAccordion == 3
                ? setActiveAccordion(10)
                : setActiveAccordion(3);
            }}
            onNext={() => setActiveAccordion(4)}
          />
          <GuarantorInfo
            open={activeAccordion === 4}
            onToggle={() => {
              activeAccordion == 4
                ? setActiveAccordion(10)
                : setActiveAccordion(4);
            }}
            onNext={() => setActiveAccordion(5)}
          />
          <LoanInfo
            open={activeAccordion === 5}
            onToggle={() => {
              activeAccordion == 5
                ? setActiveAccordion(10)
                : setActiveAccordion(5);
            }}
            onNext={() => setActiveAccordion(6)}
          />

          <div className="flex justify-end">
            <Button
              btnName="Submit Application"
              style="bg-blue-500 text-white cursor-pointer"
              onClick={() => setisLoanSubmitted(true)}
            />
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* Loan Confirmation Card  */}
      <ConfirmationModal
        isOpen={isLoanSubmitted}
        onClose={() => setisLoanSubmitted(false)}
        // onClose={() => navigate("/")}
        title="Loan Application"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 p-5 bg-green-50 border-b border-green-100">
            <RiCheckboxCircleFill
              size={42}
              className="text-green-600 animate-pulse"
            />

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Application Submitted Successfully
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your loan application has been submitted for verification.
              </p>
            </div>
          </div>

          {/* Summary */}

          <div className="grid grid-cols-2 gap-4 p-5">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <RiMoneyDollarCircleLine />
                Loan Amount
              </div>

              <h3 className="text-lg font-bold mt-1">₹2,50,000</h3>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <RiBankCardLine />
                Disbursement
              </div>

              <h3 className="text-lg font-bold mt-1">₹2,45,000</h3>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <RiCalendarLine />
                Tenure
              </div>

              <h3 className="text-lg font-bold mt-1">24 Months</h3>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <RiPercentLine />
                Interest Rate
              </div>

              <h3 className="text-lg font-bold mt-1">12% p.a.</h3>
            </div>
          </div>

          {/* Footer */}

          <div className="border-t border-slate-200 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Application ID</p>

              <p className="font-semibold">LMS240706001</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
              Under Review
            </span>
          </div>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={isFillByAadhaar}
        onClose={()=> setisFillByAadhaar(false)}
      >
        <AadhaarVearification setisFillByAadhaar={setisFillByAadhaar} />
      </ConfirmationModal>
    </>
  );
};

export default ApplyLoan;
