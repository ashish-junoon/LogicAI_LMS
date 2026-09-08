import {
  RiDownloadLine,
  RiEyeLine,
  RiFileImageLine,
  RiFilePdfLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import Icon from "../utils/Icon";
import { useFormik } from "formik";
import Modal from "../utils/Modal";
import SelectInput from "../fields/SelectInput";
import { documentType } from "../../content/data";
import { useEffect, useRef, useState } from "react";
import Button from "../utils/Button";
import { toast } from "react-toastify";
import * as Yup from "yup"
import ErrorMsg from "../utils/ErrorMsg";

const DocumentsList = ({ permission }) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const documents = [
    {
      id: 1,
      name: "Identity Proof (PAN Card)",
      type: "PDF",
      size: "2.4 MB",
      uploadedOn: "2024-01-16",
      status: "Verified",
    },
    {
      id: 2,
      name: "Address Proof",
      type: "JPG",
      size: "1.8 MB",
      uploadedOn: "2024-01-16",
      status: "Verified",
    },
    {
      id: 3,
      name: "Income Proof",
      type: "PDF",
      size: "3.2 MB",
      uploadedOn: "2024-01-17",
      status: "Pending",
    },
    {
      id: 4,
      name: "Bank Statement",
      type: "PDF",
      size: "5.1 MB",
      uploadedOn: "2024-01-18",
      status: "Verified",
    },
  ];

  const getFileIcon = (type) => {
    if (type === "PDF")
      return <Icon name="RiFilePdfLine" color="#5050b8" size={20} />;
    if (type === "JPG" || type === "PNG")
      return <Icon name="RiFileImageLine" color="green" size={20} />;
    return <Icon name="RiFileTextLine" color="#5050b8" size={20} />;
  };

const handleFileChange = (e) => {
  const file = e.currentTarget.files?.[0];

  if (!file) return;

  // 5 MB validation
  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size should not exceed 5 MB");
    e.target.value = "";
    return;
  }

  uploadDocs.setFieldValue("document", file);
};

