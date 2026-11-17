import React, { useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Icon from "../utils/Icon";
import Modal from "../utils/Modal";
import { useAuthData } from "../../context/authContext";
import { SaveOtherDocuments } from "../../api/application";
import { convertFileToBase64 } from "../utils/common";

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
};

const detectMimeFromBase64 = (b64) => {
  if (b64.startsWith("/9j/")) return "image/jpeg";
  if (b64.startsWith("iVBORw0KGgo")) return "image/png";
  if (b64.startsWith("JVBERi")) return "application/pdf";
  return null;
};

const openBlobInNewTab = (blobUrl) => {
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

  const directUrl =
    doc.document_url || doc.file_url || doc.url || doc.signed_url || null;

  if (typeof directUrl === "string" && /^https?:\/\//i.test(directUrl)) {
    window.open(directUrl, "_blank", "noopener,noreferrer");
    return;
  }

  let base64 =
    doc.document_base64 || doc.base64 || doc.file_content || doc.data || null;

  if (!base64 || typeof base64 !== "string") {
    toast.error("Document content not available. Try refreshing.");
    return;
  }

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
    for (let i = 0; i < byteChars.length; i++)
      bytes[i] = byteChars.charCodeAt(i);

    const blob = new Blob([bytes], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    openBlobInNewTab(blobUrl);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  } catch (err) {
    console.error("[openDocumentInNewTab] failed:", err);
    toast.error("Failed to open document. The file may be corrupted.");
  }
};

