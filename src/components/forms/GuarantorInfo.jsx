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

const GuarantorInfo = ({onNext, open, onToggle}) => {
  const formik = useFormik({
    initialValues: {
      guarantor1Name: "",
      guarantor1Mobile: "",
      guarantor1Relation: "",

      nominee1Name: "",
      nominee1Mobile: "",
      nominee1Relation: "",
    },

    validationSchema: Yup.object({
      guarantor1Name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
        .required("Guarantor name is required"),

      guarantor1Mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid mobile number")
        .required("Mobile number is required"),

      guarantor1Relation: Yup.string().required("Relation is required"),

      nominee1Name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
        .required("Guarantor name is required"),

      nominee1Mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid mobile number")
        .required("Mobile number is required"),

      nominee1Relation: Yup.string().required("Relation is required"),
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
                  formik.touched.guarantor1Name &&
                  formik.errors.guarantor1Name
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
                  formik.touched.nominee1Name &&
                  formik.errors.nominee1Name
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
                  formik.touched.nominee1Mobile &&
                  formik.errors.nominee1Mobile
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