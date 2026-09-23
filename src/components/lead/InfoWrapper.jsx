import React, { useState } from "react";

// Components
import VideoKYC from "../common/VideoKYC";
import BankInfoSection from "./BankInfoSection";
import CreditInfo from "./CreditInfo";
import DocumentsList from "./DocumentsList";
import Icon from "../utils/Icon";
import RemarksHistory from "./RemarksHistory";
import LeadForm from "../../pages/formPages/LeadForm";
import LoanAnalysis from "./LoanAnalysis";
import LeadFormDetails from "../../pages/formPages/LeadFormDetails";

const InfoWrapper = () => {
  const [activeSection, setActiveSection] = useState("user");

  
  const permisions = {
    personalInfo : true,
    kycInfo : true,
    addressInfo : true,
    bankInfo : true,
    guarantorInfo : true,
    employementInfo : true,
  }

  const sections = [
    { id: "user", label: "User Details", icon: "RiShieldCheckLine" },
    { id: "credit", label: "Credit Health", icon: "RiBankCardLine" },
    { id: "documents", label: "Documents", icon: "RiFileList3Line" },
    { id: "loanInfo", label: "Loan Info", icon: "RiInformationLine" },
    { id: "bankInfo", label: "Bank Info", icon: "RiBankLine" },
    { id: "remarks", label: "Remarks History", icon: "PiBookOpenTextDuotone" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "user":
        return <LeadFormDetails permisions={permisions} />;
        // return <LeadForm />;
      case "loanInfo":
        return <LoanAnalysis />;
      case "documents":
        return <DocumentsList permission={true} />;
      case "credit":
        return <CreditInfo />;
      case "videoKyc":
        return <VideoKYC />;
      case "bankInfo":
        return <BankInfoSection />;
      case "remarks":
        return <RemarksHistory permission={true} />;
      default:
        return null;
    }
  };

  return (
    // <div className="py-4">
    //   <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
    //     {/* Sidebar Navigation */}
    //     <div className="lg:col-span-1">
    //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
    //         <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</p>
    //         <nav className="space-y-1">
    //           {sections.map((section) => {

    //             const isActive = activeSection === section.id;
    //             return (
    //               <button
    //                 key={section.id}
    //                 onClick={() => setActiveSection(section.id)}
    //                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
    //                   isActive
    //                     ? "bg-primary/5 text-primary font-medium"
    //                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
    //                 }`}
    //               >
    //                 <Icon name={section.icon} color={isActive ? "#5050b8" : "gray"} size={16} />
    //                 {section.label}
    //               </button>
    //             );
    //           })}
    //         </nav>
    //       </div>
    //     </div>

    //     {/* Content Area */}
    //     <div className="lg:col-span-3">
    //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
    //         <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
    //           <h3 className="text-sm font-semibold text-gray-800">
    //             {sections.find(s => s.id === activeSection)?.label}
    //           </h3>
    //           <span className="text-[10px] text-gray-400">
    //             {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
    //           </span>
    //         </div>
    //         {renderSection()}
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="py-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">

        <div className="border-b border-gray-200 px-4">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {sections.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <Icon
                    name={section.icon}
                    color={isActive ? "#5050b8" : "gray"}
                    size={16}
                  />

                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-5">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default InfoWrapper;
