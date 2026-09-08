import { useFormik } from "formik";
import * as Yup from "yup";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import ErrorMsg from "../utils/ErrorMsg";
import { useState } from "react";

const LoanInfo = ({ onNext, open, onToggle, step }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      loanAmount: step === "prepd" ? "500000" : "",
      interestRate: step === "prepd" ? "10.5" : "",
      tenure: step === "prepd" ? "36" : "",
      processingFee: step === "prepd" ? "5000" : "",
      type: step === "prepd" ? "Business Loan" : "",
      //   emiAmount: step === "prepd" ? "16245" : "",
      //   repaymentMode: step === "prepd" ? "Monthly" : "",
      //   loanPurpose: step === "prepd" ? "Business Expansion" : "",
    },

    // validationSchema: Yup.object({
    //   ... (unchanged)
    // }),

    onSubmit: async (values) => {
      console.log(values);
            onNext();
setIsEditing(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Loan Information"
        subtitle="Loan configuration and repayment details"
        icon={RiMoneyDollarCircleLine}
        open={open}
        onToggle={onToggle}
      >
        <div className="grid max-md:grid-cols-2 grid-cols-4 gap-2">

          <div>
            <TextInput
              label="Loan Amount"
              name="loanAmount"
              type="number"
              placeholder="Enter loan amount"
              value={formik.values.loanAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={formik.touched.loanAmount && formik.errors.loanAmount}
            />
          </div>

          <div>
            <TextInput
              label="Interest Rate (%)"
              name="interestRate"
              type="number"
              placeholder="e.g. 12"
              value={formik.values.interestRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={formik.touched.interestRate && formik.errors.interestRate}
            />
          </div>

          <div>
            <TextInput
              label="Loan Tenure (Months)"
              name="tenure"
              type="number"
              placeholder="e.g. 24"
              value={formik.values.tenure}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={formik.touched.tenure && formik.errors.tenure}
            />
          </div>

          <div>
            <TextInput
              label="Processing Fee"
              name="processingFee"
              type="number"
              placeholder="Enter processing fee"
              value={formik.values.processingFee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={
                formik.touched.processingFee &&
                formik.errors.processingFee
              }
            />
          </div>

          {/* <div>
            <TextInput
              label="EMI Amount"
              name="emiAmount"
              type="number"
              placeholder="Monthly EMI"
              value={formik.values.emiAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMsg
              error={formik.touched.emiAmount && formik.errors.emiAmount}
            />
          </div> */}

          {/* <div>
            <SelectInput
              label="Repayment Mode"
              name="repaymentMode"
              placeholder="Select repayment mode"
              value={formik.values.repaymentMode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={[
                { label: "Monthly", value: "Monthly" },
                { label: "Quarterly", value: "Quarterly" },
                { label: "Half Yearly", value: "Half Yearly" },
                { label: "Yearly", value: "Yearly" },
              ]}
            />
            <ErrorMsg
              error={
                formik.touched.repaymentMode &&
                formik.errors.repaymentMode
              }
            />
          </div> */}

          <div>
            <SelectInput
              label="Loan Type"
              name="type"
              placeholder="Select repayment mode"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={[
                { label: "Bussiness Loan", value: "Bussiness" },
                { label: "Personal Personal", value: "Personal" },
              ]}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={
                formik.touched.type &&
                formik.errors.type
              }
            />
          </div>

          {/* <div className="col-span-full">
            <TextInput
              label="Loan Purpose"
              name="loanPurpose"
              placeholder="Enter loan purpose"
              value={formik.values.loanPurpose}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMsg
              error={
                formik.touched.loanPurpose &&
                formik.errors.loanPurpose
              }
            />
          </div> */}

        </div>

        <div className="flex justify-end mt-6 gap-3">
          {step === "prepd" && !isEditing &&
              <Button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                btnName={"Edit Loan Info"}
                style="bg-primary hover:bg-primary text-white w-full sm:w-auto"
              />
            }
            {(!step || isEditing) &&
              <Button
                type="submit"
                btnName="Save & Continue"
                style="bg-primary text-white hover:bg-primary cursor-pointer w-full sm:w-auto"
              />}
        </div>
      </Accordion>
    </form>
  );
};


export default LoanInfo;