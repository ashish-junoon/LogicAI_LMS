import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  RiFileList3Line,
  RiAddLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

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
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const OtherDocsInformation = ({
  onNext,
  initialDocuments = [],
  permission = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      documents: [],
    },

    validationSchema: Yup.object({
      documents: Yup.array()
        .of(
          Yup.object({
            documentType: Yup.string().required(
              "Document type is required",
            ),
            documentFile: Yup.mixed().required(
              "Document is required",
            ),
          }),
        )
        .max(MAX_DOCUMENTS, `Maximum ${MAX_DOCUMENTS} documents allowed`),
    }),

    onSubmit: (values) => {
      console.log("New Documents:", values.documents);

      setIsEditing(false);
      onNext?.();
    },
  });

  const totalDocuments =
    initialDocuments.length + formik.values.documents.length;

  const canAddMore = totalDocuments < MAX_DOCUMENTS;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const handleAddDocument = () => {
    const last =
      formik.values.documents[
        formik.values.documents.length - 1
      ];

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
  };

  const handleDelete = (index) => {
    const updated = formik.values.documents.filter(
      (_, i) => i !== index,
    );

    formik.setFieldValue("documents", updated);
  };

  const handleFileChange = (e, index) => {
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

    formik.setFieldTouched(
      `documents.${index}.documentFile`,
      true,
      false,
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-primary/10 via-white to-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/10">
            <RiFileList3Line className="text-xl text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Other Documents
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Documents ({totalDocuments}/{MAX_DOCUMENTS})
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
                Edit
              </span>
            }
            style="!w-auto px-3 py-1.5 bg-white border border-primary text-primary hover:bg-primary hover:text-white text-xs font-medium rounded-lg"
          />
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <form onSubmit={formik.handleSubmit}>
        <div className="p-4">
          {/* ================= EXISTING DOCUMENTS ================= */}
          {initialDocuments.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {initialDocuments.map((doc, index) => (
                  <div
                    key={`existing-${index}`}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                      <RiFileList3Line
                        size={16}
                        className="text-primary"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {doc.documentType || "Document"}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        {doc.documentFile?.name ||
                          doc.fileName ||
                          "Uploaded document"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] text-green-700">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= NEW DOCUMENTS ================= */}
          {isEditing &&
            formik.values.documents.length > 0 && (
              <div
                className={`${
                  initialDocuments.length > 0 ? "mt-4" : ""
                } space-y-3`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  New Documents
                </p>

                {formik.values.documents.map(
                  (doc, index) => (
                    <div
                      key={`new-${index}`}
                      className="rounded-lg border border-primary/15 bg-primary/[0.02] p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">
                          New Document #{index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(index)
                          }
                          className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <RiDeleteBin6Line size={17} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-x-4 gap-y-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
                        {/* DOCUMENT TYPE */}
                        <div>
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
                              formik.touched.documents?.[index]
                                ?.documentType &&
                              formik.errors.documents?.[index]
                                ?.documentType
                            }
                          />
                        </div>

                        {/* DOCUMENT */}
                        <div className="col-span-2 max-lg:col-span-1">
                          <UploadInput
                            label="Upload Document"
                            name={`documents.${index}.documentFile`}
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) =>
                              handleFileChange(e, index)
                            }
                          />

                          {doc.documentFile && (
                            <p className="mt-1 truncate text-[10px] text-slate-500">
                              📎 {doc.documentFile.name}
                            </p>
                          )}

                          <ErrorMsg
                            error={
                              formik.touched.documents?.[index]
                                ?.documentFile &&
                              formik.errors.documents?.[index]
                                ?.documentFile
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

          {/* ================= ADD DOCUMENT ================= */}
          {isEditing && permission && canAddMore && (
            <button
              type="button"
              onClick={handleAddDocument}
              className="mt-4 flex items-center gap-2 rounded-lg border border-primary/20 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/5"
            >
              <RiAddLine size={17} />
              Add Another Document
            </button>
          )}

          {/* ================= ACTIONS ================= */}
          {permission && isEditing && (
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <Button
                type="button"
                onClick={handleCancel}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCloseLine size={15} />
                    Cancel
                  </span>
                }
                style="!w-auto px-3 py-1.5 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium rounded-lg"
              />

              <Button
                type="submit"
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCheckLine size={15} />
                    Save & Continue
                  </span>
                }
                style="!w-auto px-3 py-1.5 bg-primary text-white hover:bg-primary text-xs font-medium rounded-lg"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default OtherDocsInformation;