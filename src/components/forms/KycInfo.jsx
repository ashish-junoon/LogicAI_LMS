import React from "react";
import { RiShieldUserLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

const KycInfo = ({onNext, open, onToggle}) => {
  const formik = useFormik({
    initialValues: {
      panNumber: "",
      panFile: null,

      aadhaarNumber: "",
      aadhaarFront: null,
      aadhaarBack: null,
    },

    validationSchema: Yup.object({
      panNumber: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number")
        .required("PAN Number is required"),

      panFile: Yup.mixed().required("PAN Card is required"),

      aadhaarNumber: Yup.string()
        .matches(/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar Number")
        .required("Aadhaar Number is required"),

      aadhaarFront: Yup.mixed().required("Aadhaar Front is required"),

      aadhaarBack: Yup.mixed().required("Aadhaar Back is required"),
    }),

    onSubmit: (values) => {
      console.log(values);
      onNext();
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="KYC Details"
        subtitle="Identity verification documents"
        icon={RiShieldUserLine}
        onToggle={onToggle}
        open={open}
      >
        <div className="grid max-md:grid-cols-2 grid-cols-3 gap-4">
          {/* PAN Number */}
          <div>
            <TextInput
              label="PAN Number"
              name="panNumber"
              value={formik.values.panNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={formik.touched.panNumber && formik.errors.panNumber}
            />
          </div>

          {/* PAN Upload */}
          <div>
            <UploadInput
              label="Upload PAN Card"
              name="panFile"
              onChange={(e) =>
                formik.setFieldValue("panFile", e.target.files[0])
              }
            />

            <ErrorMsg error={formik.touched.panFile && formik.errors.panFile} />
          </div>

          <div></div>

          {/* Aadhaar Number */}
          <div>
            <TextInput
              label="Aadhaar Number"
              name="aadhaarNumber"
              value={formik.values.aadhaarNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.aadhaarNumber && formik.errors.aadhaarNumber
              }
            />
          </div>

          {/* Aadhaar Front */}
          <div>
            <UploadInput
              label="Upload Aadhaar Front"
              name="aadhaarFront"
              onChange={(e) =>
                formik.setFieldValue("aadhaarFront", e.target.files[0])
              }
            />

            <ErrorMsg
              error={formik.touched.aadhaarFront && formik.errors.aadhaarFront}
            />
          </div>

          {/* Aadhaar Back */}
          <div>
            <UploadInput
              label="Upload Aadhaar Back"
              name="aadhaarBack"
              onChange={(e) =>
                formik.setFieldValue("aadhaarBack", e.target.files[0])
              }
            />

            <ErrorMsg
              error={formik.touched.aadhaarBack && formik.errors.aadhaarBack}
            />
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

export default KycInfo;
