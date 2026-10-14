import { useState } from "react";
import { toast } from "react-toastify";
import {
  RiCheckboxCircleFill,
  RiEditLine,
  RiErrorWarningLine,
  RiShieldUserLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";

import { useFormik } from "formik";
import DownloadDoc from "../fields/DownloadDoc";
import { SaveApplicantDetails } from "../../api/application";

const KycInformation = ({
  onNext,
  permission,
  personalKyc,
  addressDetails,
  documents = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [verified, setVerified] = useState({
    pan: false,
    aadhaar: false,
  });
  const getDocumentUrl = (pattern) =>
    documents.find((document) => pattern.test(document?.document_type || ""))
      ?.document_path || "";
  const aadhaarFrontUrl = getDocumentUrl(/aadhaar.*front|front.*aadhaar/i);
  const aadhaarBackUrl = getDocumentUrl(/aadhaar.*back|back.*aadhaar/i);
  const panDocumentUrl = getDocumentUrl(/\bpan\b/i);

  const formik = useFormik({
    initialValues: {
      panNumber: personalKyc?.pan_number || "",
      panFile: null,
      aadhaarNumber: personalKyc?.uid_number || "",
      aadhaarFront: null,
      aadhaarBack: null,
    },

    enableReinitialize: true,

    // validationSchema: Yup.object({
    //   panNumber: Yup.string()
    //     .matches(
    //       /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    //       "Invalid PAN Number"
    //     )
    //     .required("PAN Number is required"),

    //   panFile: Yup.mixed()
    //     .required("PAN Card is required"),

    //   aadhaarNumber: Yup.string()
    //     .matches(
    //       /^[2-9]{1}[0-9]{11}$/,
    //       "Invalid Aadhaar Number"
    //     )
    //     .required("Aadhaar Number is required"),

    //   aadhaarFront: Yup.mixed()
    //     .required("Aadhaar Front is required"),

    //   aadhaarBack: Yup.mixed()
    //     .required("Aadhaar Back is required"),
    // }),

    onSubmit: async (values) => {
      const customerId = personalKyc?.customer_id || addressDetails?.customer_id;
      const applicationId =
        personalKyc?.application_id || addressDetails?.application_id;

      if (!customerId || !applicationId) {
        toast.error("Customer and application IDs are required to save applicant details.");
        return;
      }

      const updatedBy =
        localStorage.getItem("username") ||
        localStorage.getItem("userName") ||
        localStorage.getItem("email") ||
        "admin";
      const request = {
        customer_id: customerId,
        application_id: applicationId,
        full_name: personalKyc?.full_name || "",
        father_name: personalKyc?.father_name || "",
        dob: personalKyc?.dob || "",
        gender: personalKyc?.gender || "",
        marital_status: personalKyc?.marital_status || "",
        alternate_mobile: personalKyc?.alternate_mobile || "",
        email_id: personalKyc?.email_id || "",
        primary_document_type: personalKyc?.primary_document_type || "",
        uid_number: values.aadhaarNumber.trim(),
        pan_number: values.panNumber.trim(),
        permanent_address: addressDetails?.permanent_address || "",
        permanent_city: addressDetails?.permanent_city || "",
        permanent_state: addressDetails?.permanent_state || "",
        permanent_pin_code: addressDetails?.permanent_pin_code || "",
        current_address: addressDetails?.current_address || "",
        current_city: addressDetails?.current_city || "",
        current_state: addressDetails?.current_state || "",
        current_pin_code: addressDetails?.current_pin_code || "",
        created_by: personalKyc?.created_by || updatedBy,
        updated_by: updatedBy,
      };

      try {
        const response = await SaveApplicantDetails(request);

        if (!response?.status) {
          toast.error(response?.message || "Unable to save applicant details.");
          return;
        }

        formik.resetForm({ values });
        setIsEditing(false);
        toast.success(response?.message || "Applicant details saved successfully.");
        onNext?.();
      } catch (error) {
        console.error("Error saving applicant KYC details:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message ||
            "Something went wrong while saving applicant details.",
        );
      }
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();

    setIsEditing(false);
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-slate-200
          bg-gradient-to-r
          from-primary/10
          via-white
          to-white
          px-4
          py-3
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-primary/10
              bg-primary/10
            "
          >
            <RiShieldUserLine className="text-xl text-primary" />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              KYC Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Identity verification documents
            </p>
          </div>
        </div>

        {/* EDIT */}
        {permission && !isEditing && (
          <Button
            type="button"
            onClick={handleEdit}
            btnName={
              <span className="flex items-center gap-1.5">
                <RiEditLine size={15} />
                Edit KYC
              </span>
            }
            style="
              !w-auto
              px-3
              py-1.5
              bg-white
              border
              border-primary
              text-primary
              hover:bg-primary
              hover:text-white
              text-xs
              font-medium
              rounded-lg
            "
          />
        )}
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}
      <form onSubmit={formik.handleSubmit}>
        <div className="p-4">
          <div
            className="
              grid
              grid-cols-3
              gap-x-4
              gap-y-4
              max-lg:grid-cols-2
              max-sm:grid-cols-1
            "
          >
            {/* =================================================
                AADHAAR NUMBER
            ================================================== */}

              <div>
                <div className="relative">
                  <TextInput
                    label="Aadhaar Number"
                    name="aadhaarNumber"
                    maxLength={12}
                    value={formik.values.aadhaarNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                  />


                  {/* Verification button */}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        setVerified((prev) => ({
                          ...prev,
                          aadhaar: true,
                        }))
                      }
                      className="
                      absolute
                      right-1
                      top-[25px]
                      flex
                      items-center
                      gap-1
                      rounded-md
                      bg-green-100
                      px-2
                      py-1.5
                      text-[11px]
                      font-medium
                      text-green-700
                      transition
                      hover:bg-green-100
                      cursor-pointer
                    "
                    >
                      {verified.aadhaar ? (
                        <>
                          <RiCheckboxCircleFill size={14} />
                          Verified
                        </>
                      ) : (
                        <>
                          <RiErrorWarningLine size={14} />
                          Verify
                        </>
                      )}
                    </button>
                  )}

                  {/* Read-only verified badge */}
                  {!isEditing && formik.values.aadhaarNumber && (
                    <div
                      className="
                      absolute
                      right-2
                      top-[30px]
                      flex
                      items-center
                      gap-1
                      rounded-md
                      bg-green-50
                      px-2
                      py-1
                      text-[11px]
                      font-medium
                      text-green-700
                    "
                    >
                      <RiCheckboxCircleFill size={14} />
                      Provided
                    </div>
                  )}
                </div>

                <ErrorMsg
                  error={
                    formik.touched.aadhaarNumber && formik.errors.aadhaarNumber
                  }
                />
              </div>

            {/* =================================================
                AADHAAR FRONT
            ================================================== */}
            {isEditing ? (
              <div>
                <UploadInput
                  label="Aadhaar Front"
                  name="aadhaarFront"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "aadhaarFront",
                      e.target.files?.[0] || null,
                    )
                  }
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.aadhaarFront && formik.errors.aadhaarFront
                  }
                />
              </div>
            ) : (
              <div>
                {aadhaarFrontUrl ? (
                  <DownloadDoc fileUrl={aadhaarFrontUrl} label="Aadhaar Front" />
                ) : (
                  <p className="text-xs text-gray-500">No Aadhaar front document uploaded</p>
                )}
              </div>
            )}

            {/* =================================================
                AADHAAR BACK
            ================================================== */}
            {isEditing ? (
              <div>
                <UploadInput
                  label="Aadhaar Back"
                  name="aadhaarBack"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "aadhaarBack",
                      e.target.files?.[0] || null,
                    )
                  }
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.aadhaarBack && formik.errors.aadhaarBack
                  }
                />
              </div>
            ) : (
              <div>
                {aadhaarBackUrl ? (
                  <DownloadDoc fileUrl={aadhaarBackUrl} label="Aadhaar Back" />
                ) : (
                  <p className="text-xs text-gray-500">No Aadhaar back document uploaded</p>
                )}
              </div>
            )}

            {/* =================================================
                PAN NUMBER
            ================================================== */}
            <div>
              <div className="relative">
                <TextInput
                  label="PAN Number"
                  name="panNumber"
                  maxLength={10}
                  value={formik.values.panNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />

                {/* Verification button */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      setVerified((prev) => ({
                        ...prev,
                        pan: true,
                      }))
                    }
                    className="
                      absolute
                      right-1
                      top-[24px]
                      flex
                      items-center
                      gap-1
                      rounded-md
                      bg-green-100
                      px-2
                      py-1.5
                      text-[11px]
                      font-medium
                      text-green-700
                      transition
                      hover:bg-green-100
                      cursor-pointer
                    "
                  >
                    {verified.pan ? (
                      <>
                        <RiCheckboxCircleFill size={14} />
                        Verified
                      </>
                    ) : (
                      <>
                        <RiErrorWarningLine size={14} />
                        Verify
                      </>
                    )}
                  </button>
                )}

                {/* Read-only verified badge */}
                {!isEditing && verified.pan && (
                  <div
                    className="
                      absolute
                      right-1
                      top-[24px]
                      flex
                      items-center
                      gap-1
                      rounded-md
                      bg-green-100
                      px-2
                      py-1.5
                      text-[11px]
                      font-medium
                      text-green-700
                    "
                  >
                    <RiCheckboxCircleFill size={14} />
                    Verified
                  </div>
                )}
              </div>

              <ErrorMsg
                error={formik.touched.panNumber && formik.errors.panNumber}
              />
            </div>

            {/* =================================================
                PAN CARD
            ================================================== */}
            {isEditing ? (
              <div>
                <UploadInput
                  label="PAN Card"
                  name="panFile"
                  onChange={(e) =>
                    formik.setFieldValue("panFile", e.target.files?.[0] || null)
                  }
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={formik.touched.panFile && formik.errors.panFile}
                />
              </div>
            ) : (
              <div>
                {panDocumentUrl ? (
                  <DownloadDoc fileUrl={panDocumentUrl} label="PAN Card" />
                ) : (
                  <p className="text-xs text-gray-500">No PAN document uploaded</p>
                )}
              </div>
            )}
          </div>

          {/* =====================================================
              ACTIONS
          ====================================================== */}
          {permission && isEditing && (
            <div
              className="
                mt-5
                flex
                items-center
                justify-end
                gap-2
                border-t
                border-slate-100
                pt-4
              "
            >
              <Button
                type="button"
                onClick={handleCancel}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCloseLine size={16} />
                    Cancel
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-white
                  border
                  border-slate-300
                  text-slate-600
                  hover:bg-slate-50
                  text-xs
                  font-medium
                  rounded-lg
                "
              />

              <Button
                type="submit"
                disabled={formik.isSubmitting}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCheckLine size={16} />
                    Save & Continue
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-primary
                  hover:bg-primary
                  text-white
                  text-xs
                  font-medium
                  rounded-lg
                "
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default KycInformation;
