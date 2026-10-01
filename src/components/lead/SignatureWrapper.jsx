import React, { useState } from "react";

// Components
import VideoKYC from "../common/VideoKYC";
import Icon from "../utils/Icon";
import RemarksHistory from "./RemarksHistory";
import ESignatureStatus from "../common/ESignatureStatus";
import LeadForm from "../../pages/formPages/LeadForm";
import DocumentsList from "./DocumentsList";
import LeadFormDetails from "../../pages/formPages/LeadFormDetails";
import LiveKYC from "../common/LiveKYC";
import DocumentSignature from "../common/DocumentSignature";

const SignatureWrapper = ({}) => {
  const [activeSection, setActiveSection] = useState("document");
  const sections = [
    { id: "document", label: "Documents", icon: "PiBookOpenTextDuotone" },
    { id: "esign", label: "e-Signature", icon: "FaSignature" },
    { id: "user", label: "User Details", icon: "PiBookOpenTextDuotone" },
    { id: "remarks", label: "Remarks History", icon: "PiBookOpenTextDuotone" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "user":
        return <LeadFormDetails />;
      case "videokyc":
        return (
          <>
            {/* <VideoKYC /> 
        <br />  */}
            <LiveKYC />
          </>
        );
      case "remarks":
        return <RemarksHistory permission={true} />;
      case "esign":
        return (
          <>
            <DocumentSignature />
            <br />
            <ESignatureStatus />
          </>
        );
      case "document":
        return <DocumentsList permission={true} />;
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
    //         <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
    //           Sections
    //         </p>
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
    //                 <Icon
    //                   name={section.icon}
    //                   color={isActive ? "#5050b8" : "gray"}
    //                   size={16}
    //                 />
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
    //             {sections.find((s) => s.id === activeSection)?.label}
    //           </h3>
    //           <span className="text-[10px] text-gray-400">
    //             {sections.findIndex((s) => s.id === activeSection) + 1} of{" "}
    //             {sections.length}
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

        <div className="p-5">{renderSection()}</div>
      </div>
    </div>
  );
};

export default SignatureWrapper;