const formatFileSize = (size) => {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

/* -------------------------------------------------------------------------- */
/*  Compact document row                                                      */
/* -------------------------------------------------------------------------- */

const DocumentRow = ({
  label,
  icon,
  documentType,
  document,
  customerId,
  applicationId,
  userId,
  uploading,
  onUploadStart,
  onUploadEnd,
  onUploaded,
}) => {
  const fileRef = useRef(null);
  const allowed = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
  const maxFileSize = 10 * 1024 * 1024;

  const handleFile = async (file) => {
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error(
        `Only ${allowed.join(", ").toUpperCase()} files are allowed.`,
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
      onUploadStart?.();
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
        onUploaded?.({
          id: res?.data?.id ?? document?.id,
          document_type: documentType,
          document_base64: base64,
          file_extension: ext,
        });
      } else {
        toast.error(res?.message || `${label} upload failed.`);
      }
    } catch (err) {
      console.error(`${label} upload error:`, err);
      toast.error("Something went wrong while uploading.");
    } finally {
      onUploadEnd?.();
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const isUploaded = Boolean(document);

  return (
    <div className="flex items-center justify-between gap-2 bg-slate-50 rounded-md px-2 py-1.5">
      <div className="flex items-center gap-1.5 min-w-0">
        <Icon name={icon} size={12} color="#64748B" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-700 truncate">
            {label}
          </p>
          <p
            className={`text-[9px] ${
              isUploaded ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {isUploaded ? "Uploaded" : "Not uploaded"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {isUploaded && (
          <button
            type="button"
            onClick={() => openDocumentInNewTab(document)}
            className="text-[10px] font-medium px-2 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            View
          </button>
        )}

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="text-[10px] font-medium px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {uploading ? "Uploading..." : isUploaded ? "Replace" : "Upload"}
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
/*  Small formik field helper (keeps JSX compact)                             */
/* -------------------------------------------------------------------------- */

const FieldError = ({ touched, error }) =>
  touched && error ? (
    <p className="text-[10px] text-red-500 mt-0.5">{error}</p>
  ) : null;

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

const Disbursement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [disbursementStatus, setDisbursementStatus] = useState(null);

  // Documents (start empty; if the parent already fetched them, seed these).
  const [sanctionLetter, setSanctionLetter] = useState(null);
  const [agreementLetter, setAgreementLetter] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(null); // "SANCTION_LETTER" | "AGREEMENT_LETTER" | null

  const utrFileInputRef = useRef(null);

  const { authData } = useAuthData();
  // const [searchParams] = useSearchParams();
  // const customerId = searchParams.get("customer_id");
  // const applicationId = searchParams.get("application_id");

  const location = useLocation();
  const routeLead = location.state?.lead;
  const { customerId, applicationId } = location.state?.pera || {};

  const disbursementData = {
    loanAmount: "₹5,00,000",
    disbursementAmount: "₹4,75,000",
    approvedBy: "Rajesh Khanna",
    bankName: "HDFC Bank",
    accountNumber: "XXXX-XXXX-1234",
    ifscCode: "HDFC0000123",
    accountHolderName: "Rahul Sharma",
    modeOfPayment: "Bank Transfer",
    date: new Date().toISOString().split("T")[0],

    // EMI Details
    emiAmount: "₹10,256",
    emiTenure: "60 Months",
    interestRate: "8.5%",
    totalInterest: "₹1,15,360",
    totalPayable: "₹6,15,360",
    firstEmiDate: "2026-02-01",
    emiDay: "1st of every month",
  };

  /* ---------- Formik: disbursement + UTR form ---------- */

  const allowedUtrExts = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
  const maxUtrSize = 10 * 1024 * 1024;

  const formik = useFormik({
    initialValues: {
      utr_number: "",
      disbursement_date: new Date().toISOString().split("T")[0],
      utr_file: null,
      remarks: "",
      confirmed: false,
    },
    validationSchema: Yup.object({
      utr_number: Yup.string()
        .trim()
        .required("UTR number is required")
        .min(6, "UTR number looks too short"),
      disbursement_date: Yup.date()
        .typeError("Invalid date")
        .required("Disbursement date is required")
        .max(new Date(), "Cannot be a future date"),
      utr_file: Yup.mixed()
        .required("UTR file is required")
        .test("fileType", "Unsupported file type", (value) => {
          if (!value) return true;
          const ext = value.name?.split(".").pop()?.toLowerCase();
          return allowedUtrExts.includes(ext);
        })
        .test("fileSize", "File must be ≤ 10 MB", (value) =>
          value ? value.size <= maxUtrSize : true,
        ),
      remarks: Yup.string().max(500, "Remarks cannot exceed 500 characters"),
      confirmed: Yup.boolean().oneOf(
        [true],
        "Please confirm before proceeding",
      ),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsProcessing(true);

        // 1) Upload UTR file (reuses existing docs endpoint)
        if (customerId && applicationId) {
          const ext = values.utr_file.name.split(".").pop().toLowerCase();
          const base64 = await convertFileToBase64(values.utr_file);
          const res = await SaveOtherDocuments({
            id: 0,
            customer_id: customerId,
            application_id: applicationId,
            document_type: "UTR_FILE",
            document_base64: base64,
            file_extension: ext,
            is_active: true,
            created_by: authData?.user_id,
            company_id: import.meta.env.VITE_COMPANY_ID,
            product_name: import.meta.env.VITE_PRODUCT_NAME,
          });
          if (!res?.status) {
            toast.error(res?.message || "UTR file upload failed.");
            setIsProcessing(false);
            setSubmitting(false);
            return;
          }
        }

        // 2) TODO: replace with your real disbursement/UTR API call
        //    e.g. await MarkDisbursed({
        //      customer_id, application_id,
        //      utr_number: values.utr_number,
        //      disbursement_date: values.disbursement_date,
        //      remarks: values.remarks,
        //    });

        // 3) Existing simulated processing
        setTimeout(() => {
          setDisbursementStatus({
            success: true,
            message: "Disbursement completed successfully!",
            reference: `UTR: ${values.utr_number} | DISB-${Date.now()
              .toString()
              .slice(-6)}`,
          });
          setIsProcessing(false);
          setIsModalOpen(false);
          resetForm();
          if (utrFileInputRef.current) utrFileInputRef.current.value = "";
          setTimeout(() => setDisbursementStatus(null), 5000);
        }, 2000);
      } catch (err) {
        console.error("Disbursement error:", err);
        toast.error("Something went wrong.");
        setIsProcessing(false);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDisburse = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    if (!isProcessing) {
      setIsModalOpen(false);
      formik.resetForm();
      if (utrFileInputRef.current) utrFileInputRef.current.value = "";
    }
  };

  /* ---------- Render ---------- */

  return (
    <>
      {/* Compact Disbursement Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Icon name="RiMoneyDollarCircleLine" size={16} color="#5050b8" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                Disbursement
              </h2>
              <p className="text-[10px] text-slate-500">
                Process loan disbursement
              </p>
            </div>
          </div>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            LA-1250
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {disbursementStatus ? (
            <div
              className={`rounded-md px-3 py-2 flex items-center gap-2 ${
                disbursementStatus.success
                  ? "bg-emerald-50 border border-primary/10"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <Icon
                name={
                  disbursementStatus.success
                    ? "RiCheckboxCircleLine"
                    : "RiErrorWarningLine"
                }
                size={18}
                color={disbursementStatus.success ? "#059669" : "#DC2626"}
              />
              <div className="flex-1">
                <p
                  className={`text-xs font-semibold ${
                    disbursementStatus.success
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {disbursementStatus.message}
                </p>
                {disbursementStatus.reference && (
                  <p className="text-[10px] text-slate-500">
                    Ref: {disbursementStatus.reference}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Compact Summary Grid - 3 columns */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Loan
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    {disbursementData.loanAmount}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Disburse
                  </p>
                  <p className="text-xs font-bold text-primary">
                    {disbursementData.disbursementAmount}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Mode
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    {disbursementData.modeOfPayment}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Approved By
                  </p>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {disbursementData.approvedBy}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Bank
                  </p>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {disbursementData.bankName}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                    Account
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    {disbursementData.accountNumber}
                  </p>
                </div>
              </div>

              {/* EMI Details Section */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon name="RiBankCardLine" size={12} color="#64748B" />
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                    EMI Details
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-md px-2 py-1.5 text-center border border-primary/10">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      EMI Amount
                    </p>
                    <p className="text-xs font-bold text-primary">
                      {disbursementData.emiAmount}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Tenure
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {disbursementData.emiTenure}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Interest
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {disbursementData.interestRate}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                      Total Payable
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {disbursementData.totalPayable}
                    </p>
                  </div>
                </div>

                {/* EMI Schedule Quick View */}
                <div className="flex items-center justify-between mt-1.5 px-2 py-2 bg-blue-50/50 rounded-md border border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <Icon name="RiCalendarLine" size={12} color="#3B82F6" />
                    <span className="text-[11px] text-slate-600">
                      First EMI:
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800">
                      {disbursementData.firstEmiDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="RiTimeLine" size={12} color="#3B82F6" />
                    <span className="text-[11px] text-slate-600">Due on:</span>
                    <span className="text-[11px] font-semibold text-slate-800">
                      {disbursementData.emiDay}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="RiPieChartLine" size={12} color="#3B82F6" />
                    <span className="text-[11px] text-slate-600">
                      Total Interest:
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600">
                      {disbursementData.totalInterest}
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Documents (Sanction + Agreement) */}
              <div className="mb-3 pt-2.5 border-t border-slate-200">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon name="RiFileTextLine" size={12} color="#64748B" />
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                    Required Documents
                  </span>
                </div>

                <div className="space-y-1.5 grid grid-cols-2 gap-4">
                  <DocumentRow
                    label="Sanction Letter"
                    icon="RiFileShield2Line"
                    documentType="SANCTION_LETTER"
                    document={sanctionLetter}
                    customerId={customerId}
                    applicationId={applicationId}
                    userId={authData?.user_id}
                    uploading={uploadingDoc === "SANCTION_LETTER"}
                    onUploadStart={() => setUploadingDoc("SANCTION_LETTER")}
                    onUploadEnd={() => setUploadingDoc(null)}
                    onUploaded={setSanctionLetter}
                  />

                  <DocumentRow
                    label="Agreement Letter"
                    icon="RiFilePaper2Line"
                    documentType="AGREEMENT_LETTER"
                    document={agreementLetter}
                    customerId={customerId}
                    applicationId={applicationId}
                    userId={authData?.user_id}
                    uploading={uploadingDoc === "AGREEMENT_LETTER"}
                    onUploadStart={() => setUploadingDoc("AGREEMENT_LETTER")}
                    onUploadEnd={() => setUploadingDoc(null)}
                    onUploaded={setAgreementLetter}
                  />
                </div>
              </div>

              {/* Compact Button */}
              <button
                onClick={handleDisburse}
                className="w-full bg-primary text-white px-4 py-3 rounded-md font-semibold hover:bg-primary/80 transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm hover:shadow cursor-pointer"
              >
                <Icon name="RiSendPlane2Line" size={14} color="#FFFFFF" />
                <span>Mark as Disbursed</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal — now Formik-managed with UTR fields */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Confirm Disbursement"
        size="sm"
      >
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-3">
          {/* Compact Summary */}
          <div className="bg-slate-50 rounded-md p-3 grid grid-cols-2 gap-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Loan Amount</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.loanAmount}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Disbursement</span>
              <span className="font-bold text-primary">
                {disbursementData.disbursementAmount}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Payment Mode</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.modeOfPayment}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Bank</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.bankName}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Account</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.accountNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Date</span>
              <span className="font-semibold text-slate-800">
                {disbursementData.date}
              </span>
            </div>
          </div>

          {/* EMI Summary in Modal */}
          <div className="p-2 mt-1.5 border-t border-slate-200 bg-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon name="RiBankCardLine" size={12} color="#64748B" />
              <span className="text-[10px] font-semibold text-slate-600">
                EMI Summary
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">EMI Amount</span>
                <span className="font-semibold text-primary">
                  {disbursementData.emiAmount}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Tenure</span>
                <span className="font-semibold text-slate-800">
                  {disbursementData.emiTenure}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Interest Rate</span>
                <span className="font-semibold text-slate-800">
                  {disbursementData.interestRate}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Payable</span>
                <span className="font-semibold text-slate-800">
                  {disbursementData.totalPayable}
                </span>
              </div>
            </div>
          </div>

          {/* ── UTR Details ─────────────────────────────────────────── */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5">
              <Icon name="RiFileList3Line" size={12} color="#64748B" />
              <span className="text-[10px] font-semibold text-slate-600">
                UTR / Disbursement Details
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* UTR Number */}
              <div>
                <label
                  htmlFor="utr_number"
                  className="block text-[10px] font-medium text-slate-600 mb-1"
                >
                  UTR Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="utr_number"
                  name="utr_number"
                  type="text"
                  autoComplete="off"
                  value={formik.values.utr_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. HDFC1234567890123"
                  className={`w-full rounded-md border bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.utr_number && formik.errors.utr_number
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
                <FieldError
                  touched={formik.touched.utr_number}
                  error={formik.errors.utr_number}
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label
                  htmlFor="transaction_type"
                  className="block text-[10px] font-medium text-slate-600 mb-1"
                >
                  Transaction Type <span className="text-red-500">*</span>
                </label>
                <input
                  id="transaction_type"
                  name="transaction_type"
                  type="text"
                  autoComplete="off"
                  value={formik.values.transaction_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Cash"
                  className={`w-full rounded-md border bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.transaction_type &&
                    formik.errors.transaction_type
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
                <FieldError
                  touched={formik.touched.transaction_type}
                  error={formik.errors.transaction_type}
                />
              </div>

              {/* Disbursement Date */}
              <div>
                <label
                  htmlFor="disbursement_date"
                  className="block text-[10px] font-medium text-slate-600 mb-1"
                >
                  Disbursement Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="disbursement_date"
                  name="disbursement_date"
                  type="date"
                  value={formik.values.disbursement_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full rounded-md border bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.disbursement_date &&
                    formik.errors.disbursement_date
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
                <FieldError
                  touched={formik.touched.disbursement_date}
                  error={formik.errors.disbursement_date}
                />
              </div>

              {/* UTR File */}
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">
                  UTR File <span className="text-red-500">*</span>
                </label>

                {!formik.values.utr_file ? (
                  <button
                    type="button"
                    onClick={() => utrFileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 hover:border-primary text-[11px] text-slate-600 py-2 transition-colors cursor-pointer"
                  >
                    <Icon name="RiUploadCloud2Line" size={14} color="#64748B" />
                    <span>Click to upload UTR file</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-700 truncate">
                        {formik.values.utr_file.name}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {formatFileSize(formik.values.utr_file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => {
                        formik.setFieldValue("utr_file", null);
                        if (utrFileInputRef.current)
                          utrFileInputRef.current.value = "";
                      }}
                      className="text-[10px] font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <input
                  ref={utrFileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "utr_file",
                      e.target.files?.[0] || null,
                    )
                  }
                />
                <FieldError
                  touched={formik.touched.utr_file}
                  error={formik.errors.utr_file}
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label
              htmlFor="remarks"
              className="block text-[10px] font-medium text-slate-600 mb-1"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formik.values.remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows="2"
              placeholder="Add remarks..."
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
            />
            <FieldError
              touched={formik.touched.remarks}
              error={formik.errors.remarks}
            />
          </div>

          {/* Confirmation */}
          <div>
            <div className="flex items-start gap-1.5">
              <input
                type="checkbox"
                id="confirmDisbursement"
                name="confirmed"
                checked={formik.values.confirmed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-0.5 w-3.5 h-3.5 text-primary border-slate-300 rounded focus:ring-emerald-500"
              />
              <label
                htmlFor="confirmDisbursement"
                className="text-[12px] text-slate-600 leading-relaxed"
              >
                I confirm all details are verified and authorize disbursement of
                <span className="font-semibold text-primary">
                  {" "}
                  {disbursementData.disbursementAmount}
                </span>
              </label>
            </div>
            <FieldError
              touched={formik.touched.confirmed}
              error={formik.errors.confirmed}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isProcessing}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-200 hover:bg-slate-100 rounded-md transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || formik.isSubmitting}
              className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary/80 cursor-pointer transition-all flex items-center gap-1.5 text-xs shadow-sm hover:shadow disabled:opacity-50"
            >
              {isProcessing || formik.isSubmitting ? (
                <>
                  <span className="animate-spin">
                    <Icon name="RiRefreshLine" size={14} color="#FFFFFF" />
                  </span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Icon name="RiCheckLine" size={14} color="#FFFFFF" />
                  <span>Confirm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Disbursement;
