import React, { useState } from "react";

// Components
import DocumentsList from "./DocumentsList";
import Icon from "../utils/Icon";
import RemarksHistory from "./RemarksHistory";
import LoanAnalysis from "./LoanAnalysis";
import LeadForm from "../../pages/formPages/LeadForm";
import LoanOverview from "./LoanOverview";

const OtherLeadsWrapper = ({ loanData, userData, onAction }) => {
  const [activeSection, setActiveSection] = useState("documents");
  
  const sections = [
    { id: "documents", label: "Documents", icon: "RiFileList3Line" },
    { id: "loanInfo", label: "Loan Info", icon: "RiInformationLine" },
    { id: "user", label: "User Details", icon: "RiFileList3Line" },
    { id: "remarks", label: "Remarks History", icon: "PiBookOpenTextDuotone" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "user":
        return <LeadForm />;
      case "loanInfo":
        // return <LoanAnalysis />;
        return <LoanOverview />;
      case "documents":
        return <DocumentsList permission={false} />;
      case "remarks":
        return <RemarksHistory permission={false} />;
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
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</p>
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
                    <Icon name={section.icon} color={isActive ? "#5050b8" : "gray"} size={16} />
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
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              <span className="text-[10px] text-gray-400">
                {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
              </span>
            </div>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherLeadsWrapper;