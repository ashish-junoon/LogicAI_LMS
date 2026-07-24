import React, { useState } from "react";
import Icon from "../utils/Icon";
import Modal from "../utils/Modal";

const Disbursement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [disbursementStatus, setDisbursementStatus] = useState(null);

  const disbursementData = {
    loanAmount: "₹5,00,000",
    disbursementAmount: "₹4,75,000",
    approvedBy: "Rajesh Khanna",
    bankName: "HDFC Bank",
    accountNumber: "XXXX-XXXX-1234",
    ifscCode: "HDFC0000123",
    accountHolderName: "Rahul Sharma",
    modeOfPayment: "Bank Transfer",
    date: new Date().toISOString().split("T")[0],

    // EMI Details
    emiAmount: "₹10,256",
    emiTenure: "60 Months",
    interestRate: "8.5%",
    totalInterest: "₹1,15,360",
    totalPayable: "₹6,15,360",
    firstEmiDate: "2026-02-01",
    emiDay: "1st of every month",
  };

  const handleDisburse = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    if (!isProcessing) {
      setIsModalOpen(false);
      setRemarks("");
    }
  };

  const handleConfirmDisbursement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setDisbursementStatus({
        success: true,
        message: "Disbursement completed successfully!",
        reference: "DISB-" + Date.now().toString().slice(-6),
      });
      setIsProcessing(false);
      setIsModalOpen(false);
      setRemarks("");
      setTimeout(() => setDisbursementStatus(null), 5000);
    }, 2000);
  };

  return (
    <>
      {/* Compact Disbursement Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Icon name="RiMoneyDollarCircleLine" size={16} color="blue" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                Disbursement
              </h2>
              <p className="text-[10px] text-slate-500">
                Process loan disbursement
              </p>
            </div>
          </div>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            LA-1250
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {disbursementStatus ? (
            <div
              className={`rounded-md px-3 py-2 flex items-center gap-2 ${
                disbursementStatus.success
                  ? "bg-emerald-50 border border-primary/10"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <Icon
                name={
                  disbursementStatus.success
                    ? "RiCheckboxCircleLine"
                    : "RiErrorWarningLine"
                }
                size={18}
                color={disbursementStatus.success ? "#059669" : "#DC2626"}
              />
              <div className="flex-1">
                <p
                  className={`text-xs font-semibold ${
                    disbursementStatus.success
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {disbursementStatus.message}
                </p>
                {disbursementStatus.reference && (
                  <p className="text-[10px] text-slate-500">
                    Ref: {disbursementStatus.reference}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Compact Summary Grid - 3 columns */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Loan
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    {disbursementData.loanAmount}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Disburse
                  </p>
                  <p className="text-xs font-bold text-primary">
                    {disbursementData.disbursementAmount}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Mode
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    {disbursementData.modeOfPayment}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Approved By
                  </p>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {disbursementData.approvedBy}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Bank
                  </p>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {disbursementData.bankName}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Account
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    {disbursementData.accountNumber}
                  </p>
                </div>
              </div>

              {/* EMI Details Section */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon name="RiBankCardLine" size={12} color="#64748B" />
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                    EMI Details
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-md px-2 py-1.5 text-center border border-primary/10">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      EMI Amount
                    </p>
                    <p className="text-xs font-bold text-primary">
                      {disbursementData.emiAmount}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Tenure
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {disbursementData.emiTenure}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Interest
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {disbursementData.interestRate}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Total Payable
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {disbursementData.totalPayable}
                    </p>
                  </div>
                </div>

                {/* EMI Schedule Quick View */}
                <div className="flex items-center justify-between mt-1.5 px-2 py-2 bg-blue-50/50 rounded-md border border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <Icon name="RiCalendarLine" size={12} color="#3B82F6" />
                    <span className="text-[11px] text-slate-600">
                      First EMI:
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800">
                      {disbursementData.firstEmiDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="RiTimeLine" size={12} color="#3B82F6" />
                    <span className="text-[11px] text-slate-600">Due on:</span>
                    <span className="text-[11px] font-semibold text-slate-800">
                      {disbursementData.emiDay}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="RiPieChartLine" size={12} color="#3B82F6" />
                    <span className="text-[11px] text-slate-600">
                      Total Interest:
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600">
                      {disbursementData.totalInterest}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact Button */}
              <button
                onClick={handleDisburse}
                className="w-full bg-primary text-white px-4 py-3 rounded-md font-semibold hover:bg-primary/80 transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm hover:shadow cursor-pointer"
              >
                <Icon name="RiSendPlane2Line" size={14} color="#FFFFFF" />
                <span>Disburse Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Confirm Disbursement"
        size="sm"
      >
        <div className="space-y-3">
          {/* Compact Summary */}
          <div className="bg-slate-50 rounded-md p-3 grid grid-cols-2 gap-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Loan Amount</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.loanAmount}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Disbursement</span>
              <span className="font-bold text-primary">
                {disbursementData.disbursementAmount}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Payment Mode</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.modeOfPayment}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Bank</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.bankName}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Account</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.accountNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Date</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.date}
              </span>
            </div>
          </div>

          {/* EMI Summary in Modal */}
          <div className="p-2 mt-1.5 border-t border-slate-200 bg-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon name="RiBankCardLine" size={12} color="#64748B" />
              <span className="text-[10px] font-semibold text-slate-600">
                EMI Summary
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">EMI Amount</span>
                <span className="font-semibold text-primary">
                  {disbursementData.emiAmount}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Tenure</span>
                <span className="font-semibold text-slate-800">
                  {disbursementData.emiTenure}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Interest Rate</span>
                <span className="font-semibold text-slate-800">
                  {disbursementData.interestRate}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Payable</span>
                <span className="font-semibold text-slate-800">
                  {disbursementData.totalPayable}
                </span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="2"
              placeholder="Add remarks..."
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
            />
          </div>

          {/* Confirmation */}
          <div className="flex items-start gap-1.5">
            <input
              type="checkbox"
              id="confirmDisbursement"
              className="mt-0.5 w-3.5 h-3.5 text-primary border-slate-300 rounded focus:ring-emerald-500"
            />
            <label
              htmlFor="confirmDisbursement"
              className="text-[12px] text-slate-600 leading-relaxed"
            >
              I confirm all details are verified and authorize disbursement of
              <span className="font-semibold text-primary">
                {" "}
                {disbursementData.disbursementAmount}
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isProcessing}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-200 hover:bg-slate-100 rounded-md transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDisbursement}
              disabled={isProcessing}
              className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary/80 cursor-pointer transition-all flex items-center gap-1.5 text-xs shadow-sm hover:shadow disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">
                    <Icon name="RiRefreshLine" size={14} color="#FFFFFF" />
                  </span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Icon name="RiCheckLine" size={14} color="#FFFFFF" />
                  <span>Confirm</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Disbursement;
