import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiTeamLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import { relationList } from "../../content/data";

const GuarantorInfo = ({ onNext, open, onToggle }) => {
  const formik = useFormik({
    initialValues: {
      guarantor1Name: "",
      guarantor1Mobile: "",
      guarantor1Relation: "",
      guarantor1Pan: "",
      guarantor1Aadhaar: "",
      guarantor1Add: "",

      nominee1Name: "",
      nominee1Mobile: "",
      nominee1Relation: "",
      nominee1Pan: "",
      nominee1Aadhaar: "",
      nominee1Add: "",
    },

    validationSchema: Yup.object({
      guarantor1Name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
        .required("Guarantor name is required"),

      guarantor1Mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid mobile number")
        .required("Mobile number is required"),

      guarantor1Relation: Yup.string().required("Relation is required"),

      guarantor1Pan: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number")
        .required("PAN Number is required"),

      guarantor1Aadhaar: Yup.string()
        .matches(/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar Number")
        .required("Aadhaar Number is required"),

      guarantor1Add: Yup.string()
        .required("Address is required")
        .min(3, "Address must be at least 3 characters"),

      nominee1Name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
        .required("Guarantor name is required"),

      nominee1Mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid mobile number")
        .required("Mobile number is required"),

      nominee1Relation: Yup.string().required("Relation is required"),

      nominee1Pan: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number")
        .required("PAN Number is required"),

      nominee1Aadhaar: Yup.string()
        .matches(/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar Number")
        .required("Aadhaar Number is required"),

      nominee1Add: Yup.string()
        .required("Address is required")
        .min(3, "Address must be at least 3 characters"),
    }),

    onSubmit: (values) => {
      console.log(values);
      onNext();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Guarantor/Nominee Details"
        subtitle="Provide guarantor information"
        icon={RiTeamLine}
        onToggle={onToggle}
        open={open}
      >
        {/* ================= Guarantor 1 ================= */}

        <div className="mb-6">
          <h4 className="text-base font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
            Guarantor
          </h4>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <TextInput
                label="Name"
                name="guarantor1Name"
                value={formik.values.guarantor1Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={
                  formik.touched.guarantor1Name && formik.errors.guarantor1Name
                }
              />
            </div>

            <div>
              <TextInput
                label="Mobile Number"
                name="guarantor1Mobile"
                value={formik.values.guarantor1Mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={
                  formik.touched.guarantor1Mobile &&
                  formik.errors.guarantor1Mobile
                }
              />
            </div>

            <div>
              <SelectInput
                label="Relation"
                name="guarantor1Relation"
                placeholder="Select Relation"
                value={formik.values.guarantor1Relation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={relationList}
              />
              <ErrorMsg
                error={
                  formik.touched.guarantor1Relation &&
                  formik.errors.guarantor1Relation
                }
              />
            </div>

            <div>
              <TextInput
                label="PAN Number"
                name="guarantor1Pan"
                value={formik.values.guarantor1Pan}
                // onChange={formik.handleChange}
                onChange={(e)=> formik.setFieldValue("guarantor1Pan", e.target.value.toUpperCase())}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={
                  formik.touched.guarantor1Pan && formik.errors.guarantor1Pan
                }
              />
            </div>

            <div>
              <TextInput
                label="Aadhaar Number"
                name="guarantor1Aadhaar"
                value={formik.values.guarantor1Aadhaar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={12}
              />
              <ErrorMsg
                error={
                  formik.touched.guarantor1Aadhaar &&
                  formik.errors.guarantor1Aadhaar
                }
              />
            </div>

            <div>
              <TextInput
                label="Address"
                name="guarantor1Add"
                value={formik.values.guarantor1Add}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={
                  formik.touched.guarantor1Add && formik.errors.guarantor1Add
                }
              />
            </div>
          </div>
        </div>

        {/* ================= Nominee 1 ================= */}

        <div>
          <h4 className="text-base font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
            Nominee
          </h4>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <TextInput
                label="Name"
                name="nominee1Name"
                value={formik.values.nominee1Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={
                  formik.touched.nominee1Name && formik.errors.nominee1Name
                }
              />
            </div>

            <div>
              <TextInput
                label="Mobile Number"
                name="nominee1Mobile"
                value={formik.values.nominee1Mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={
                  formik.touched.nominee1Mobile && formik.errors.nominee1Mobile
                }
              />
            </div>

            <div>
              <SelectInput
                label="Relation"
                name="nominee1Relation"
                placeholder="Select Relation"
                value={formik.values.nominee1Relation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={relationList}
              />
              <ErrorMsg
                error={
                  formik.touched.nominee1Relation &&
                  formik.errors.nominee1Relation
                }
              />
            </div>

            <div>
              <TextInput
                label="PAN Number"
                name="nominee1Pan"
                value={formik.values.nominee1Pan}
                // onChange={formik.handleChange}
                onChange={(e)=> formik.setFieldValue("nominee1Pan", e.target.value.toUpperCase())}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={formik.touched.nominee1Pan && formik.errors.nominee1Pan}
              />
            </div>

            <div>
              <TextInput
                label="Aadhaar Number"
                name="nominee1Aadhaar"
                value={formik.values.nominee1Aadhaar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={12}
              />
              <ErrorMsg
                error={
                  formik.touched.nominee1Aadhaar &&
                  formik.errors.nominee1Aadhaar
                }
              />
            </div>

            <div>
              <TextInput
                label="Address"
                name="nominee1Add"
                value={formik.values.nominee1Add}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg
                error={formik.touched.nominee1Add && formik.errors.nominee1Add}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            btnName="Save & Continue"
            style="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          />
        </div>
      </Accordion>
    </form>
  );
};

export default GuarantorInfo;
