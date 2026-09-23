import React, { useEffect , useState } from "react";
import PersonalInfo from "../../components/forms/PersonalInfo";
import KycInfo from "../../components/forms/KycInfo";
import GuarantorInfo from "../../components/forms/GuarantorInfo";
import OtherDocsInfo from "../../components/forms/OtherDocsInfo";
import AddressInfo from "../../components/forms/AddressInfo";
import MultipleBankInfo from "../../components/forms/MultipleBankInfo";
import EmploymentInfo from "../../components/forms/EmploymentInfo";
import PersonalInformation from "../../components/forms/PersonalInformation";
import KycInformation from "../../components/forms/KycInformation";
import AddressInformation from "../../components/forms/AddressInformation";
import MultipleBankInformation from "../../components/forms/MultipleBankInformation";
// import BusinessSurvey from "../../components/forms/BusinessSurvey";

const initialDocuments = [
  {
    documentType: "Passport",
    fileName: "passport.pdf",
  },
  {
    documentType: "Driving License",
    fileName: "driving-license.pdf",
  },
  {
    documentType: "Electricity Bill",
    fileName: "electricity-bill.pdf",
  },
];

const LeadForm = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  return (
    <>
        <section>
          <div className="space-y-2">
            {/* <BusinessSurvey
              open={activeAccordion === 0}
              onToggle={() => {
                activeAccordion == 0
                  ? setActiveAccordion(10)
                  : setActiveAccordion(0);
              }}
              onNext={() => setActiveAccordion(1)}
            /> */}
            <PersonalInfo
              open={activeAccordion === 1}
              onToggle={() => {
                activeAccordion == 1
                  ? setActiveAccordion(10)
                  : setActiveAccordion(1);
              }}
              onNext={() => setActiveAccordion(2)}
              permission={false}
            />

            <KycInfo
              open={activeAccordion === 2}
              onToggle={() => {
                activeAccordion == 2
                  ? setActiveAccordion(10)
                  : setActiveAccordion(2);
              }}
              onNext={() => setActiveAccordion(3)}
              permission={false}
            />

            <AddressInfo
              open={activeAccordion === 3}
              onToggle={() => {
                activeAccordion == 3
                  ? setActiveAccordion(10)
                  : setActiveAccordion(3);
              }}
              onNext={() => setActiveAccordion(4)}
              permission={false}
            />

            <MultipleBankInfo
              open={activeAccordion === 4}
              onToggle={() => {
                activeAccordion == 4
                  ? setActiveAccordion(10)
                  : setActiveAccordion(4);
              }}
              onNext={() => setActiveAccordion(5)}
              permission={false}
            />
            <GuarantorInfo
              open={activeAccordion === 5}
              onToggle={() => {
                activeAccordion == 5
                  ? setActiveAccordion(10)
                  : setActiveAccordion(5);
              }}
              onNext={() => setActiveAccordion(6)}
              permission={false}
            />
            {/* <LoanInfo
              open={activeAccordion === 6}
              onToggle={() => {
                activeAccordion == 6
                  ? setActiveAccordion(10)
                  : setActiveAccordion(6);
              }}
              onNext={() => setActiveAccordion(7)}
              permission={false}
            /> */}

            {/* <CoApplicant
            open={activeAccordion === 6}
            onToggle={() => {
              activeAccordion == 6
                ? setActiveAccordion(10)
                : setActiveAccordion(6);
            }}
            onNext={() => setActiveAccordion(7)
            permission={false}
          /> */}

            <EmploymentInfo
              open={activeAccordion === 6}
              onToggle={() => {
                activeAccordion == 6
                  ? setActiveAccordion(10)
                  : setActiveAccordion(6);
              }}
              onNext={() => setActiveAccordion(7)}
              permission={false}
            />

            <OtherDocsInfo
              open={activeAccordion === 7}
              onToggle={() => {
                activeAccordion == 7
                  ? setActiveAccordion(10)
                  : setActiveAccordion(7);
              }}
              onNext={() => setActiveAccordion(8)}
              permission={false}
              initialDocuments={initialDocuments}
            />
          </div>
        </section>
    </>
  );
};

export default LeadForm;
