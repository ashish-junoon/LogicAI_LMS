import React from "react";
import ApplicationInfo from "../../components/common/ApplicationInfo";
import CreditSection from "../../components/lead/CreditSection";
import BankStatementAnalyser from "../../components/lead/BankStatementAnalyser ";
import OfferLoan from "../../components/lead/OfferLoan";
import CreditWrapper from "../../components/lead/CreditWrapper";

const CreditDetails = () => {
  return (
    <div>
      <ApplicationInfo>
        {/* <div>
          <div>
            <CreditSection />
            <BankStatementAnalyser />
          </div>

          <div>
          </div>

          <div className="grid grid-cols-4">
            <OfferLoan />
          </div>
        </div> */}

        <CreditWrapper />
      </ApplicationInfo>
    </div>
  );
};

export default CreditDetails;
