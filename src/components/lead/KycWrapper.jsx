import React, { useState } from "react";

// Components
import VideoKYC from "../common/VideoKYC";
import BankInfoSection from "./BankInfoSection";
import KYCInfoSection from "./KYCInfoSection";
import CreditInfo from "./CreditInfo";
import DocumentsList from "./DocumentsList";
import LoanInfoSection from "./LoanInfoSection";
import Icon from "../utils/Icon";
import CreditSection from "./CreditSection";
import BankStatementAnalyser from "./BankStatementAnalyser ";
import OfferLoan from "./OfferLoan";
import RemarksHistory from "./RemarksHistory";
import Disbursement from "./Disbursement";
import ESignatureStatus from "../common/ESignatureStatus";

const KycWrapper = ({ loanData, userData, onAction }) => {
  const [activeSection, setActiveSection] = useState("videokyc");

  // Mock data
  const mockLoanData = {
    loanId: "L-2024-001234",
    applicationDate: "2024-01-15",
    loanAmount: 500000,
    interestRate: 8.5,
    tenure: 60,
    monthlyEMI: 10256,
    totalInterest: 115360,
    totalPayable: 615360,
    purpose: "Home Renovation",
    status: "Pending",
    disbursementDate: null,
    nextPaymentDate: "2024-02-01",
    remainingAmount: 410240,
    overdueDays: 0,
  };

  const mockUserData = {
    name: "Rahul Kumar",
    email: "rahul.kumar@email.com",
    phone: "+91 98765 43210",
    address:
      "123, Green Valley Apartments, Electronic City, Bangalore - 560100",
    pan: "ABCDE1234F",
    aadhar: "XXXX-XXXX-XXXX-1234",
    dateOfBirth: "15 May 1990",
    employmentType: "Salaried",
    annualIncome: 1200000,
    creditScore: 765,
  };

  const loanInfo = loanData || mockLoanData;
  const userInfo = userData || mockUserData;

  const sections = [
    { id: "videokyc", label: "Video KYC", icon: "RiShieldCheckLine" },
    { id: "remarks", label: "Remarks History", icon: "PiBookOpenTextDuotone" },
    { id: "esign", label: "e-Signature", icon: "FaSignature" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "videokyc":
        return <VideoKYC userInfo={userInfo} />;
      case "remarks":
        return <RemarksHistory userInfo={userInfo} />;
      case "esign":
        return <ESignatureStatus userInfo={userInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Sections
            </p>
            <nav className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon
                      name={section.icon}
                      color={isActive ? "blue" : "gray"}
                      size={16}
                    />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800">
                {sections.find((s) => s.id === activeSection)?.label}
              </h3>
              <span className="text-[10px] text-gray-400">
                {sections.findIndex((s) => s.id === activeSection) + 1} of{" "}
                {sections.length}
              </span>
            </div>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycWrapper;
