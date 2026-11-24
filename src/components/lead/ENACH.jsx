import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  RiUploadCloud2Line,
  RiFilePdf2Line,
  RiDeleteBinLine,
  RiBankLine,
  RiShieldCheckLine,
  RiRefreshLine,
} from "react-icons/ri";
import { SaveOtherDocuments } from "../../api/application";
import { useAuthData } from "../../context/authContext";
import { useLocation } from "react-router-dom";
import { convertFileToBase64, showValidationError } from "../utils/common";
import Loader from "../utils/Loader";
import { GrView } from "react-icons/gr";

const Enach = ({ data }) => {
  const [mode, setMode] = useState("MANUAL");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  const { authData } = useAuthData();
  const location = useLocation();
  const { customerId, applicationId } = location.state?.pera || {};

  const docs = data?.documents?.filter((doc) =>
    doc?.document_type?.toLowerCase()?.includes("nach"),
  )?.map((dc)=> ({...dc, ext:dc.document_path?.split(".")?.at(-1)}));

  const formik = useFormik({
    initialValues: {
      mandateFile: null,
    },
    validationSchema: Yup.object({
      mandateFile:
        mode === "MANUAL"
          ? Yup.mixed().required("Please upload mandate document")
          : Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const extension = values.mandateFile.name
          .split(".")
          .pop()
          .toLowerCase();
        const Base64_file = await convertFileToBase64(values.mandateFile);

        const req = {
          id: 0,
          customer_id: customerId,
          application_id: applicationId,
          document_type: `MANUAL_ENACH`,
          document_base64: Base64_file,
          file_extension: extension,
          is_active: true,
          creadted_by: authData.user_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
        };

        const response = await SaveOtherDocuments(req);

        if (response.status) {
          toast.success(
            response.message || "eNach Document uploaded successfully.",
          );
        } else {
          toast.info(response.message || "Unable to Upload eNach Document");
        }
      } catch (error) {
        showValidationError(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG and PNG files are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should not exceed 10 MB");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    formik.setFieldValue("mandateFile", file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    formik.setFieldValue("mandateFile", null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedFile(null);
    formik.resetForm();

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const selectedClass = "border-primary bg-primary/5 ring-1 ring-primary";
  const unselectedClass = "border-gray-200 hover:border-gray-400";

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">eNACH Mandate</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select eNACH registration method
        </p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleModeChange("MANUAL")}
          className={`rounded-xl border p-4 text-left transition cursor-pointer ${
            mode === "MANUAL" ? selectedClass : unselectedClass
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-3">
              <RiUploadCloud2Line className="text-xl text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Manual eNACH</h3>
              <p className="text-xs text-gray-500">
                Upload signed mandate document
              </p>
            </div>
          </div>

          {/* <div className="mt-3 text-xs font-medium text-primary">
            {mode === "MANUAL" ? "Selected" : "Select Manual"}
          </div> */}
        </button>

        <button
          type="button"
          //   onClick={() => handleModeChange("ACTUAL")}
          onClick={() =>
            toast.info("Bank eNach is not available at this time!")
          }
          className={`rounded-xl border p-4 text-left transition cursor-pointer ${
            mode === "ACTUAL" ? selectedClass : unselectedClass
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-3">
              <RiBankLine className="text-xl text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Bank eNACH</h3>
              <p className="text-xs text-gray-500">
                Online electronic mandate registration
              </p>
            </div>
          </div>

          {/* <div className="mt-3 text-xs font-medium text-primary">
            {mode === "ACTUAL" ? "Selected" : "Select Actual"}
          </div> */}
        </button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        {/* Manual Upload */}
        {mode === "MANUAL" && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <RiUploadCloud2Line className="text-xl text-primary" />

              <h3 className="font-semibold text-gray-800">
                Upload Mandate Document
              </h3>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-9 transition hover:border-primary hover:bg-primary/5"
              >
                <RiUploadCloud2Line className="mb-2 text-3xl text-primary" />

                <span className="text-sm font-semibold text-gray-700">
                  Click to upload mandate
                </span>

                <span className="mt-1 text-xs text-gray-500">
                  PDF, JPG, PNG (Maximum 10 MB)
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <RiFilePdf2Line className="shrink-0 text-2xl text-red-500" />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <RiDeleteBinLine className="text-lg" />
                </button>
              </div>
            )}

            {formik.touched.mandateFile && formik.errors.mandateFile && (
              <p className="mt-2 text-xs text-red-500">
                {formik.errors.mandateFile}
              </p>
            )}
          </div>
        )}

        {!selectedFile && docs?.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {docs.map((d, index) => (
              <div
                key={d.id || index}
                className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-2 transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <RiFilePdf2Line className="text-xl text-red-500" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {d.document_type}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">{d.ext == "pdf" ? "PDF Document" : "Image Document"}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      d.document_path || d.file_path,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  <GrView className="text-sm" />
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actual eNACH */}
        {mode === "ACTUAL" && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <RiShieldCheckLine className="mt-0.5 shrink-0 text-xl text-primary" />

              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  eNACH Registration
                </h4>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Customer will be redirected to the supported authorization
                  process to complete the electronic mandate registration.
                </p>

                <p className="mt-2 text-xs font-medium text-primary">
                  Bank integration is not connected yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              setSelectedFile(null);

              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RiRefreshLine />
            Reset
          </button>

          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 cursor-pointer"
          >
            {mode === "MANUAL" ? "Save Manual eNACH" : "Proceed with eNACH"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Enach;
