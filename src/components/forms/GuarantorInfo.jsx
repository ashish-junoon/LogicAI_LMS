import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiTeamLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import { relationList } from "../../content/data";

const GuarantorInfo = ({ onNext, open, onToggle, step }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      guarantor1Name: step === "prepd" ? "Amit Singh" : "",
      guarantor1Mobile: step === "prepd" ? "XXXXXX" : "",
      guarantor1Relation: step === "prepd" ? "Friend" : "",
      guarantor1Pan: step === "prepd" ? "XXXXXX" : "",
      guarantor1Aadhaar: step === "prepd" ? "XXXXXX" : "",
      guarantor1Add: step === "prepd" ? "456 Friends Colony, New Delhi" : "",

      coborrowerName: step === "prepd" ? "Priya Sharma" : "",
      coborrowerMobile: step === "prepd" ? "XXXXXX" : "",
      coborrowerRelation: step === "prepd" ? "Spouse" : "",
      coborrowerPan: step === "prepd" ? "XXXXXX" : "",
      coborrowerAadhaar: step === "prepd" ? "XXXXXX" : "",
      coborrowerAdd: step === "prepd" ? "789 Co-operator Housing Society, Mumbai" : "",
    },

    // validationSchema: Yup.object({
    //   ... (unchanged)
    // }),

    onSubmit: (values) => {
      console.log(values);
            onNext();
setIsEditing(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Co-Borrower/Guarantor Details"
        subtitle="Provide guarantor/co-borrower information"
        icon={RiTeamLine}
        onToggle={onToggle}
        open={open}
      >
        {/* ================= Co-Borrower ================= */}

        <div className="mb-6">
          <h4 className="text-base font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
            Co-Borrower
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2">
            <div>
              <TextInput
                label="Name"
                name="coborrowerName"
                value={formik.values.coborrowerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={step && !isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.coborrowerName && formik.errors.coborrowerName
                }
              />
            </div>

            <div>
              <TextInput
                label="Mobile Number"
                name="coborrowerMobile"
                value={formik.values.coborrowerMobile}
                onChange={step === "prepd" ? (e) => {
                  if (e.target.value.length < 6) return;
                  formik.setFieldValue("coborrowerMobile", e.target.value)
                } : formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={10}
              />
              <ErrorMsg
                error={
                  formik.touched.coborrowerMobile && formik.errors.coborrowerMobile
                }
              />
            </div>

            <div>
              <SelectInput
                label="Relation"
                name="coborrowerRelation"
                placeholder="Select Relation"
                value={formik.values.coborrowerRelation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={relationList}
                disabled={step && !isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.coborrowerRelation &&
                  formik.errors.coborrowerRelation
                }
              />
            </div>

            <div>
              <TextInput
                label="PAN Number"
                name="coborrowerPan"
                value={formik.values.coborrowerPan}
                onChange={step === "prepd" ? (e) => {
                  if (e.target.value.length < 5) return;
                  formik.setFieldValue("coborrowerPan", e.target.value.toUpperCase())
                } : (e) =>
                  formik.setFieldValue("coborrowerPan", e.target.value.toUpperCase())
                }
                onBlur={formik.handleBlur}
                maxLength={10}
              />
              <ErrorMsg
                error={formik.touched.coborrowerPan && formik.errors.coborrowerPan}
              />
            </div>

            <div>
              <TextInput
                label="Aadhaar Number"
                name="coborrowerAadhaar"
                value={formik.values.coborrowerAadhaar}
                onChange={step === "prepd" ? (e) => {
                  if (e.target.value.length < 6) return;
                  formik.setFieldValue("coborrowerAadhaar", e.target.value)
                } : formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={12}
              />
              <ErrorMsg
                error={
                  formik.touched.coborrowerAadhaar &&
                  formik.errors.coborrowerAadhaar
                }
              />
            </div>

            <div>
              <TextInput
                label="Address"
                name="coborrowerAdd"
                value={formik.values.coborrowerAdd}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={step && !isEditing}
              />
              <ErrorMsg
                error={formik.touched.coborrowerAdd && formik.errors.coborrowerAdd}
              />
            </div>
          </div>
        </div>

        {/* ================= Guarantor ================= */}

        <div className="">
          <h4 className="text-base font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
            Guarantor
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2">
            <div>
              <TextInput
                label="Name"
                name="guarantor1Name"
                value={formik.values.guarantor1Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={step && !isEditing}
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
                onChange={step === "prepd" ? (e) => {
                  if (e.target.value.length < 6) return;
                  formik.setFieldValue("guarantor1Mobile", e.target.value)
                } : formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={10}
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
                disabled={step && !isEditing}
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
                onChange={step === "prepd" ? (e) => {
                  if (e.target.value.length < 5) return;
                  formik.setFieldValue("guarantor1Pan", e.target.value.toUpperCase())
                } : (e) =>
                  formik.setFieldValue("guarantor1Pan", e.target.value.toUpperCase())
                }
                onBlur={formik.handleBlur}
                maxLength={10}
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
                onChange={step === "prepd" ? (e) => {
                  if (e.target.value.length < 6) return;
                  formik.setFieldValue("guarantor1Aadhaar", e.target.value)
                } : formik.handleChange}
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
                disabled={step && !isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.guarantor1Add && formik.errors.guarantor1Add
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          {step === "prepd" && !isEditing &&
              <Button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                btnName={isEditing ? "Save" : "Edit Gaurantor"}
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

export default GuarantorInfo;
