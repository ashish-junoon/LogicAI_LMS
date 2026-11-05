import { useEffect, useRef, useState } from "react";
import { useAuthData } from "../../context/authContext";
import { RiFileChartLine, RiFileTextLine, RiUpload2Line } from "react-icons/ri";
import Modal from "./Modal";
import { GetAllDocumentTypes } from "../../api/mastersApi";
import { SaveOtherDocuments } from "../../api/application";
import { convertFileToBase64 } from "./common";
import { toast } from "react-toastify";

const DocumentVault = ({
  documents = [],
  customerDetails = {},
  customerId,
  applicationId,
  userId,
  onDocumentsUploaded,
  onSubmitForm,
  submittingForm = false,
}) => {
  const [existingDocuments, setExistingDocuments] = useState(documents);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentTypesError, setDocumentTypesError] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [failedImages, setFailedImages] = useState({});
  const [failedPdfs, setFailedPdfs] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [remarkError, setRemarkError] = useState("");

  const { authData } = useAuthData();

  const fileInputRef = useRef(null);
//   const previewUrlsRef = useRef(new Set());

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Enter" && selectedFile && !uploading) {
//         // File input ya kisi input field par Enter hone par ignore karna ho toh
//         if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
//           return;
//         }

//         e.preventDefault();
//         handleUpload();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [selectedFile, uploading]);

  const previewUrlsRef = useRef(new Set());

  useEffect(() => {
    if(selectedFile){
        handleUpload();
    }
  }, [selectedFile]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  const ALLOWED_FILE_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp"];

  useEffect(() => {
    setExistingDocuments(Array.isArray(documents) ? documents : []);
  }, [documents]);

  const getDocumentLabel = (document) =>
    document?.document_type || document?.document_name || "Document";

  const getDocumentUrl = (document) =>
    document?.previewUrl ||
    document?.document_url ||
    document?.file_url ||
    document?.document_path ||
    document?.url ||
    "";

  const getDocumentExtension = (document) => {
    const fileName =
      document?.file_name ||
      document?.document_path ||
      document?.file_url ||
      document?.url ||
      "";

    return (
      document?.file_extension?.toLowerCase().replace(".", "") ||
      fileName.split("?")[0].split("#")[0].split(".").pop().toLowerCase()
    );
  };

  useEffect(
    () => () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    GetAllDocumentTypes()
      .then((response) => {
        if (!response?.status) {
          throw new Error(
            response?.message || "Unable to load document types.",
          );
        }
        if (isMounted) {
          setDocumentTypes(
            (response?.data || []).filter(
              (documentType) => documentType?.is_active,
            ),
          );
        }
      })
      .catch((error) => {
        if (isMounted) {
          setDocumentTypesError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load document types.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = async () => {
    setUploadError("");

    if (!selectedDocumentType) {
      setUploadError("Please select a document type.");
      return;
    }

    if (!selectedFile) {
      setUploadError("Please choose a file to upload.");
      return;
    }

    const extension = selectedFile.name
      .split("?")[0]
      .split("#")[0]
      .split(".")
      .pop()
      .toLowerCase();

    // if (
    //   !ALLOWED_FILE_TYPES.includes(selectedFile.type) &&
    //   !ALLOWED_FILE_EXTENSIONS.includes(extension)
    // ) {
    //   setUploadError("Only PDF, JPG, PNG or WEBP files are allowed.");
    //   return;
    // }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError("File size must be under 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const response = await SaveOtherDocuments({
        id: 0,
        customer_id: customerDetails?.customer_id || customerId || "",
        application_id: applicationId || customerDetails?.application_id || "",
        document_type: selectedDocumentType,
        document_base64: await convertFileToBase64(selectedFile),
        file_extension: extension,
        is_active: true,
        creadted_by: authData?.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      });

      if (!response?.status) {
        throw new Error(response?.message || "Unable to upload document.");
      }

      const previewUrl = URL.createObjectURL(selectedFile);
      previewUrlsRef.current.add(previewUrl);
      const uploadedDocument = {
        ...(response?.data || {}),
        id: response?.data?.id ?? `uploaded-${Date.now()}`,
        document_type: response?.data?.document_type || selectedDocumentType,
        file_name: response?.data?.file_name || selectedFile.name,
        file_extension: extension,
        mime_type: selectedFile.type,
        document_path:
          response?.data?.document_path || response?.data?.file_path || "",
        previewUrl,
      };

      setExistingDocuments((previous) => [...previous, uploadedDocument]);
      setSelectedFile(null);
      setSelectedDocumentType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Document uploaded successfully.");
      Promise.resolve()
        .then(() => onDocumentsUploaded?.())
        .catch((refreshError) => {
          console.error(
            "Error refreshing documents after upload:",
            refreshError,
          );
        });
    } catch (error) {
      setUploadError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to upload document.",
      );
    } finally {
      setUploading(false);
    }
  };

  const renderDocumentFooter = (document, label, documentUrl) => {
    const fileName = document?.file_name || document?.document_path || label;

    return (
      <div className="flex items-center justify-between gap-3 border-t border-ink-100 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-800">
            {label?.replaceAll("_", " ")}
          </p>
          <p className="mt-1 truncate text-xs text-ink-500" title={fileName}>
            {fileName}
          </p>
        </div>
        {documentUrl && (
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${label}`}
            title="Open document"
            className="shrink-0 rounded-lg p-2 text-primary-700 hover:bg-primary-50"
          >
            {/* <BsEyeFill size={16} /> */}
          </a>
        )}
      </div>
    );
  };

  const handleConfirmSubmit = async () => {
    const trimmedRemark = remark.trim();
    if (trimmedRemark.length < 10) {
      setRemarkError("Remark is required and must be at least 10 characters.");
      return;
    }

    setRemarkError("");
    const succeeded = await onSubmitForm?.(trimmedRemark);
    if (succeeded) setIsConfirmModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-ink-100 shadow-card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-ink-800">
          Uploaded documents
        </h3>
        <span className="text-xs font-medium text-ink-500">
          {existingDocuments.length}{" "}
          {existingDocuments.length === 1 ? "document" : "documents"}
        </span>
      </div>

      {existingDocuments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {existingDocuments.map((document, index) => {
            const label = getDocumentLabel(document);
            const key =
              document?.id ?? document?.document_id ?? `${label}-${index}`;
            const documentUrl = getDocumentUrl(document);
            const extension = getDocumentExtension(document);
            const isImage =
              (document?.mime_type || "").startsWith("image/") ||
              ["jpg", "jpeg", "png", "webp", "gif", "bmp", "avif"].includes(
                extension,
              );
            const isPdf =
              document?.mime_type === "application/pdf" || extension === "pdf";

            if (isImage && documentUrl && !failedImages[key]) {
              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View full image"
                    className="flex h-52 items-center justify-center bg-ink-50 p-2"
                  >
                    <img
                      src={documentUrl}
                      alt={label}
                      loading="lazy"
                      onError={() =>
                        setFailedImages((previous) => ({
                          ...previous,
                          [key]: true,
                        }))
                      }
                      className="max-h-full max-w-full object-contain"
                    />
                  </a>
                  {renderDocumentFooter(document, label, documentUrl)}
                </div>
              );
            }

            if (isPdf && documentUrl && !failedPdfs[key]) {
              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-52 bg-ink-50">
                    <iframe
                      src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      title={`PDF preview - ${label}`}
                      className="h-full w-full border-0"
                      onError={() =>
                        setFailedPdfs((previous) => ({
                          ...previous,
                          [key]: true,
                        }))
                      }
                    />
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open full PDF: ${label}`}
                      title="Open full PDF"
                      className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-primary-700 shadow hover:bg-white"
                    >
                      {/* <BsEyeFill size={16} /> */}
                    </a>
                  </div>
                  {renderDocumentFooter(document, label, documentUrl)}
                </div>
              );
            }

            return (
              <div
                key={key}
                className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <a
                  href={documentUrl || undefined}
                  target={documentUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  title="Open document"
                  className="flex h-52 items-center justify-center bg-ink-50 p-6"
                >
                  <RiFileTextLine size={56} className="text-ink-400" />
                </a>
                {renderDocumentFooter(document, label, documentUrl)}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50 p-5 text-center">
          <RiFileTextLine size={26} className="text-ink-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-ink-700">No documents found</p>
        </div>
      )}

      <div className="mt-6 border-t border-ink-100 pt-5">
        <h3 className="mb-3 text-sm font-semibold text-ink-800">
          Upload other documents
        </h3>
        <div className="rounded-lg border border-ink-200 bg-ink-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="vault-document-type"
                className="mb-1.5 block text-xs font-semibold text-ink-600"
              >
                Document Type
              </label>
              <select
                id="vault-document-type"
                value={selectedDocumentType}
                onChange={(event) => {
                  setUploadError("");
                  setSelectedDocumentType(event.target.value);
                }}
                disabled={uploading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
              >
                <option value="">Select</option>
                {documentTypes.map((documentType) => (
                  <option
                    key={documentType?.id ?? documentType?.document_type}
                    value={documentType?.document_type}
                  >
                    {documentType?.document_type}
                  </option>
                ))}
              </select>
              {documentTypesError && (
                <p className="mt-1.5 text-xs text-rose-600">
                  {documentTypesError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="vault-document-file"
                className="mb-1.5 block text-xs font-semibold text-ink-600"
              >
                Choose File
              </label>
              <input
                id="vault-document-file"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                disabled={uploading}
                onChange={(event) => {
                  setUploadError("");
                  setSelectedFile(event.currentTarget.files?.[0] || null);

                  // Remove focus after file selection
                  event.currentTarget.blur();
                }}
                className="w-full cursor-pointer rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-sm text-ink-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-700 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-primary-800 disabled:opacity-60"
              />
              {selectedFile && (
                <p className="mt-1.5 break-all text-xs text-ink-500">
                  Selected: {selectedFile.name} ·{" "}
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>

          {uploadError && (
            <p className="mt-3 text-xs font-medium text-rose-600">
              {uploadError}
            </p>
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <span
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-300 border-t-primary-700"
                    aria-hidden="true"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <RiUpload2Line size={15} /> Upload document
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={() => setIsConfirmModalOpen(true)}
          disabled={submittingForm}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submittingForm ? (
            <>
              <RiRefreshLine size={17} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <RiFileChartLine size={17} />
              Submit Form
            </>
          )}
        </button>
      </div> */}

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          if (submittingForm) return;
          setIsConfirmModalOpen(false);
          setRemarkError("");
        }}
        title="Confirm application submission"
        size="md"
      >
        <div className="space-y-4 p-5">
          <p className="text-sm text-ink-600">
            Are you sure you want to submit this application and continue to PD
            Applications?
          </p>
          <div>
            <label
              htmlFor="application-submit-remark"
              className="mb-1.5 block text-sm font-medium text-ink-800"
            >
              Remark <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="application-submit-remark"
              rows={4}
              value={remark}
              onChange={(event) => {
                setRemark(event.target.value);
                if (remarkError) setRemarkError("");
              }}
              onBlur={() => {
                if (remark.trim().length < 10) {
                  setRemarkError(
                    "Remark is required and must be at least 10 characters.",
                  );
                }
              }}
              aria-invalid={Boolean(remarkError)}
              aria-describedby={
                remarkError ? "application-submit-remark-error" : undefined
              }
              placeholder="Enter a remark (minimum 10 characters)"
              disabled={submittingForm}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:ring-2 ${
                remarkError
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                  : "border-ink-200 focus:border-primary-500 focus:ring-primary-100"
              }`}
            />
            {remarkError && (
              <p
                id="application-submit-remark-error"
                className="mt-1.5 text-xs text-rose-600"
                role="alert"
              >
                {remarkError}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={submittingForm}
              className="rounded-lg border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 disabled:opacity-60"
            >
              No, go back
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              disabled={submittingForm}
              className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingForm ? "Submitting..." : "Yes, submit"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentVault;
