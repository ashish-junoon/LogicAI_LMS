import React from "react";
import {
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiShieldUserLine,
} from "react-icons/ri";

import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

const KycInfo = ({ onNext, open, onToggle }) => {
  const [verified, setVerified] = React.useState({
    pan: false,
    aadhaar: false,
  });

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
            <label className="block mb-2 text-sm font-medium text-slate-700">
              PAN Number
            </label>

            <div className="relative">
              <TextInput
                name="panNumber"
                maxLength={10}
                value={formik.values.panNumber}
                onChange={(e)=> formik.setFieldValue("panNumber", e.target.value.toUpperCase())}
                onBlur={formik.handleBlur}
              />

              <button
                type="button"
                onClick={() => setVerified((prev) => ({ ...prev, pan: true }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md bg-green-300 px-2 py-1 text-xs font-medium text-green-900 hover:bg-green-300/80 cursor-pointer"
              >
                {verified.pan ? (
                  <>
                    <RiCheckboxCircleFill />
                    Verified
                  </>
                ) : (
                  <>
                    <RiErrorWarningLine />
                    Verify
                  </>
                )}
              </button>
            </div>

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
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Aadhaar Number
            </label>

            <div className="relative">
              <TextInput
                name="aadhaarNumber"
                maxLength={12}
                value={formik.values.aadhaarNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <button
                type="button"
                onClick={() =>
                  setVerified((prev) => ({ ...prev, aadhaar: true }))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md bg-green-300 px-2 py-1 text-xs font-medium text-green-900 hover:bg-green-300/80 cursor-pointer"
              >
                {verified.aadhaar ? (
                  <>
                    <RiCheckboxCircleFill />
                    Verified
                  </>
                ) : (
                  <>
                    <RiErrorWarningLine />
                    Verify
                  </>
                )}
              </button>
            </div>

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
