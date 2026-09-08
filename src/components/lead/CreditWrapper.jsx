import React, { useState } from "react";

// Components
import VideoKYC from "../common/VideoKYC";
import DocumentsList from "./DocumentsList";
import Icon from "../utils/Icon";
import CreditSection from "./CreditSection";
import BankStatementAnalyser from "./BankStatementAnalyser ";
import RemarksHistory from "./RemarksHistory";
import LoanAnalysis from "./LoanAnalysis";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import SelectInput from "../fields/SelectInput";
import LeadForm from "../../pages/formPages/LeadForm";

const CreditWrapper = ({ loanData, userData, onAction }) => {
  const [activeSection, setActiveSection] = useState("credit");
  const [switchLoanProvier, setswitchLoanProvier] = useState(false);

  const handleSwitchProvider = () => {
    setswitchLoanProvier(true);
  };

  const sections = [
    { id: "credit", label: "Credit Analysis", icon: "RiShieldCheckLine" },
    { id: "bsa", label: "Bank Statement Ananlysis", icon: "RiBankCardLine" },
    { id: "loaninfo", label: "Loan Info", icon: "GiPayMoney" },
    { id: "documents", label: "Documents", icon: "RiFileList3Line" },
    { id: "user", label: "User Details", icon: "RiShieldCheckLine" },
    { id: "remarks", label: "Remarks History", icon: "PiBookOpenTextDuotone" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "user":
        return <LeadForm />;
      case "credit":
        return <CreditSection />;
      case "videoKyc":
        return <VideoKYC />;
      case "loaninfo":
        return (
          <>
            <div className="flex justify-end mb-2">
              <Button
                style={"bg-primary text-white"}
                btnName={"Switch Provider"}
                onClick={handleSwitchProvider}
              />
            </div>
            <LoanAnalysis permission={true}  />
          </>
        );
      case "remarks":
        return <RemarksHistory />;
      case "bsa":
        return <BankStatementAnalyser />;
      case "documents":
        return <DocumentsList permission={true} />;
      default:
        return null;
    }
  };

  return (
    <>
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
                        color={isActive ? "#8140DC" : "gray"}
                        // className={isActive ? "text-blue-500" : "text-gray-500"}
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

      <Modal
        title={"Update Loan Provider"}
        isOpen={switchLoanProvier}
        onClose={() => setswitchLoanProvier(false)}
      >
        <div className="py-2">
          <div className="grid grid-cols-2 gap-2">
            <SelectInput
              options={[
                { label: "Virdian", value: "Virdian" },
                { label: "Meximo", value: "Meximo" },
              ]}
              label={"Select Loan Provider"}
              placeholder={"Select Loan Provider"}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button style={"border border-gray-200"} btnName={"Cancle"} />
            <Button style={"bg-primary text-white"} btnName={"Update"} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreditWrapper;
