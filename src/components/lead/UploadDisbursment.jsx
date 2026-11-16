import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuthData } from "../../context/authContext";
import { useSearchParams } from "react-router-dom";
import { SaveOtherDocuments } from "../../api/application";
import { convertFileToBase64 } from "../utils/common";
import UpdateUtrModal from "../UpdateUtrModal";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const MIME_BY_EXT = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
};

// Detect MIME from base64 magic bytes (used when file_extension is missing).
const detectMimeFromBase64 = (b64) => {
  if (b64.startsWith("/9j/")) return "image/jpeg";
  if (b64.startsWith("iVBORw0KGgo")) return "image/png";
  if (b64.startsWith("JVBERi")) return "application/pdf";
  if (b64.startsWith("R0lGOD")) return "image/gif";
  if (b64.startsWith("UEsDB")) return "application/zip"; // docx/xlsx
  if (b64.startsWith("0M8R4")) return "application/octet-stream"; // legacy doc/xls
  return null;
};

const openBlobInNewTab = (blobUrl) => {
  // Anchor click is more reliable than window.open for blob URLs.
  const a = document.createElement("a");
  a.href = blobUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const openDocumentInNewTab = (doc) => {
  if (!doc) {
    toast.error("Document not available.");
    return;
  }

  // Debug — check DevTools console to see the actual shape of the object.
  // eslint-disable-next-line no-console
  console.log("[openDocumentInNewTab] document:", doc);

  /* ---------- 1) If the API already gives a URL, just use it ---------- */
  const directUrl =
    doc.document_url || doc.file_url || doc.url || doc.signed_url || null;

  if (typeof directUrl === "string" && /^https?:\/\//i.test(directUrl)) {
    window.open(directUrl, "_blank", "noopener,noreferrer");
    return;
  }

  /* ---------- 2) Otherwise expect base64 somewhere ---------- */
  let base64 =
    doc.document_base64 ||
    doc.base64 ||
    doc.file_content ||
    doc.base64_data ||
    doc.data ||
    null;

  if (!base64 || typeof base64 !== "string") {
    // If your list API trims base64, fetch it via GetDocumentById(doc.id)
    // and call openDocumentInNewTab(res.data) after.
    toast.error("Document content not available. Try refreshing.");
    return;
  }

  // Strip "data:...;base64," prefix and any whitespace/newlines.
  if (base64.includes(",")) base64 = base64.split(",").pop();
  base64 = base64.replace(/\s+/g, "");

  try {
    const ext = (doc.file_extension || doc.extension || "")
      .toString()
      .toLowerCase()
      .replace(/^\./, "");

    const mime =
      MIME_BY_EXT[ext] ||
      detectMimeFromBase64(base64) ||
      "application/octet-stream";

    const byteChars = atob(base64);
    const bytes = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      bytes[i] = byteChars.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mime });
    const blobUrl = URL.createObjectURL(blob);

    openBlobInNewTab(blobUrl);

    // Give the new tab time to read the blob before revoking.
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  } catch (err) {
    console.error("[openDocumentInNewTab] failed:", err, {
      ext: doc.file_extension,
      base64Head: base64.slice(0, 40),
      base64Len: base64.length,
    });
    toast.error("Failed to open document. The file may be corrupted.");
  }
};

/* -------------------------------------------------------------------------- */
/*  Document Action Row (View / Upload)                                       */
/* -------------------------------------------------------------------------- */