const handleRemoveFile = () => {
  uploadDocs.setFieldValue("document", null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

const handleModalClose = () => {
  setOpen(false);
  uploadDocs.resetForm();

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

const uploadDocs = useFormik({
  initialValues: {
    document: null,
    documentType: "",
  },

  validationSchema: Yup.object({
    documentType: Yup.string()
      .required("Document type is required"),

    document: Yup.mixed()
      .required("Please select a document")
      .test(
        "fileSize",
        "File size must be less than 5 MB",
        (file) => {
          if (!file) return false;
          return file.size <= 5 * 1024 * 1024;
        }
      ),
  }),

  onSubmit: async (values, { resetForm }) => {
    console.log("UPLOAD VALUES:", values);

    toast.success("Uploaded successfully");

    resetForm();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setOpen(false);
  },
});

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-800">
          Uploaded Documents
        </h4>
        {permission && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-xs bg-primary/90 text-white px-3 py-1.5 rounded-md hover:bg-primary transition-colors font-semibold cursor-pointer"
          >
            <Icon name={"RiUploadCloud2Line"} color="white" size={14} />
            Upload
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(doc.type)}
              <div>
                <p className="text-xs font-medium text-gray-800">{doc.name}</p>
                <p className="text-[10px] text-gray-500">
                  {doc.type} • {doc.size}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                doc.status === "Verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {doc.status}
              </span> */}
              <button className="p-1 text-gray-400 hover:text-primary/90 hover:bg-primary/5 rounded transition-colors">
                <Icon name="RiEyeLine" size={14} />
              </button>
              <button className="p-1 text-gray-400 hover:text-primary/90 hover:bg-primary/5 rounded transition-colors">
                <Icon name={"RiDownloadLine"} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

<Modal
  isOpen={open}
  onClose={handleModalClose}
  heading="Upload Documents"
  title="Add Documents"
>
        <form onSubmit={uploadDocs.handleSubmit}>
          {/* ================= MAIN CONTENT ================= */}
          <div className="px-5 py-3">
            {/* ================= FORM ================= */}
            <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
              {/* ================= DOCUMENT TYPE ================= */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3E3E75]/10">
                    <Icon
                      name="IoDocumentTextOutline"
                      color="#3E3E75"
                      size={16}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Document Type
                    </p>

                    <p className="text-[9px] text-gray-400">
                      Choose document category
                    </p>
                  </div>
                </div>

                <SelectInput
                  label="Document Type"
                  icon="IoDocumentTextOutline"
                  name="documentType"
                  placeholder="Select Document Type"
                  options={documentType}
                  onChange={(e) => {
  uploadDocs.setFieldValue("documentType", e.target.value);
  uploadDocs.setFieldValue("document", null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}}
                  onBlur={uploadDocs.handleBlur}
                  value={uploadDocs.values.documentType}
                />

                {uploadDocs.touched.documentType &&
                  uploadDocs.errors.documentType && (
                    <ErrorMsg error={uploadDocs.errors.documentType} />
                  )}
              </div>

              {/* ================= FILE UPLOAD ================= */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3E3E75]/10">
                    <Icon name="RiUploadCloud2Line" color="#3E3E75" size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Upload File
                    </p>

                    <p className="text-[9px] text-gray-400">
                      PDF, image or Excel document
                    </p>
                  </div>
                </div>

                {/* ================= NO FILE ================= */}
                {!uploadDocs.values.document && (
                  <label
                    className={`group flex min-h-[125px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 ${
                      uploadDocs.values.documentType
                        ? "cursor-pointer border-gray-300 bg-gray-50/50 hover:border-[#3E3E75] hover:bg-[#3E3E75]/5"
                        : "cursor-not-allowed border-gray-200 bg-gray-100"
                    }`}
                  >
                    <input
                      disabled={!uploadDocs.values.documentType}
                      type="file"
                      name="document"
                      accept={
                        uploadDocs.values.documentType === "VideoKyc"
                          ? ".mp4,.mov"
                          : ".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
                      }
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />

                    <div
                      className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        uploadDocs.values.documentType
                          ? "bg-[#3E3E75]/10 group-hover:scale-105"
                          : "bg-gray-200"
                      }`}
                    >
                      <Icon
                        name="RiUploadCloud2Line"
                        color={
                          uploadDocs.values.documentType ? "#3E3E75" : "#9CA3AF"
                        }
                        size={20}
                      />
                    </div>

                    <p
                      className={`text-[11px] font-semibold ${
                        uploadDocs.values.documentType
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                    >
                      {uploadDocs.values.documentType
                        ? "Click to upload document"
                        : "Select document type first"}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      PDF, JPG, JPEG, PNG, XLS, XLSX
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      Maximum size: 5 MB
                    </p>
                  </label>
                )}

                {/* ================= FILE SELECTED ================= */}
                {uploadDocs.values.document && (
                  <div className="rounded-lg border border-[#3E3E75]/15 bg-[#3E3E75]/[0.02] p-3">
                    <div className="flex items-center gap-2.5">
                      {/* File Icon */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-100 bg-white">
                        {uploadDocs.values.document.type ===
                        "application/pdf" ? (
                          <Icon
                            name="RiFilePdfLine"
                            color="#DC2626"
                            size={19}
                          />
                        ) : [
                            "application/vnd.ms-excel",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          ].includes(uploadDocs.values.document.type) ? (
                          <Icon
                            name="RiFileExcel2Line"
                            color="#16A34A"
                            size={19}
                          />
                        ) : (
                          <Icon
                            name="RiFileImageLine"
                            color="#3E3E75"
                            size={19}
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-gray-800">
                          {uploadDocs.values.document.name}
                        </p>

                        <p className="mt-0.5 text-[9px] text-gray-400">
                          {(
                            uploadDocs.values.document.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>

                        <div className="mt-1 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                          <span className="text-[9px] font-medium text-green-600">
                            Ready for upload
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="Remove file"
                      >
                        <Icon name="RiCloseLine" size={15} />
                      </button>
                    </div>

                    {/* Preview */}
                    {/* {croppedImagePreview && (
                      <div className="mt-3 border-t border-gray-100 pt-2.5">
                        <p className="mb-1.5 text-[9px] font-medium text-green-600">
                          ✓ Image cropped successfully
                        </p>

                        <img
                          src={croppedImagePreview}
                          alt="Cropped preview"
                          className="h-16 w-24 rounded-md border border-gray-200 object-cover"
                        />
                      </div>
                    )} */}
                  </div>
                )}

                {uploadDocs.touched.document && uploadDocs.errors.document && (
                  <div className="mt-1.5">
                    <ErrorMsg error={uploadDocs.errors.document} />
                  </div>
                )}
              </div>
            </div>

            {/* ================= INFO ================= */}
            <div className="mt-3 flex items-center gap-2 rounded-md border border-[#3E3E75]/10 bg-[#3E3E75]/5 px-3 py-2">
              <Icon name="RiInformationLine" color="#3E3E75" size={13} />

              <p className="text-[9px] leading-3.5 text-gray-500">
                Make sure the document is clear and readable. Maximum allowed
                file size is 5 MB.
              </p>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50/60 px-5 py-2.5">
            <Button
              btnName="Cancel"
              btnIcon="IoCloseCircle"
              type="button"
              onClick={handleModalClose}
              icolor="#5050b8"
              style="
          min-w-[85px]
          text-xs
          font-medium
          py-1.5
          px-3
          bg-white
          border
          border-gray-300
          text-gray-600
          hover:bg-gray-100
        "
            />

            <Button
              btnName="Upload"
              btnIcon="MdUpload"
              type="submit"
              disabled={uploadDocs.values.document ||
uploadDocs.values.documentType}
              style={`min-w-[95px] text-xs font-medium py-1.5 px-4 rounded-md transition-all ${
  uploadDocs.values.document &&
  uploadDocs.values.documentType
    ? "bg-primary text-white hover:bg-[#32325F]"
    : "bg-gray-200 text-gray-400 cursor-not-allowed"
}`}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DocumentsList;
