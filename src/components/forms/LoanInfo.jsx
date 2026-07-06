import { useFormik } from "formik";
import * as Yup from "yup";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import ErrorMsg from "../utils/ErrorMsg";

const LoanInfo = ({ onNext, open, onToggle }) => {
  const formik = useFormik({
    initialValues: {
      loanAmount: "",
      interestRate: "",
      tenure: "",
      processingFee: "",
    //   emiAmount: "",
    //   repaymentMode: "",
    //   loanPurpose: "",
    },

    validationSchema: Yup.object({
      loanAmount: Yup.number()
        .typeError("Loan amount must be a number")
        .positive("Loan amount must be greater than 0")
        .required("Loan amount is required"),

      interestRate: Yup.number()
        .typeError("Interest rate must be a number")
        .positive("Interest rate must be greater than 0")
        .required("Interest rate is required"),

      tenure: Yup.number()
        .typeError("Tenure must be a number")
        .positive("Tenure must be greater than 0")
        .required("Loan tenure is required"),

      processingFee: Yup.number()
        .typeError("Processing fee must be a number")
        .min(0, "Invalid processing fee")
        .required("Processing fee is required"),

    //   emiAmount: Yup.number()
    //     .typeError("EMI amount must be a number")
    //     .positive("EMI amount must be greater than 0")
    //     .required("EMI amount is required"),

    //   repaymentMode: Yup.string().required("Repayment mode is required"),

    //   loanPurpose: Yup.string().required("Loan purpose is required"),
    }),

    onSubmit: async (values) => {
      console.log(values);
      onNext();
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
        <div className="grid max-md:grid-cols-2 grid-cols-3 gap-4">

          <div>
            <TextInput
              label="Loan Amount"
              name="loanAmount"
              type="number"
              placeholder="Enter loan amount"
              value={formik.values.loanAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            btnName="Save & Continue"
            style="bg-blue-600 hover:bg-blue-700 text-white"
          />
        </div>
      </Accordion>
    </form>
  );
};

export default LoanInfo;