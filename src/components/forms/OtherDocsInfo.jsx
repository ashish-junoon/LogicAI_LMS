import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  RiFileList3Line,
  RiAddLine,
  RiDeleteBin6Line,
  RiUploadCloud2Line,
  RiFileTextLine,
} from "react-icons/ri";

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

const OtherDocsInfo = ({ onNext, open, onToggle, initialDocuments = [] }) => {
  const fileInputRefs = useRef({});

  const validationSchema = Yup.object({
    documents: Yup.array()
      .of(
        Yup.object({
          documentType: Yup.string().required("Document type is required"),
          documentFile: Yup.mixed()
            .required("Document is required")
            .test("fileSize", "File size must be less than 5MB", (value) => {
              if (!value) return true;
              return value.size <= MAX_FILE_SIZE;
            })
            .test("fileType", "Unsupported file format", (value) => {
              if (!value) return true;
              return SUPPORTED_FORMATS.includes(value.type);
            }),
        })
      )
      .min(1, "At least one document is required")
      .max(MAX_DOCUMENTS, `Maximum ${MAX_DOCUMENTS} documents allowed`),
  });

  const formik = useFormik({
    initialValues: {
      documents: initialDocuments.length > 0 ? initialDocuments : [
        {
          documentType: "",
          documentFile: null,
        },
      ],
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      values.documents.forEach((doc, index) => {
        formData.append(`documents[${index}][documentType]`, doc.documentType);
        if (doc.documentFile) {
          formData.append(`documents[${index}][documentFile]`, doc.documentFile);
        }
      });
      console.log("Form Data:", Object.fromEntries(formData));
      onNext();
    },
  });

  const canAddMore = formik.values.documents.length < MAX_DOCUMENTS;

  const addDocument = () => {
    if (!canAddMore) {
      alert(`Maximum ${MAX_DOCUMENTS} documents allowed`);
      return;
    }

    // Check if the last document is filled
    const lastDoc = formik.values.documents[formik.values.documents.length - 1];
    if (!lastDoc.documentType || !lastDoc.documentFile) {
      // Scroll to the last incomplete document
      const lastIndex = formik.values.documents.length - 1;
      const element = document.getElementById(`document-${lastIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("border-red-300", "bg-red-50");
        setTimeout(() => {
          element.classList.remove("border-red-300", "bg-red-50");
        }, 2000);
      }
      return;
    }

    formik.setFieldValue("documents", [
      ...formik.values.documents,
      {
        documentType: "",
        documentFile: null,
      },
    ]);

    // Focus on the new document's first field after a short delay
    setTimeout(() => {
      const newIndex = formik.values.documents.length;
      const element = document.querySelector(
        `[name="documents.${newIndex}.documentType"]`
      );
      if (element) element.focus();
    }, 100);
  };

  const removeDocument = (index) => {
    if (formik.values.documents.length <= 1) {
      alert("At least one document is required");
      return;
    }
    const updated = formik.values.documents.filter((_, i) => i !== index);
    formik.setFieldValue("documents", updated);
    
    // Reset touched state for removed document
    if (formik.touched.documents) {
      const newTouched = { ...formik.touched.documents };
      delete newTouched[index];
      formik.setTouched(newTouched);
    }
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        alert("Please upload JPG, PNG, or PDF files only");
        event.target.value = "";
        return;
      }
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be less than 5MB");
        event.target.value = "";
        return;
      }
      formik.setFieldValue(`documents.${index}.documentFile`, file);
    }
  };

  const getFileStatus = (doc) => {
    if (doc.documentFile) {
      if (doc.documentFile instanceof File) {
        return `📎 ${doc.documentFile.name} (${(doc.documentFile.size / 1024).toFixed(1)} KB)`;
      }
      return "📎 File uploaded";
    }
    return "No file selected";
  };

  console.log(formik.errors);
  

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Other Documents"
        subtitle={`Upload additional supporting documents (${formik.values.documents.length}/${MAX_DOCUMENTS})`}
        icon={RiFileList3Line}
        open={open}
        onToggle={onToggle}
      >
        <div className="space-y-2">
          {formik.values.documents.map((doc, index) => (
            <div
              key={index}
              id={`document-${index}`}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Document #{index + 1}
                  </span>
                  {doc.documentFile && doc.documentType && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  disabled={formik.values.documents.length <= 1}
                  title="Remove document"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>

              <div className="grid grid-cols-12 gap-4 items-start">
                {/* Document Type */}
                <div className="col-span-12 md:col-span-4">
                  <SelectInput
                    label="Document Type"
                    name={`documents.${index}.documentType`}
                    options={documentTypes}
                    placeholder="Select Document Type"
                    value={doc.documentType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full"
                  />
                  <ErrorMsg
                    error={
                      formik.touched.documents?.[index]?.documentType &&
                      formik.errors.documents?.[index]?.documentType
                    }
                  />
                </div>

                {/* Upload */}
                <div className="col-span-12 md:col-span-6">
                  <div className="relative">
                    <UploadInput
                      label="Upload Document"
                      name={`documents.${index}.documentFile`}
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(index, e)}
                      className="w-full"
                    />
                    {doc.documentFile && (
                      <div className="mt-1 text-xs text-gray-600 truncate">
                        {getFileStatus(doc)}
                      </div>
                    )}
                  </div>
                  <ErrorMsg
                    error={
                      formik.touched.documents?.[index]?.documentFile &&
                      formik.errors.documents?.[index]?.documentFile
                    }
                  />
                </div>

                {/* Status & Actions */}
                {/* <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector(
                        `input[name="documents.${index}.documentFile"]`
                      );
                      if (input) input.click();
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm"
                  >
                    <RiUploadCloud2Line size={16} />
                    Browse
                  </button>
                </div> */}
              </div>
            </div>
          ))}

          {/* Add Document Button */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={addDocument}
              disabled={!canAddMore}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                canAddMore
                  ? "text-blue-600 hover:bg-blue-50 border border-blue-200"
                  : "text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
            >
              <RiAddLine size={20} />
              <span className="text-sm font-medium">
                Add Another Document {!canAddMore && `(Max ${MAX_DOCUMENTS})`}
              </span>
            </button>
            <span className="text-xs text-gray-400">
              {formik.values.documents.length} of {MAX_DOCUMENTS} documents
            </span>
          </div>

          {/* Summary of filled documents */}
          {/* {formik.values.documents.length > 1 && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-xs font-medium text-blue-700 mb-2">
                Documents Summary
              </h4>
              <ul className="space-y-1">
                {formik.values.documents.map((doc, idx) => (
                  <li key={idx} className="text-xs text-blue-600 flex items-center gap-2">
                    <RiFileTextLine size={14} />
                    <span>
                      {doc.documentType || `Document ${idx + 1}`}
                      {doc.documentFile ? " ✓" : " ⚠️ Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          {/* Form Errors */}
          {formik.errors.documents && typeof formik.errors.documents === 'string' && (
            <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <ErrorMsg error={formik.errors.documents} />
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            btnName="Save & Continue"
            style="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg transition-colors"
            // disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </Accordion>
    </form>
  );
};

export default OtherDocsInfo;