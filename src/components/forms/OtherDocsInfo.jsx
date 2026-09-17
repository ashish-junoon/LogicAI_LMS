import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiFileList3Line, RiAddLine, RiDeleteBin6Line } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import SelectInput from "../fields/SelectInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";

const documentTypes = [
  { label: "Driving License", value: "Driving License" },
  { label: "Voter ID", value: "Voter ID" },
  { label: "Passport", value: "Passport" },
  { label: "Electricity Bill", value: "Electricity Bill" },
  { label: "Water Bill", value: "Water Bill" },
  { label: "Gas Bill", value: "Gas Bill" },
  { label: "Salary Slip", value: "Salary Slip" },
  { label: "Income Proof", value: "Income Proof" },
  { label: "Property Papers", value: "Property Papers" },
  { label: "Other", value: "Other" },
];

const MAX_DOCUMENTS = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "application/pdf"];

const OtherDocsInfo = ({
  onNext,
  open,
  onToggle,
  initialDocuments = [],
  // permission,
}) => {

  const permission = true;

  const formik = useFormik({
    initialValues: {
      documents: [],
    },

    onSubmit: (values) => {
      // ONLY NEW DOCUMENTS
      console.log("New Documents:", values.documents);

      onNext();
    },
  });

  const totalDocuments =
    initialDocuments.length + formik.values.documents.length;

  const canAddMore = totalDocuments < MAX_DOCUMENTS;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Other Documents"
        subtitle={`Documents (${totalDocuments}/${MAX_DOCUMENTS})`}
        icon={RiFileList3Line}
        open={open}
        onToggle={onToggle}
      >
        <div className="space-y-3">
          {/* =========================
              EXISTING / SAMPLE DOCUMENTS - NO FORMIK
          ========================== */}
          {initialDocuments.length > 0 && (
            <div className="space-y-2">
              {/* <p className="text-xs font-semibold text-gray-500">
                Documents
              </p> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {initialDocuments.map((doc, index) => (
                  <div
                    key={`existing-${index}`}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300/70 rounded-lg bg-gray-50 cursor-pointer"
                  >
                    <div className="w-8 h-8 shrink-0 rounded-md border border-primary/30 bg-primary/10 flex items-center justify-center">
                      <RiFileList3Line size={16} className="text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {doc.documentType || "Document"}
                      </p>

                      <p className="text-[10px] text-gray-400 truncate">
                        {doc.documentFile?.name ||
                          doc.fileName ||
                          "Uploaded document"}
                      </p>
                    </div>

                    <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================
              NEW DOCUMENTS FORMIK ONLY
          ========================== */}

          {formik.values.documents.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                New Documents
              </p>

              {formik.values.documents.map((doc, index) => (
                <div
                  key={`new-${index}`}
                  className="p-3 border border-primary/20 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      New Document #{index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = formik.values.documents.filter(
                          (_, i) => i !== index,
                        );

                        formik.setFieldValue("documents", updated);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-5">
                      <SelectInput
                        label="Document Type"
                        name={`documents.${index}.documentType`}
                        options={documentTypes}
                        placeholder="Select Document Type"
                        value={doc.documentType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <ErrorMsg
                        error={
                          formik.touched.documents?.[index]?.documentType &&
                          formik.errors.documents?.[index]?.documentType
                        }
                      />
                    </div>

                    <div className="col-span-12 md:col-span-7">
                      <UploadInput
                        label="Upload Document"
                        name={`documents.${index}.documentFile`}
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          if (!SUPPORTED_FORMATS.includes(file.type)) {
                            alert("Please upload JPG, PNG, or PDF files only");
                            e.target.value = "";
                            return;
                          }

                          if (file.size > MAX_FILE_SIZE) {
                            alert("File size must be less than 5MB");
                            e.target.value = "";
                            return;
                          }

                          formik.setFieldValue(
                            `documents.${index}.documentFile`,
                            file,
                          );
                        }}
                      />

                      {doc.documentFile && (
                        <p className="mt-1 text-xs text-gray-500 truncate">
                          📎 {doc.documentFile.name}
                        </p>
                      )}

                      <ErrorMsg
                        error={
                          formik.touched.documents?.[index]?.documentFile &&
                          formik.errors.documents?.[index]?.documentFile
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADD DOCUMENT */}
          {permission && canAddMore && (
            <button
              type="button"
              onClick={() => {
                const last =
                  formik.values.documents[formik.values.documents.length - 1];

                // Check previous NEW document only
                if (last && (!last.documentType || !last.documentFile)) {
                  alert("Please complete the previous document first");
                  return;
                }

                formik.setFieldValue("documents", [
                  ...formik.values.documents,
                  {
                    documentType: "",
                    documentFile: null,
                  },
                ]);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary border border-primary/20 rounded-lg hover:bg-primary/5"
            >
              <RiAddLine size={18} />
              Add Another Document
            </button>
          )}

          {/* SAVE ONLY IF NEW DOC EXISTS */}
          {formik.values.documents.length > 0 && (
            <div className="flex justify-end pt-2 border-t">
              <Button
                type="submit"
                btnName="Save & Continue"
                style="bg-primary hover:bg-primary text-white text-sm"
              />
            </div>
          )}
        </div>
      </Accordion>
    </form>
  );
};

export default OtherDocsInfo;
