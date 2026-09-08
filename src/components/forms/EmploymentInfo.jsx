import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiBuilding4Line } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import ErrorMsg from "../utils/ErrorMsg";
import { sector, employmentType } from "../../content/data";
import UploadInput from "../fields/UploadInput";

const EmploymentInfo = ({ onNext, open, onToggle, step }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      companyName: step === "prepd" ? "ABC Corporation" : "",
      sector: step === "prepd" ? "other" : "",
      employmentType: step === "prepd" ? "salaried" : "",
      employmentSince: step === "prepd" ? "2020-06-01" : "",
      monthlySalary: step === "prepd" ? "75000" : "",
      salaryDate: step === "prepd" ? "2026-08-05" : "",
      salarySlip: step === "prepd" ? null : null,
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
        title="Employment Information"
        subtitle="Employment and income details"
        icon={RiBuilding4Line}
        onToggle={onToggle}
        open={open}
      >
        <div className="grid max-md:grid-cols-2 grid-cols-4 gap-2">
          <div>
            <TextInput
              label="Company Name"
              name="companyName"
              placeholder="Enter company name"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={formik.touched.companyName && formik.errors.companyName}
            />
          </div>

          <div>
            <SelectInput
              label="Sector"
              name="sector"
              options={sector}
              placeholder="Select sector"
              value={formik.values.sector}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg error={formik.touched.sector && formik.errors.sector} />
          </div>

          <div>
            <SelectInput
              label="Employment Type"
              name="employmentType"
              options={employmentType}
              placeholder="Select employment type"
              value={formik.values.employmentType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={
                formik.touched.employmentType && formik.errors.employmentType
              }
            />
          </div>

          <div>
            <DateInput
              label="Employment Since"
              name="employmentSince"
              value={formik.values.employmentSince}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={
                formik.touched.employmentSince && formik.errors.employmentSince
              }
            />
          </div>

          <div>
            <TextInput
              label="Monthly Salary"
              name="monthlySalary"
              placeholder="Enter monthly salary"
              value={formik.values.monthlySalary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={
                formik.touched.monthlySalary && formik.errors.monthlySalary
              }
            />
          </div>

          <div>
            <DateInput
              label="Salary Date"
              name="salaryDate"
              value={formik.values.salaryDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={formik.touched.salaryDate && formik.errors.salaryDate}
            />
          </div>

          <div className="max-md:col-span-2">
            <UploadInput
              label="Salary Slip"
              name="salarySlip"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) =>
                formik.setFieldValue("salarySlip", e.target.files[0])
              }
              disabled={step && !isEditing}
            />
            <ErrorMsg
              error={formik.touched.salarySlip && formik.errors.salarySlip}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          {step === "prepd" && !isEditing &&
            <Button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              btnName={"Edit Loan"}
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

export default EmploymentInfo;