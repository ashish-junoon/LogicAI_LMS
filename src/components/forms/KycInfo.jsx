import React, { useState } from "react";
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

const KycInfo = ({ onNext, open, onToggle, step, permission }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [verified, setVerified] = useState({
    pan: false,
    aadhaar: false,
  });

  const formik = useFormik({
    initialValues: {
      panNumber: "QSNWS0000S",
      panFile: null,
      aadhaarNumber: "989854547171",
      aadhaarFront: null,
      aadhaarBack: null,
    },
    // validationSchema: Yup.object({
    //   panNumber: Yup.string()
    //     .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number")
    //     .required("PAN Number is required"),
    //   panFile: Yup.mixed().required("PAN Card is required"),
    //   aadhaarNumber: Yup.string()
    //     .matches(/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar Number")
    //     .required("Aadhaar Number is required"),
    //   aadhaarFront: Yup.mixed().required("Aadhaar Front is required"),
    //   aadhaarBack: Yup.mixed().required("Aadhaar Back is required"),
    // }),

    onSubmit: (values) => {
      console.log(values);
            onNext();
setIsEditing(false);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Accordion
          title="KYC Details"
          subtitle="Identity verification documents"
          icon={RiShieldUserLine}
          onToggle={onToggle}
          open={open}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Aadhaar Number */}
            <div>
              <div className="relative">
                <TextInput
                label={"Aadhaar Number"}
                  name="aadhaarNumber"
                  maxLength={12}
                  value={formik.values.aadhaarNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />
                {false &&
                  <button
                    type="button"
                    onClick={() =>
                      setVerified((prev) => ({ ...prev, aadhaar: true }))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md bg-green-300 px-2 py-1 text-xs font-medium text-green-900 hover:bg-green-300/80 cursor-pointer whitespace-nowrap"
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
                }
              </div>
              <ErrorMsg
                error={formik.touched.aadhaarNumber && formik.errors.aadhaarNumber}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
              <ErrorMsg
                error={formik.touched.aadhaarBack && formik.errors.aadhaarBack}
              />
            </div>


            {/* PAN Number */}
            <div>
              <div className="relative">
                <TextInput
                label={"PAN Number"}
                  name="panNumber"
                  maxLength={10}
                  value={formik.values.panNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />
                {false &&
                  <button
                    type="button"
                    onClick={() => setVerified((prev) => ({ ...prev, pan: true }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md bg-green-300 px-2 py-1 text-xs font-medium text-green-900 hover:bg-green-300/80 cursor-pointer whitespace-nowrap"
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
                }
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
                disabled={!isEditing}
              />
              <ErrorMsg error={formik.touched.panFile && formik.errors.panFile} />
            </div>
          </div>

          {permission && <div className="flex justify-end mt-4 gap-1">
            {!isEditing &&
              <Button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                btnName={isEditing ? "Save" : "Edit KYC"}
                style="bg-primary hover:bg-primary text-white w-full sm:w-auto text-sm"
              />
            }
            {isEditing &&
            <>
            <Button
              type="button"
              btnName="Cancel"
              style="bg-primary hover:bg-primary text-white text-sm"
            />
            <Button
              type="submit"
              btnName="Save & Continue"
              style="bg-primary hover:bg-primary text-white text-sm"
            />
            </>}
          </div>}
        </Accordion>
      </form>
    </>
  );
};

export default KycInfo;
