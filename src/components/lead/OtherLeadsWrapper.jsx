import { useState } from "react";

// Components
import Icon from "../utils/Icon";
import LoanOverview from "./LoanOverview";
import LeadInformationPage from "../informationCard/LeadInformationPage";

const OtherLeadsWrapper = ({ loanData, userData, onAction }) => {
  console.log("otherleadwrapper",loanData)

const [activeSection, setActiveSection] = useState("user");

const sections = [
  { id: "user", label: "User Details", icon: "RiFileList3Line" },
  { id: "loanInfo", label: "Loan Info", icon: "RiInformationLine" },
];

const renderSection = () => {
  switch (activeSection) {
    case "user":
      return <LeadInformationPage loanData={loanData} />;
    case "loanInfo":
      return <LoanOverview activeLoan={loanData} />;
    default:
      return null;
  }
};

return (
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
                className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${isActive
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

export default OtherLeadsWrapper;
