import React, { useState } from "react";
import Icon from "../utils/Icon";
import Modal from "../utils/Modal";
import TextInput from "../fields/TextInput";
import Button from "../utils/Button";

const LoanAnalysis = ({permission=false}) => {
  // ---------- Loan Product Details (editable) ----------
  const [loanProduct, setLoanProduct] = useState({
    productName: "Home Loan - Fixed Rate",
    productType: "Home Loan",
    loanAmount: "₹50,00,000",
    interestRate: "8.5%",
    tenure: "20 Years",
    processingFee: "1%",
    emiOption: "Fixed EMI",
    purpose: "Purchase of new house",
  });

  // ---------- Disbursement Data (static for demo) ----------
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

  // ---------- State for Modals & UI ----------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [disbursementStatus, setDisbursementStatus] = useState(null);

  // Editable fields (copied from loanProduct for the edit form)
  const [editForm, setEditForm] = useState({ ...loanProduct });

  // ---------- Handlers ----------
  const handleEditClick = () => {
    setEditForm({ ...loanProduct });
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    setLoanProduct({ ...editForm });
    setIsEditModalOpen(false);
  };

  const handleDisburse = () => setIsDisburseModalOpen(true);
  const handleCloseDisburseModal = () => {
    if (!isProcessing) {
      setIsDisburseModalOpen(false);
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
      setIsDisburseModalOpen(false);
      setRemarks("");
      setTimeout(() => setDisbursementStatus(null), 5000);
    }, 2000);
  };

  // ---------- Render ----------
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Icon name="RiFileListLine" size={16} color="#8140DC" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                Loan Details
              </h2>
              <p className="text-[10px] text-slate-500">
                Verify or Edit Loan Details
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
            <div className="space-y-4">
              {/* ---------- LOAN PRODUCT SECTION (with Edit) ---------- */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Icon name="RiProductHuntLine" size={14} color="#8140DC" />
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Loan Product
                    </span>
                  </div>
                  {permission && <button
                    onClick={handleEditClick}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition"
                  >
                    <Icon name="RiEditLine" size={14} />
                    Edit
                  </button>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Product
                    </p>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {loanProduct.productName}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Type
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {loanProduct.productType}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Amount
                    </p>
                    <p className="text-xs font-bold text-primary">
                      {loanProduct.loanAmount}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Interest
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {loanProduct.interestRate}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Tenure
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {loanProduct.tenure}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Processing Fee
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {loanProduct.processingFee}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      EMI Option
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {loanProduct.emiOption}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Purpose
                    </p>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {loanProduct.purpose}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- EDIT PRODUCT MODAL ---------- */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Loan Product"
        size="md"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-5">
            <div>
              <TextInput
                label={"Product Name"}
                value={editForm.productName}
                onChange={(e) =>
                  setEditForm({ ...editForm, productName: e.target.value })
                }
              />
            </div>
            <div>
              <TextInput
                label={"Product Type"}
                value={editForm.productType}
                onChange={(e) =>
                  setEditForm({ ...editForm, productType: e.target.value })
                }
              />
            </div>
            <div>
              <TextInput
                label={"Loan Amount"}
                value={editForm.loanAmount}
                onChange={(e) =>
                  setEditForm({ ...editForm, loanAmount: e.target.value })
                }
              />
            </div>
            <div>
              <TextInput
                label={"Interest Rate"}
                value={editForm.interestRate}
                onChange={(e) =>
                  setEditForm({ ...editForm, interestRate: e.target.value })
                }
              />
            </div>
            <div>
              <TextInput
                label={"Tenure"}
                value={editForm.tenure}
                onChange={(e) =>
                  setEditForm({ ...editForm, tenure: e.target.value })
                }
              />
            </div>
            <div>
              <TextInput
                label={"Processing Fee"}
                value={editForm.processingFee}
                onChange={(e) =>
                  setEditForm({ ...editForm, processingFee: e.target.value })
                }
              />
            </div>
            <div>
              <TextInput
                label={"EMI Option"}
                value={editForm.emiOption}
                onChange={(e) =>
                  setEditForm({ ...editForm, emiOption: e.target.value })
                }
              />
            </div>
            <div>
              <TextInput
                label={"Purpose"}
                value={editForm.purpose}
                onChange={(e) =>
                  setEditForm({ ...editForm, purpose: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              style={"border-gray-200"}
              btnName={"Cancel"}
              onClick={() => setIsEditModalOpen(false)}
            />

            <Button
              onClick={handleEditSave}
              btnIcon={"RiSaveLine"}
              style={"bg-primary text-white"}
              btnName={"Save Changes"}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoanAnalysis;
