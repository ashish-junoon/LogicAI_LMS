// import React, { useState } from "react";

// import PersonalInformation from "../../components/forms/PersonalInformation";
// import KycInformation from "../../components/forms/KycInformation";
// import AddressInformation from "../../components/forms/AddressInformation";
// import MultipleBankInformation from "../../components/forms/MultipleBankInformation";
// import GuarantorInformation from "../../components/forms/GuarantorInformation";
// import EmploymentInformation from "../../components/forms/EmploymentInformation";
// import OtherDocsInformation from "../../components/forms/OtherDocsInformation";

// const LeadFormDetails = ({permisions}) => {
//   const [selected, setSelected] = useState("Personal Information");

//   const tabs = [
//     "Personal Information",
//     "KYC Details",
//     "Address Information",
//     "Bank Details",
//     // "Guarantor's Details",
//     "Co Borrower/Guarantor's Details",
//     "Employment Information",
//     // "Other Documents",
//   ];

//   const renderTabs = (tab) => {
//     switch (tab) {
//       case "Personal Information":
//         return <PersonalInformation permission={permisions?.personalInfo} />;
//       case "KYC Details":
//         return <KycInformation permission={permisions?.kycInfo} />;
//       case "Address Information":
//         return <AddressInformation permission={permisions?.addressInfo} />;
//       case "Bank Details":
//         return <MultipleBankInformation permission={permisions?.bankInfo} />;
//     //   case "Guarantor's Details":
//       case "Co Borrower/Guarantor's Details":
//         return <GuarantorInformation permission={permisions?.guarantorInfo} />;
//       case "Employment Information":
//         return <EmploymentInformation permission={permisions?.employementInfo} />;
//       default:
//         return <PersonalInformation permission={permisions?.personalInfo} />;
//     }
//   };

//   return (
//     <section className="w-full">
//       {/* Tabs */}
//       <div className="flex justify-center gap-2 w-[80%] mx-auto">
//         {tabs.map((tab) => {
//           const isActive = selected === tab;

//           return (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => setSelected(tab)}
//               className={`
//                 px-3 py-2
//                 rounded-lg
//                 border border-primary
//                 text-xs font-semibold
//                 whitespace-nowrap
//                 cursor-pointer
//                 transition-all duration-200
//                 ${
//                   isActive
//                     ? "bg-primary text-white shadow-sm"
//                     : "text-primary hover:bg-primary/5"
//                 }
//               `}
//             >
//               {tab}
//             </button>
//           );
//         })}
//       </div>

//       {/* Selected Form */}
//       <div className="mt-6">
//         {renderTabs(selected)}
//       </div>
//     </section>
//   );
// };

// export default LeadFormDetails;

import React, { useState } from "react";

import PersonalInformation from "../../components/forms/PersonalInformation";
import KycInformation from "../../components/forms/KycInformation";
import AddressInformation from "../../components/forms/AddressInformation";
import MultipleBankInformation from "../../components/forms/MultipleBankInformation";
import GuarantorInformation from "../../components/forms/GuarantorInformation";
import EmploymentInformation from "../../components/forms/EmploymentInformation";

const LeadFormDetails = ({ permisions }) => {
  const [selected, setSelected] = useState("Personal Information");

  const tabs = [
    {
      name: "Personal Information",
      permission: permisions?.personalInfo,
    },
    {
      name: "KYC Details",
      permission: permisions?.kycInfo,
    },
    {
      name: "Address Information",
      permission: permisions?.addressInfo,
    },
    {
      name: "Bank Details",
      permission: permisions?.bankInfo,
    },
    {
      name: "Co Borrower/Guarantor's Details",
      permission: permisions?.guarantorInfo,
    },
    {
      name: "Employment Information",
      permission: permisions?.employementInfo,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.permission !== false);

  const renderTabs = (tab) => {
    switch (tab) {
      case "Personal Information":
        return <PersonalInformation permission={permisions?.personalInfo} />;

      case "KYC Details":
        return <KycInformation permission={permisions?.kycInfo} />;

      case "Address Information":
        return <AddressInformation permission={permisions?.addressInfo} />;

      case "Bank Details":
        return <MultipleBankInformation permission={permisions?.bankInfo} />;

      case "Co Borrower/Guarantor's Details":
        return <GuarantorInformation permission={permisions?.guarantorInfo} />;

      case "Employment Information":
        return (
          <EmploymentInformation permission={permisions?.employementInfo} />
        );

      default:
        return null;
    }
  };

  return (
    <section className="w-full">
      {/* ================= TABS ================= */}
      <div className="flex w-full justify-center">
        <div className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-[#e5e7eb] bg-primary/5 p-1 no-scrollbar">
          {visibleTabs.map((tab) => {
            const isActive = selected === tab.name;

            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setSelected(tab.name)}
                className={`relative shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-[11px] font-semibold
                  transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? `bg-primary text-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]`
                      : `text-[#737780] hover:bg-white/70 hover:text-[#30343b]`
                  }
                `}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="mt-5">{renderTabs(selected)}</div>
    </section>
  );
};

export default LeadFormDetails;
