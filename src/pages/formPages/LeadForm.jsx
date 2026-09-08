import React, { useEffect , useState } from "react";
import PersonalInfo from "../../components/forms/PersonalInfo";
import KycInfo from "../../components/forms/KycInfo";
import GuarantorInfo from "../../components/forms/GuarantorInfo";
import LoanInfo from "../../components/forms/LoanInfo";
import AadhaarVerification from "../../components/AadharVerification"
import ConfirmationModal from "../../components/utils/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import OtherDocsInfo from "../../components/forms/OtherDocsInfo";
import AddressInfo from "../../components/forms/AddressInfo";
import MultipleBankInfo from "../../components/forms/MultipleBankInfo";
import Icon from "../../components/utils/Icon";
import EmploymentInfo from "../../components/forms/EmploymentInfo";
// import BusinessSurvey from "../../components/forms/BusinessSurvey";

const LeadForm = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [isFormSubmitted, setisFormSubmitted] = useState(false);
  const [isFillByAadhaar, setisFillByAadhaar] = useState(false);

  const [selectedLoanProfile, setSelectedLoanProfile] = useState("");
  const [creditScoreData, setCreditScoreData] = useState(null);

  const navigate = useNavigate();

  // When loan profile is selected
  useEffect(() => {
    if (selectedLoanProfile) {
      console.log("Selected loan profile:", selectedLoanProfile);
      // Add logic for when profile is selected
    }
  }, [selectedLoanProfile]);

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
            />
            <KycInfo
              open={activeAccordion === 2}
              onToggle={() => {
                activeAccordion == 2
                  ? setActiveAccordion(10)
                  : setActiveAccordion(2);
              }}
              onNext={() => setActiveAccordion(3)}
            />
            <AddressInfo
              open={activeAccordion === 3}
              onToggle={() => {
                activeAccordion == 3
                  ? setActiveAccordion(10)
                  : setActiveAccordion(3);
              }}
              onNext={() => setActiveAccordion(4)}
            />

            <MultipleBankInfo
              open={activeAccordion === 4}
              onToggle={() => {
                activeAccordion == 4
                  ? setActiveAccordion(10)
                  : setActiveAccordion(4);
              }}
              onNext={() => setActiveAccordion(5)}
            />
            <GuarantorInfo
              open={activeAccordion === 5}
              onToggle={() => {
                activeAccordion == 5
                  ? setActiveAccordion(10)
                  : setActiveAccordion(5);
              }}
              onNext={() => setActiveAccordion(6)}
            />
            <LoanInfo
              open={activeAccordion === 6}
              onToggle={() => {
                activeAccordion == 6
                  ? setActiveAccordion(10)
                  : setActiveAccordion(6);
              }}
              onNext={() => setActiveAccordion(7)}
            />

            {/* <CoApplicant
            open={activeAccordion === 6}
            onToggle={() => {
              activeAccordion == 6
                ? setActiveAccordion(10)
                : setActiveAccordion(6);
            }}
            onNext={() => setActiveAccordion(7)}
          /> */}

            <EmploymentInfo
              open={activeAccordion === 7}
              onToggle={() => {
                activeAccordion == 7
                  ? setActiveAccordion(10)
                  : setActiveAccordion(7);
              }}
              onNext={() => setActiveAccordion(8)}
            />

            <OtherDocsInfo
              open={activeAccordion === 8}
              onToggle={() => {
                activeAccordion == 8
                  ? setActiveAccordion(10)
                  : setActiveAccordion(8);
              }}
              onNext={() => setActiveAccordion(9)}
            />
          </div>
        </section>

      {/* ======================== */}
      {/* Loan Confirmation Card  */}
      <ConfirmationModal
        isOpen={isFormSubmitted}
        onClose={() => navigate("/draft-applications")}
        title="Loan Application"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-5 bg-green-50 border-b border-green-100">
            <Icon name="RiCheckboxCircleFill" size={42} color="green" />

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Application Submitted Successfully
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Application has been submitted for verification.
              </p>
            </div>
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
};

export default LeadForm;
