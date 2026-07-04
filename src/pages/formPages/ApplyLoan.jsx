import React, { useState } from "react";
import Accordion from "../../components/utils/Accordion";
import TextInput from "../../components/fields/TextInput";
import Button from "../../components/utils/Button";
import PersonalInfo from "../../components/forms/PersonalInfo";
import AddressInfo from "../../components/forms/AddressInfo ";
import KycInfo from "../../components/forms/KycInfo";
import BankInfo from "../../components/forms/BankInfo";
import GuarantorInfo from "../../components/forms/GuarantorInfo";

const ApplyLoan = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  return (
    <>
      <section>
        <div className="space-y-2">
          <PersonalInfo
            open={activeAccordion === 0}
            onToggle={() => {activeAccordion == 0 ? setActiveAccordion(10) : setActiveAccordion(0)}}
            onNext={() => setActiveAccordion(1)}
          />
          <AddressInfo
            open={activeAccordion === 1}
            onToggle={() => {activeAccordion == 1 ? setActiveAccordion(10) : setActiveAccordion(1)}}
            onNext={() => setActiveAccordion(2)}
          />
          <KycInfo
            open={activeAccordion === 2}
            onToggle={() => {activeAccordion == 2 ? setActiveAccordion(10) :setActiveAccordion(2)}}
            onNext={() => setActiveAccordion(3)}
          />
          <BankInfo
            open={activeAccordion === 3}
            onToggle={() => {activeAccordion == 3 ? setActiveAccordion(10) : setActiveAccordion(3)}}
            onNext={() => setActiveAccordion(4)}
          />
          <GuarantorInfo
            open={activeAccordion === 4}
            onToggle={() => {activeAccordion == 4 ? setActiveAccordion(10) : setActiveAccordion(4)}}
            onNext={() => setActiveAccordion(5)}
          />

          <div className="flex justify-end">
            <Button
              btnName="Submit Application"
              style="bg-blue-500 text-white cursor-pointer"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ApplyLoan;