const DocumentActionRow = ({
  label,
  documentType,
  document,
  customerId,
  applicationId,
  userId,
  onUploaded,
}) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
  const maxFileSize = 10 * 1024 * 1024;

  const handleFile = async (file) => {
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      toast.error(
        `Only ${allowedExtensions.join(", ").toUpperCase()} files are allowed.`
      );
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("File size should not exceed 10 MB.");
      return;
    }

    if (!customerId || !applicationId) {
      toast.error("Customer ID and Application ID are required.");
      return;
    }

    try {
      setUploading(true);
      const base64 = await convertFileToBase64(file);

      const res = await SaveOtherDocuments({
        id: document?.id ?? 0,
        customer_id: customerId,
        application_id: applicationId,
        document_type: documentType,
        document_base64: base64,
        file_extension: ext,
        is_active: true,
        created_by: userId,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      });

      if (res?.status) {
        toast.success(res?.message || `${label} uploaded successfully.`);
        onUploaded?.();
      } else {
        toast.error(res?.message || `${label} upload failed.`);
      }
    } catch (err) {
      console.error(`${label} upload error:`, err);
      toast.error("Something went wrong while uploading.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">
          {document ? "Uploaded" : "Not uploaded yet"}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {document && (
          <button
            type="button"
            onClick={() => openDocumentInNewTab(document)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            View
          </button>
        )}

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : document ? "Replace" : "Upload"}
        </button>

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

const UploadDisbursment = ({ customerDetails, onDocumentUploaded }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [utrModalOpen, setUtrModalOpen] = useState(false);

  const { authData } = useAuthData();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer_id");
  const applicationId = searchParams.get("application_id");

  const allowedExtensions = ["xlsx", "xls", "csv"];
  const maxFileSize = 10 * 1024 * 1024;

  const documents = customerDetails?.documents ?? [];

  const disbursementFiles = documents.filter(
    (f) => f.document_type === "DISBURSEMENT_FILE"
  );
  const sanctionLetter = documents.find(
    (f) => f.document_type === "SANCTION_LETTER"
  );
  const agreementLetter = documents.find(
    (f) => f.document_type === "AGREEMENT_LETTER"
  );

  console.log({ disbursementFiles, sanctionLetter, agreementLetter });

  /* ---------- Existing disbursement upload logic ---------- */

  const validateFile = (file) => {
    if (!file) return false;
    if (file.size > maxFileSize) {
      toast.error("File size should not exceed 10 MB.");
      return false;
    }
    return true;
  };

  const handleFileChange = (file) => {
    if (validateFile(file)) setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a disbursement file.");
      return;
    }
    if (!customerId || !applicationId) {
      toast.error("Customer ID and Application ID are required.");
      return;
    }

    try {
      setLoading(true);
      const documentBase64 = await convertFileToBase64(selectedFile);
      const extension = selectedFile.name.split(".").pop().toLowerCase();

      const response = await SaveOtherDocuments({
        id: 0,
        customer_id: customerId,
        application_id: applicationId,
        document_type: "DISBURSEMENT_FILE",
        document_base64: documentBase64,
        file_extension: extension,
        is_active: true,
        created_by: authData?.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      });

      if (response?.status) {
        toast.success(
          response?.message || "Disbursement file uploaded successfully."
        );
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onDocumentUploaded?.();
      } else {
        toast.error(response?.message || "Disbursement upload failed.");
      }
    } catch (error) {
      console.error("Disbursement upload error:", error);
      toast.error("Something went wrong while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} Bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  /* ---------- Render ---------- */

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Upload Disbursement File
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Manually upload disbursement details for an individual customer.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setUtrModalOpen(true)}
            className="shrink-0 text-xs font-medium text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
          >
            Update UTR
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Disbursement file dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-primary bg-green-50"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <p className="text-sm font-medium text-gray-700">
              Click to browse or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Excel or CSV files (Maximum 10 MB)
            </p>
          </div>

          {/* Selected file preview */}
          {selectedFile && (
            <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs font-medium text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}

          {/* Disbursement upload button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload Disbursement"}
            </button>
          </div>

          {/* Sanction & Agreement documents */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Required Documents
            </p>

            <DocumentActionRow
              label="Sanction Letter"
              documentType="SANCTION_LETTER"
              document={sanctionLetter}
              customerId={customerId}
              applicationId={applicationId}
              userId={authData?.user_id}
              onUploaded={onDocumentUploaded}
            />

            <DocumentActionRow
              label="Agreement Letter"
              documentType="AGREEMENT_LETTER"
              document={agreementLetter}
              customerId={customerId}
              applicationId={applicationId}
              userId={authData?.user_id}
              onUploaded={onDocumentUploaded}
            />
          </div>
        </div>
      </div>

      <UpdateUtrModal
        isOpen={utrModalOpen}
        onClose={() => setUtrModalOpen(false)}
        customerId={customerId}
        applicationId={applicationId}
        onSuccess={onDocumentUploaded}
      />
    </>
  );
};

export default UploadDisbursment;