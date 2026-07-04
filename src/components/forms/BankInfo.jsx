import React from "react";
import { RiBankLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectInput from "../fields/SelectInput";
import { bankList } from "../../content/data";

const BankInfo = ({ onNext, open, onToggle }) => {
  const formik = useFormik({
    initialValues: {
      bankName: "",
      ifscCode: "",
      accountNumber: "",
      accountHolderName: "",
      bankDocument: null,
    },

    validationSchema: Yup.object({
      bankName: Yup.string().required("Bank name is required"),

      ifscCode: Yup.string()
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code")
        .required("IFSC Code is required"),

      accountNumber: Yup.string()
        .matches(/^[0-9]{9,18}$/, "Invalid Account Number")
        .required("Account Number is required"),

      accountHolderName: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
        .required("Account Holder Name is required"),

      bankDocument: Yup.mixed().required("Bank document is required"),
    }),

    onSubmit: (values) => {
      console.log(values);
      onNext();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Bank Details"
        subtitle="Customer bank account information"
        icon={RiBankLine}
        onToggle={onToggle}
        open={open}
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Bank Name */}
          <div>
            <SelectInput
              label="Bank Name"
              name="bankName"
              options={bankList}
              placeholder="Select Bank"
              value={formik.values.bankName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={formik.touched.bankName && formik.errors.bankName}
            />
          </div>

          {/* IFSC Code */}
          <div>
            <TextInput
              label="IFSC Code"
              name="ifscCode"
              value={formik.values.ifscCode}
              onChange={(e) => {
                formik.setFieldValue("ifscCode", e.target.value.toUpperCase());
              }}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={formik.touched.ifscCode && formik.errors.ifscCode}
            />
          </div>

          {/* Account Number */}
          <div>
            <TextInput
              label="Account Number"
              name="accountNumber"
              value={formik.values.accountNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.accountNumber && formik.errors.accountNumber
              }
            />
          </div>

          {/* Account Holder Name */}
          <div>
            <TextInput
              label="Account Holder Name"
              name="accountHolderName"
              value={formik.values.accountHolderName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.accountHolderName &&
                formik.errors.accountHolderName
              }
            />
          </div>

          {/* Cancelled Cheque / Passbook */}
          <div>
            <UploadInput
              label="Upload Bank Statement / Passbook"
              name="bankDocument"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) =>
                formik.setFieldValue("bankDocument", e.target.files[0])
              }
            />

            <ErrorMsg
              error={formik.touched.bankDocument && formik.errors.bankDocument}
            />
          </div>
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

export default BankInfo;
