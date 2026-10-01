import React, { useRef, useState } from "react";
import Icon from "../utils/Icon";

const DocumentSignature = ({
  documents = [
    {
      id: 1,
      name: "Loan Agreement",
      type: "PDF",
      status: "pending",
      documentUrl: "",
      signedDocumentUrl: "",
      signedBy: "",
      signedOn: "",
    },
    {
      id: 2,
      name: "Sanction Letter",
      type: "PDF",
      status: "link_sent",
      documentUrl: "",
      signedDocumentUrl: "",
      signedBy: "",
      signedOn: "",
    },
    {
      id: 3,
      name: "KFS / MITC",
      type: "PDF",
      status: "completed",
      documentUrl: "",
      signedDocumentUrl: "",
      signedBy: "Rahul Sharma",
      signedOn: "2026-09-28T10:30:00",
    },
  ],

  // Online E-Sign
  onSendESign = (document) => {},

  // Manual Upload Submit
  onUpload = (document, file) => {},

  // View signed document
  onViewSigned = (document) => {},

  // Download document / signed document
  onDownload = (document) => {},

  className = "",
}) => {
  const fileRefs = useRef({});

  // Stores selected files before Submit
  const [selectedFiles, setSelectedFiles] = useState({});

  const statusConfig = {
    pending: {
      label: "Pending",
      dot: "bg-amber-500",
      badge: "bg-amber-50 text-amber-600",
    },

    link_sent: {
      label: "Link Sent",
      dot: "bg-blue-500",
      badge: "bg-blue-50 text-blue-600",
    },

    completed: {
      label: "Signed",
      dot: "bg-emerald-500",
      badge: "bg-emerald-50 text-emerald-600",
    },

    failed: {
      label: "Failed",
      dot: "bg-red-500",
      badge: "bg-red-50 text-red-600",
    },

    expired: {
      label: "Expired",
      dot: "bg-orange-500",
      badge: "bg-orange-50 text-orange-600",
    },
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------------------
  // FILE SELECT
  // ---------------------------------------
  const handleFileChange = (event, document) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 10 MB validation
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should not exceed 10 MB");

      event.target.value = "";
      return;
    }

    // File type validation
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG, JPEG and PNG files are allowed");

      event.target.value = "";
      return;
    }

    // Store file locally.
    // API will NOT be called here.
    setSelectedFiles((prev) => ({
      ...prev,
      [document.id]: file,
    }));

    // Reset input so same file can be selected again
    event.target.value = "";
  };

  // ---------------------------------------
  // REMOVE SELECTED FILE
  // ---------------------------------------
  const handleRemoveFile = (documentId) => {
    setSelectedFiles((prev) => {
      const updated = { ...prev };

      delete updated[documentId];

      return updated;
    });
  };

  // ---------------------------------------
  // SUBMIT MANUAL SIGNED DOCUMENT
  // ---------------------------------------
  const handleSubmitUpload = (document) => {
    const file = selectedFiles[document.id];

    if (!file) {
      alert("Please select signed document first");
      return;
    }

    // API callback
    onUpload(document, file);

    // Remove selected file after submit
    setSelectedFiles((prev) => {
      const updated = { ...prev };

      delete updated[document.id];

      return updated;
    });
  };

  // ---------------------------------------
  // FORMAT FILE SIZE
  // ---------------------------------------
  const formatFileSize = (bytes) => {
    if (!bytes) return "";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-white">
        <div className="flex items-center gap-2">
          {/* <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon
              name="RiFileSignatureLine"
              size={16}
              color="5050b8"
            />
          </div> */}

          <div>
            <h3 className="text-xs font-semibold text-slate-800">
              E-Sign Documents
            </h3>

            <p className="text-[10px] text-slate-400">
              Online e-sign or manual signed document upload
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-400">
          {documents.length} Documents
        </span>
      </div>

      {/* =====================================================
          DOCUMENT LIST
      ====================================================== */}
      <div className="divide-y divide-slate-100">
        {documents.map((document) => {
          const config =
            statusConfig[document.status] || statusConfig.pending;

          const selectedFile = selectedFiles[document.id];

          return (
            <div
              key={document.id}
              className="px-4 py-2.5 hover:bg-slate-50/70 transition"
            >
              {/* =================================================
                  DOCUMENT ROW
              ================================================== */}
              <div className="flex items-center justify-between gap-3">
                {/* Document Info */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* PDF Icon */}
                  <div className="w-8 h-8 flex-shrink-0 rounded-md bg-red-50 flex items-center justify-center">
                    <Icon
                      name="RiFilePdf2Line"
                      size={17}
                      color="dc2626"
                    />
                  </div>

                  {/* Name + Status */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-medium text-slate-700 truncate">
                        {document.name}
                      </h4>

                      <span className="text-[9px] text-slate-400 uppercase">
                        {document.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Status */}
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${config.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                        />

                        {config.label}
                      </span>

                      {/* Signed Info */}
                      {document.status === "completed" &&
                        document.signedBy && (
                          <>
                            <span className="text-slate-300">
                              •
                            </span>

                            <span className="text-[9px] text-slate-400">
                              {document.signedBy}
                            </span>

                            {document.signedOn && (
                              <>
                                <span className="text-slate-300">
                                  •
                                </span>

                                <span className="text-[9px] text-slate-400">
                                  {formatDate(document.signedOn)}
                                </span>
                              </>
                            )}
                          </>
                        )}
                    </div>
                  </div>
                </div>

                {/* =================================================
                    ACTIONS
                ================================================== */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* ---------------------------------------------
                      DOWNLOAD ORIGINAL
                  ---------------------------------------------- */}
                  <button
                    type="button"
                    onClick={() => onDownload(document)}
                    title="Download document"
                    className="
                      w-7 h-7
                      flex items-center justify-center
                      rounded-md
                      border border-slate-200
                      text-slate-500
                      hover:text-primary
                      hover:border-primary/30
                      hover:bg-primary/5
                      transition
                    "
                  >
                    <Icon name="RiDownload2Line" size={14} />
                  </button>

                  {/* ---------------------------------------------
                      ONLINE E-SIGN
                  ---------------------------------------------- */}
                  {document.status !== "completed" && (
                    <button
                      type="button"
                      onClick={() => onSendESign(document)}
                      title={
                        document.status === "link_sent"
                          ? "Resend e-sign link"
                          : "Send e-sign link"
                      }
                      className="
                        h-7 px-2.5
                        flex items-center gap-1
                        rounded-md
                        bg-primary
                        text-white
                        text-[10px]
                        font-medium
                        hover:opacity-90
                        transition
                      "
                    >
                      <Icon
                        name="RiFileSignatureLine"
                        size={13}
                      />

                      {document.status === "link_sent"
                        ? "Resend"
                        : "E-Sign"}
                    </button>
                  )}

                  {/* ---------------------------------------------
                      MANUAL UPLOAD
                  ---------------------------------------------- */}
                  {document.status !== "completed" && (
                    <>
                      <input
                        ref={(element) => {
                          fileRefs.current[document.id] = element;
                        }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(event) =>
                          handleFileChange(event, document)
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          fileRefs.current[
                            document.id
                          ]?.click()
                        }
                        title="Upload signed document"
                        className="
                          w-7 h-7
                          flex items-center justify-center
                          rounded-md
                          border border-slate-200
                          text-slate-500
                          hover:text-emerald-600
                          hover:border-emerald-200
                          hover:bg-emerald-50
                          transition
                        "
                      >
                        <Icon
                          name="RiUpload2Line"
                          size={14}
                        />
                      </button>
                    </>
                  )}

                  {/* ---------------------------------------------
                      COMPLETED ACTIONS
                  ---------------------------------------------- */}
                  {document.status === "completed" && (
                    <>
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => onViewSigned(document)}
                        title="View signed document"
                        className="
                          w-7 h-7
                          flex items-center justify-center
                          rounded-md
                          border border-slate-200
                          text-slate-500
                          hover:text-primary
                          hover:bg-primary/5
                          transition
                        "
                      >
                        <Icon name="RiEyeLine" size={14} />
                      </button>

                      {/* Download Signed */}
                      <button
                        type="button"
                        onClick={() => onDownload(document)}
                        title="Download signed document"
                        className="
                          w-7 h-7
                          flex items-center justify-center
                          rounded-md
                          bg-emerald-50
                          text-emerald-600
                          hover:bg-emerald-100
                          transition
                        "
                      >
                        <Icon
                          name="RiDownload2Line"
                          size={14}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* =================================================
                  SELECTED FILE PREVIEW
              ================================================== */}
              {selectedFile && (
                <div className="mt-2 ml-10">
                  <div
                    className="
                      flex items-center justify-between
                      gap-3
                      px-2.5 py-2
                      rounded-md
                      bg-slate-50
                      border border-slate-200
                    "
                  >
                    {/* File Info */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Icon
                          name="RiFilePdf2Line"
                          size={13}
                          color="dc2626"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-slate-700 truncate">
                          {selectedFile.name}
                        </p>

                        <p className="text-[9px] text-slate-400">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>

                    {/* File Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFile(document.id)
                        }
                        title="Remove file"
                        className="
                          w-6 h-6
                          flex items-center justify-center
                          rounded
                          text-red-500
                          hover:bg-red-50
                        "
                      >
                        <Icon
                          name="RiDeleteBin6Line"
                          size={13}
                        />
                      </button>

                      {/* Submit */}
                      <button
                        type="button"
                        onClick={() =>
                          handleSubmitUpload(document)
                        }
                        className="
                          h-6 px-2.5
                          flex items-center gap-1
                          rounded
                          bg-emerald-600
                          text-white
                          text-[9px]
                          font-medium
                          hover:bg-emerald-700
                          transition
                        "
                      >
                        <Icon
                          name="RiCheckLine"
                          size={12}
                        />

                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentSignature;