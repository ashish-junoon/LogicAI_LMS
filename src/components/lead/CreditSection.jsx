import { useState } from "react";
import Icon from "../utils/Icon";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import { CreditReport, CrifAuthQuestionnaireReport } from "../../api/kycApi";
import { SaveOtherDocuments } from "../../api/application";
import { convertFileToBase64 } from "../utils/common";
import { toast } from "react-toastify";
import { useAuthData } from "../../context/authContext";

const normalizeCustomerType = (customerType) =>
  String(customerType || "").toUpperCase().replace(/[^A-Z]/g, "");

const createUsers = (creditDetails, customerDetails) => {
  const records = Array.isArray(creditDetails)
    ? creditDetails
    : creditDetails
      ? [creditDetails]
      : [];
  const marketSurvey = customerDetails?.marketSurvey?.[0] || {};
  const personalKyc = customerDetails?.personalKyc?.[0] || {};
  const borrower = {
    full_name:
      personalKyc.full_name ||
      marketSurvey.business_owner_name ||
      customerDetails?.customer_name ||
      "Borrower",
    mobile_number:
      marketSurvey.business_owner_mobile_no ||
      personalKyc.mobile_number ||
      personalKyc.alternate_mobile ||
      "",
    uid_number: personalKyc.uid_number || "",
  };
  const coBorrowerGuarantor =
    customerDetails?.coBorrowerGuarantor?.[0] || {};
  const participants = [
    {
      role: "BORROWER",
      label: "Borrower",
      profile: borrower,
      creditRecord: records.find(
        (record) => normalizeCustomerType(record?.customer_type) === "BORROWER",
      ),
    },
    {
      role: "CO_BORROWER",
      label: "Co-borrower",
      profile: {
        full_name: coBorrowerGuarantor.co_borrower_name || "Co-borrower",
        mobile_number: coBorrowerGuarantor.co_borrower_mobile || "",
        uid_number: coBorrowerGuarantor.co_borrower_aahaar_number || "",
        relation: coBorrowerGuarantor.co_borrower_relation || "",
        customer_id: coBorrowerGuarantor.customer_id,
        application_id: coBorrowerGuarantor.application_id,
      },
      creditRecord: records.find((record) =>
        ["COBORROWER", "COAPPLICANT"].includes(
          normalizeCustomerType(record?.customer_type),
        ),
      ),
    },
    {
      role: "GUARANTOR",
      label: "Guarantor",
      profile: {
        full_name: coBorrowerGuarantor.guarantor_name || "Guarantor",
        mobile_number: coBorrowerGuarantor.guarantor_mobile || "",
        uid_number: coBorrowerGuarantor.guarantor_aahaar_number || "",
        relation: coBorrowerGuarantor.guarantor_relation || "",
        customer_id: coBorrowerGuarantor.customer_id,
        application_id: coBorrowerGuarantor.application_id,
      },
      creditRecord: records.find(
        (record) =>
          normalizeCustomerType(record?.customer_type) === "GUARANTOR",
      ),
    },
  ];

  return participants.map(({ role, label, profile }, index) => {
    const roleRecords = records.filter(
      (record) => normalizeCustomerType(record?.customer_type) === normalizeCustomerType(role),
    );
    const softRecord =
      roleRecords.find((record) =>
        String(record?.credit_type || "SOFT PULL").toUpperCase().includes("SOFT"),
      ) || (!roleRecords.some((record) => String(record?.credit_type || "").toUpperCase().includes("HARD"))
        ? roleRecords[0]
        : null);
    const hardRecord = roleRecords.find((record) =>
      String(record?.credit_type || "").toUpperCase().includes("HARD"),
    );
    const hardDocumentType = `${role}_HARD_PULL`;
    const hardDocument = (customerDetails?.documents || []).find(
      (document) =>
        normalizeCustomerType(document?.document_type) ===
          normalizeCustomerType(hardDocumentType) ||
        normalizeCustomerType(document?.document_type) === normalizeCustomerType(role),
    );
    const record = softRecord || {};
    const rawScore = record?.credit_score ?? record?.creditScore ?? record?.score;
    const parsedScore = Number(rawScore);
    const creditScore =
      rawScore !== null &&
      rawScore !== undefined &&
      rawScore !== "" &&
      Number.isFinite(parsedScore)
        ? parsedScore
        : null;
    const fileUrl =
      record?.credit_report_link ||
      record?.file_url ||
      record?.report_url ||
      record?.pdf_url ||
      null;

    return {
      id: `${role.toLowerCase()}-${record?.id || record?.request_id || index}`,
      role,
      label,
      profile,
      detail: record,
      name: profile.full_name,
      softPull: {
        creditScore,
        generatedDate: record?.request_date || record?.generated_date || record?.generatedDate || null,
        fileUrl,
        fileName:
          record?.file_name ||
          record?.fileName ||
          (fileUrl ? fileUrl.split("/").pop().split("?")[0] : null),
        showFile: Boolean(fileUrl),
        isGenerating: false,
        selectedMode: record?.bureau_name || "CRIF",
        lastRefreshed: record?.request_date || record?.generated_date || null,
      },
      hardPull: {
        creditScore: hardRecord?.credit_score ?? null,
        generatedDate:
          hardRecord?.request_date || hardDocument?.created_date || null,
        fileUrl:
          hardRecord?.credit_report_link ||
          hardRecord?.file_url ||
          hardDocument?.document_path ||
          hardDocument?.file_url ||
          null,
        fileName:
          hardDocument?.file_name ||
          hardRecord?.file_name ||
          hardDocument?.document_path?.split("/").pop() ||
          null,
        showFile: Boolean(
          hardRecord?.credit_report_link ||
            hardRecord?.file_url ||
            hardDocument?.document_path ||
            hardDocument?.file_url,
        ),
        isUploading: false,
        selectedFile: null,
        uploadError: "",
      },
    };
  });
};

const CreditSection = ({ creditDetails, customerDetails }) => {
  const [users, setUsers] = useState(() =>
    createUsers(creditDetails, customerDetails),
  );
  const [creditReportError, setCreditReportError] = useState("");
  const [questionnaire, setQuestionnaire] = useState(null);
  const [selectedQuestionOption, setSelectedQuestionOption] = useState("");
  const [isSubmittingQuestionnaire, setIsSubmittingQuestionnaire] = useState(false);

  const {authData} = useAuthData()

  const applySoftPullReport = (userId, response) => {
    const report =
      response?.data?.cibilDetails?.[0] ||
      response?.data?.data ||
      (Array.isArray(response?.data) ? response.data[0] : response?.data) ||
      response;
    const rawScore =
      report?.credit_score ??
      report?.creditScore ??
      report?.score ??
      report?.b2CReport?.reportData?.standardData?.score?.[0]?.value;
    const parsedScore = Number(rawScore);
    const hasScore =
      rawScore !== null &&
      rawScore !== undefined &&
      rawScore !== "" &&
      Number.isFinite(parsedScore);
    const fileUrl =
      response?.data?.creditReportLink ||
      report?.credit_report_link ||
      report?.file_url ||
      report?.report_url ||
      report?.pdf_url ||
      report?.url ||
      null;
    const generatedDate =
      report?.request_date || report?.generated_date || report?.generatedDate || new Date().toLocaleString();

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              softPull: {
                ...user.softPull,
                creditScore: hasScore ? parsedScore : null,
                generatedDate,
                fileUrl,
                fileName:
                  report?.file_name ||
                  report?.fileName ||
                  (fileUrl ? fileUrl.split("/").pop().split("?")[0] : null),
                isGenerating: false,
                showFile: Boolean(fileUrl),
                lastRefreshed: generatedDate,
              },
              detail: report,
            }
          : user,
      ),
    );
  };

  const handleGenerateCredit = async (userId, pullType) => {
    if (pullType !== "softPull") return;

    const user = users.find((currentUser) => currentUser.id === userId);
    if (!user) return;
    

    const marketSurvey = customerDetails?.marketSurvey?.[0] || {};
    const personalKyc = customerDetails?.personalKyc?.[0] || {};
    const loanDetails = customerDetails?.loanDetails?.[0] || {};
    const fullName = user.profile.full_name || "";
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = user.detail?.first_name || nameParts[0] || "";
    const lastName =
      user.detail?.last_name || nameParts.slice(1).join(" ") || firstName || "NA";
    const profileUid =
      user.role === "CO_BORROWER"
        ? customerDetails?.coBorrowerGuarantor?.[0]?.co_borrower_pan
        : user.role === "GUARANTOR"
          ? customerDetails?.coBorrowerGuarantor?.[0]?.guarantor_pan
          : personalKyc.uid_number;
    const profileMobile =
      user.role === "CO_BORROWER"
        ? customerDetails?.coBorrowerGuarantor?.[0]?.co_borrower_mobile
        : user.role === "GUARANTOR"
          ? customerDetails?.coBorrowerGuarantor?.[0]?.guarantor_mobile
          : marketSurvey.business_owner_mobile_no ||
            personalKyc.mobile_number ||
            personalKyc.alternate_mobile;
    const customerId =
      user.detail?.customer_id ||
      user.profile?.customer_id ||
      customerDetails?.coBorrowerGuarantor?.[0]?.customer_id ||
      customerDetails?.customer_id ||
      marketSurvey.customer_id ||
      personalKyc.customer_id;
    const applicationId =
      user.detail?.application_id ||
      user.detail?.applicantion_id ||
      user.profile?.application_id ||
      customerDetails?.coBorrowerGuarantor?.[0]?.application_id ||
      customerDetails?.application_id ||
      loanDetails.application_id ||
      marketSurvey.application_id ||
      personalKyc.application_id;

    if (!customerId || !applicationId) {
      setCreditReportError("Customer ID and application ID are required to fetch a credit report.");
      return;
    }

    setCreditReportError("");
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              [pullType]: {
                ...user[pullType],
                isGenerating: true,
              },
            }
          : user,
      ),
    );

    try {
      const request = {
        customer_id: customerId,
        application_id: applicationId,
        step_status: "5",
        first_name: firstName,
        last_name: lastName,
        uid_number:
          user.detail?.uid_number || profileUid || "",
        mobile_number:
          user.detail?.mobile_number ||
          profileMobile ||
          "",
        bureau_name: user.softPull.selectedMode || "CRIF",
        credit_type: user.detail?.credit_type || "SOFT PULL",
        customer_type: user.role,
        company_id:
          user.detail?.company_id ||
          marketSurvey.company_id ||
          import.meta.env.VITE_COMPANY_ID ||
          "",
        product_name:
          user.detail?.product_name ||
          marketSurvey.product_name ||
          loanDetails.product_name ||
          import.meta.env.VITE_PRODUCT_NAME ||
          "",
        created_by: authData?.user_id
      };
      const response = await CreditReport(request);
      const crifData =
        response?.data?.data?.data ||
        response?.data?.data ||
        response?.data ||
        {};
      const isCrifChallenge = ["S11", "S02"].includes(crifData?.status);
      const hasCreditReport = Boolean(
        response?.data?.creditReportLink || crifData?.creditReportLink,
      );

      if (response?.status === false && !isCrifChallenge && !hasCreditReport) {
        throw new Error(response?.message || "Failed to fetch the credit report.");
      }

      if (crifData?.status === "S11") {
        setQuestionnaire({
          userId,
          transactionId: response?.data?.transactionId,
          orderId: crifData?.orderid,
          reportId: crifData?.reportId,
          question: crifData?.question,
          statusDescription: crifData?.statusDesc,
          options: crifData?.optionsList || [],
          customerId,
          applicationId,
          customerType: user.role,
          bureauName: request.bureau_name,
          companyId: request.company_id,
          productName: request.product_name,
          createdBy: request.created_by,
        });
        setSelectedQuestionOption("");
        return;
      }

      if (crifData?.status === "S02") {
        toast.info(crifData?.statusDesc || "CRIF authentication failed.");
        return;
      }

      if(!response?.data?.creditReportLink){
        toast.info("Report not found!")
        return;
      }

      if (response?.data?.creditReportLink) {
        applySoftPullReport(userId, response);
      } else {
        toast.info(
          crifData?.statusDesc ||
            response?.data?.message ||
            response?.message ||
            "Credit report was not generated.",
        );
      }
    } catch (error) {
      console.error("Error fetching credit report:", error);
      setCreditReportError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while fetching the credit report.",
      );
      setUsers((prevUsers) =>
        prevUsers.map((currentUser) =>
          currentUser.id === userId
            ? {
                ...currentUser,
                [pullType]: {
                  ...currentUser[pullType],
                  isGenerating: false,
                },
              }
            : currentUser,
        ),
      );
    } finally {
      setUsers((prevUsers) =>
        prevUsers.map((currentUser) =>
          currentUser.id === userId
            ? {
                ...currentUser,
                [pullType]: { ...currentUser[pullType], isGenerating: false },
              }
            : currentUser,
        ),
      );
    }
  };

  const handleQuestionnaireSubmit = async () => {
    if (!selectedQuestionOption || !questionnaire?.transactionId) {
      toast.info("Please select an answer first.");
      return;
    }

    setIsSubmittingQuestionnaire(true);
    setCreditReportError("");
    try {
      const response = await CrifAuthQuestionnaireReport({
        transaction_id: questionnaire.transactionId,
        orderid: questionnaire.orderId,
        reportId: questionnaire.reportId,
        amsware: selectedQuestionOption.trim(),
        customer_id: questionnaire.customerId,
        application_id: questionnaire.applicationId,
        bureau_name: questionnaire.bureauName,
        credit_type: "SOFT PULL",
        customer_type: questionnaire.customerType,
        step_status: "5",
        company_id: questionnaire.companyId,
        product_name: questionnaire.productName,
        created_by: questionnaire.createdBy,
      });

      const crifData = response?.data?.data;
      if (crifData?.status === "S11") {
        setQuestionnaire((previous) => ({
          ...previous,
          transactionId: response?.data?.transactionId || previous.transactionId,
          orderId: crifData?.orderid || previous.orderId,
          reportId: crifData?.reportId || previous.reportId,
          question: crifData?.question,
          statusDescription: crifData?.statusDesc,
          options: crifData?.optionsList || [],
        }));
        setSelectedQuestionOption("");
        return;
      }

      if (crifData?.status === "S02") {
        setQuestionnaire(null);
        setSelectedQuestionOption("");
        toast.info(crifData?.statusDesc || "CRIF authentication completed.");
        return;
      }

      if (response?.data?.creditReportLink) {
        applySoftPullReport(questionnaire.userId, response);
        setQuestionnaire(null);
        setSelectedQuestionOption("");
        toast.success(response?.data?.message || "Credit report generated successfully.");
        return;
      }

      toast.info(
        crifData?.statusDesc ||
          response?.data?.message ||
          response?.message ||
          "Credit report was not generated.",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit the CRIF authentication answer.";
      setCreditReportError(message);
      toast.error(message);
    } finally {
      setIsSubmittingQuestionnaire(false);
    }
  };

  const handleHardPullFileChange = (userId, file) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              hardPull: {
                ...user.hardPull,
                selectedFile: file,
                uploadError: "",
              },
            }
          : user,
      ),
    );
  };

  const handleHardPullUpload = async (userId) => {
    const user = users.find((currentUser) => currentUser.id === userId);
    const file = user?.hardPull?.selectedFile;
    if (!user || !file) {
      handleHardPullFileError(userId, "Choose a hard-pull report first.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!["pdf", "png", "jpg", "jpeg"].includes(extension)) {
      handleHardPullFileError(userId, "Upload a PDF, JPG, or PNG report.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      handleHardPullFileError(userId, "File size must be under 10 MB.");
      return;
    }

    const marketSurvey = customerDetails?.marketSurvey?.[0] || {};
    const personalKyc = customerDetails?.personalKyc?.[0] || {};
    const loanDetails = customerDetails?.loanDetails?.[0] || {};
    const customerId =
      user.detail?.customer_id ||
      user.profile?.customer_id ||
      customerDetails?.customer_id ||
      marketSurvey.customer_id ||
      personalKyc.customer_id;
    const applicationId =
      user.detail?.application_id ||
      user.detail?.applicantion_id ||
      user.profile?.application_id ||
      customerDetails?.application_id ||
      loanDetails.application_id ||
      marketSurvey.application_id ||
      personalKyc.application_id;

    if (!customerId || !applicationId) {
      handleHardPullFileError(
        userId,
        "Customer ID and application ID are required to upload the report.",
      );
      return;
    }

    setUsers((previousUsers) =>
      previousUsers.map((currentUser) =>
        currentUser.id === userId
          ? {
              ...currentUser,
              hardPull: { ...currentUser.hardPull, isUploading: true, uploadError: "" },
            }
          : currentUser,
      ),
    );

    try {
      const base64Result = await convertFileToBase64(file);
      const documentBase64 = String(base64Result).includes(",")
        ? String(base64Result).slice(String(base64Result).indexOf(",") + 1)
        : base64Result;
      const response = await SaveOtherDocuments({
        id: 0,
        customer_id: customerId,
        application_id: applicationId,
        document_type: `${user.role}_HARD_PULL`,
        document_base64: documentBase64,
        file_extension: extension,
        is_active: true,
        creadted_by: authData.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      });

      if (!response?.status) {
        throw new Error(response?.message || "Unable to save hard-pull report.");
      }

      const savedDocument = response?.data?.document || response?.data?.data || response?.data || {};
      const fileUrl =
        savedDocument.document_path || savedDocument.file_url || savedDocument.url ||
        URL.createObjectURL(file);
      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === userId
            ? {
                ...currentUser,
                hardPull: {
                  ...currentUser.hardPull,
                  fileUrl,
                  fileName: savedDocument.file_name || file.name,
                  generatedDate: savedDocument.created_date || new Date().toLocaleString(),
                  showFile: true,
                  selectedFile: null,
                  isUploading: false,
                  uploadError: "",
                },
              }
            : currentUser,
        ),
      );
      toast.success(`${user.label} hard-pull report uploaded.`);
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Unable to upload hard-pull report.";
      handleHardPullFileError(userId, message);
      toast.error(message);
    } finally {
      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === userId
            ? {
                ...currentUser,
                hardPull: { ...currentUser.hardPull, isUploading: false },
              }
            : currentUser,
        ),
      );
    }
  };

  const handleHardPullFileError = (userId, message) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === userId
          ? { ...user, hardPull: { ...user.hardPull, uploadError: message } }
          : user,
      ),
    );
  };

  const handleDownload = (userId, pullType) => {
    const user = users.find((currentUser) => currentUser.id === userId);
    const pullData = user?.[pullType];
    if (!pullData?.fileUrl) return;
    const link = document.createElement("a");
    link.href = pullData.fileUrl;
    link.download = pullData.fileName || `${user.label}-credit-report`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const handleView = (userId, pullType) => {
    const user = users.find((currentUser) => currentUser.id === userId);
    const pullData = user?.[pullType];
    if (pullData?.fileUrl) {
      window.open(pullData.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleModeChange = (userId, pullType, mode) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              [pullType]: {
                ...user[pullType],
                selectedMode: mode,
              },
            }
          : user,
      ),
    );
  };

  const getScoreColor = (score) => {
    if (score >= 750) return "#10B981";
    if (score >= 700) return "#3B82F6";
    if (score >= 650) return "#F59E0B";
    if (score >= 600) return "#F97316";
    return "#EF4444";
  };

  const getScoreRating = (score) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    if (score >= 600) return "Poor";
    return "Very Poor";
  };

  const getScoreBgColor = (score) => {
    if (score >= 750) return "bg-emerald-50 text-emerald-700";
    if (score >= 700) return "bg-blue-50 text-blue-700";
    if (score >= 650) return "bg-amber-50 text-amber-700";
    if (score >= 600) return "bg-orange-50 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const renderPullSection = (user, pullType) => {
    const pullData = user[pullType];
    const isSoftPull = pullType === "softPull";
    const hasScore = pullData.creditScore !== null;    

    if (!isSoftPull) {
      return (
        <section className="rounded-lg border border-sky-200 bg-sky-50/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Hard Pull</h4>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Upload the consented report for this {user.label.toLowerCase()}.
              </p>
            </div>
            <span className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-sky-700">
              {user.role}
            </span>
          </div>

          {pullData.showFile && pullData.fileUrl && (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2.5">
              <Icon name="RiFileTextLine" size={17} color="#475569" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                {pullData.fileName || "Hard-pull report"}
              </span>
              <button
                type="button"
                onClick={() => handleView(user.id, pullType)}
                className="rounded px-2 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => handleDownload(user.id, pullType)}
                className="rounded px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Download
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={pullData.isUploading}
              onChange={(event) =>
                handleHardPullFileChange(
                  user.id,
                  event.currentTarget.files?.[0] || null,
                )
              }
              className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 file:mr-2 file:rounded file:border-0 file:bg-sky-50 file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-sky-700 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => handleHardPullUpload(user.id)}
              disabled={pullData.isUploading || !pullData.selectedFile}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-sky-700 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pullData.isUploading ? "Uploading..." : "Upload report"}
            </button>
          </div>
          {pullData.selectedFile && (
            <p className="mt-1.5 truncate text-[11px] text-slate-500">
              Selected: {pullData.selectedFile.name}
            </p>
          )}
          {pullData.uploadError && (
            <p role="alert" className="mt-2 text-xs text-rose-600">
              {pullData.uploadError}
            </p>
          )}
        </section>
      );
    }

    return (
      <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
        {/* Header with Pull Type */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {/* <div className={`w-6 h-6 rounded-full ${isSoftPull ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} flex items-center justify-center text-[10px] font-bold`}>
              {isSoftPull ? 'S' : 'H'}
            </div> */}
            <span className={`text-xs font-semibold ${isSoftPull ? 'text-emerald-700' : 'text-blue-700'}`}>
              {isSoftPull ? 'Soft Pull' : 'Hard Pull'}
            </span>
            {hasScore && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold ${getScoreBgColor(pullData.creditScore)}`}>
                {getScoreRating(pullData.creditScore)}
              </span>
            )}
          </div>
          <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-medium text-emerald-700">
            Bureau report
          </span>
        </div>

        {/* Score and Generate Section */}
        <div className="flex items-center gap-2">
          {/* Score Display or Placeholder */}
          <div className="shrink-0">
            {hasScore ? (
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-sm bg-white"
                  style={{ borderColor: getScoreColor(pullData.creditScore) }}
                >
                  <div className="text-center">
                    <span
                      className="text-sm font-bold"
                      style={{ color: getScoreColor(pullData.creditScore) }}
                    >
                      {pullData.creditScore}
                    </span>
                  </div>
                </div>
                {/* {isSoftPull && pullData.lastRefreshed && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-[6px] text-slate-400 bg-white px-1 py-0.5 rounded border border-slate-100">
                      Refreshed: {pullData.lastRefreshed.split(' ').slice(0,2).join(' ')}
                    </span>
                  </div>
                )} */}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-white">
                <span className="text-[8px] text-slate-400 text-center leading-tight">
                  No<br/>Score
                </span>
              </div>
            )}
          </div>

          {/* Right side content */}
          <div className="flex-1 min-w-0">
            {hasScore ? (
              // Show score details and actions
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-800 text-[9px] font-bold uppercase tracking-wider">
                      Generated
                    </p>
                    <p className="text-slate-800 font-medium text-[10px] truncate">
                      {pullData.generatedDate}
                    </p>
                  </div>
                  
                  {/* Refetch button for Soft Pull */}
                  {isSoftPull && (
                    <button
                      onClick={() => handleGenerateCredit(user.id, pullType, true)}
                      disabled={pullData.isGenerating}
                      className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-semibold hover:bg-emerald-200 transition-all flex items-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pullData.isGenerating ? (
                        <>
                          <span className="animate-spin">
                            <Icon name="RiRefreshLine" size={12} color="#065F46" />
                          </span>
                          <span>Refreshing</span>
                        </>
                      ) : (
                        <>
                          <Icon name="RiRefreshLine" size={12} color="#065F46" />
                          <span>Refetch</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {pullData.showFile && pullData.fileUrl && (
                  <div className="flex items-center gap-1 mt-1 pt-1 border-t border-slate-200">
                    <p className="text-slate-700 text-[10px] font-medium truncate flex-1">
                      {pullData.fileName}
                    </p>
                    <button
                      onClick={() => handleView(user.id, pullType)}
                      className="bg-slate-200/80 text-slate-700 px-1.5 py-1 rounded text-[8px] font-medium hover:bg-slate-300 transition-all cursor-pointer"
                    >
                      <Icon name="RiEyeLine" size={12} color="#475569" />
                    </button>
                    <button
                      onClick={() => handleDownload(user.id, pullType)}
                      className="bg-primary text-white px-1.5 py-1 rounded text-[8px] font-medium hover:bg-primary/90 transition-all cursor-pointer"
                    >
                      <Icon name="RiDownloadLine" size={12} color="#FFFFFF" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Show generate controls for hard pull
              <div className="space-y-1.5">
                <SelectInput
                  placeholder="Select Mode"
                  value={pullData.selectedMode}
                  onChange={(e) => handleModeChange(user.id, pullType, e.target.value)}
                  options={[
                        { label: "CRIF", value: "CRIF" },
                        { label: "Experian", value: "EXPERIAN" },
                  ]}
                  className="text-[10px]! py-1! px-2!"
                />
                <Button
                  onClick={() => handleGenerateCredit(user.id, pullType, false)}
                  disabled={pullData.isGenerating || !pullData.selectedMode}
                  style={`w-full ${isSoftPull ? 'bg-primary hover:bg-primary/80' : 'bg-primary hover:bg-primary/80'} cursor-pointer text-white px-2 py-1.5 rounded text-[10px] font-semibold transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pullData.isGenerating ? (
                    <>
                      <span className="animate-spin">
                        <Icon name="RiRefreshLine" size={12} color="#FFFFFF" />
                      </span>
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="RiRefreshLine" size={12} color="#FFFFFF" />
                      <span>Generate Soft Pull</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="py-0 space-y-3">
      {creditReportError && (
        <div role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {creditReportError}
        </div>
      )}
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 hover:shadow-md transition-shadow"
        >
          {/* User Header */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  {user.label}
                  {user.profile.relation && ` · ${user.profile.relation}`}
                </p>
                <p className="text-[10px] text-slate-500">
                  {user.profile.mobile_number
                    ? `Mobile: ${user.profile.mobile_number}`
                    : "Mobile: —"}
                  {user.profile.uid_number &&
                    ` · Aadhaar: ****${user.profile.uid_number.slice(-4)}`}
                </p>
              </div>
            </div>
          </div>

          {/* Two-column layout for Soft and Hard Pull */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-2">
            {/* Soft Pull Section */}
            {renderPullSection(user, 'softPull', 'Soft Pull')}
            
            {/* Hard Pull Section */}
            {renderPullSection(user, 'hardPull', 'Hard Pull')}
          </div>
        </div>
      ))}
      <Modal
        isOpen={Boolean(questionnaire)}
        onClose={() => {
          if (isSubmittingQuestionnaire) return;
          setQuestionnaire(null);
          setSelectedQuestionOption("");
        }}
        title={questionnaire?.statusDescription || "CRIF Authentication"}
        description="Answer the bureau security question to continue the soft pull."
      >
        <div className="space-y-4 p-5">
          <p className="text-sm font-semibold text-slate-800">
            {questionnaire?.question || "Select the correct answer."}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(questionnaire?.options || []).map((option, index) => {
              const value = String(option).trim();
              const isSelected = selectedQuestionOption === value;
              return (
                <button
                  key={`${value}-${index}`}
                  type="button"
                  disabled={isSubmittingQuestionnaire}
                  onClick={() => setSelectedQuestionOption(value)}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    isSelected
                      ? "border-primary-600 bg-primary-50 text-primary-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary-300"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        isSelected ? "border-primary-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-primary-600" />}
                    </span>
                    <span>{value}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={isSubmittingQuestionnaire}
              onClick={() => {
                setQuestionnaire(null);
                setSelectedQuestionOption("");
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedQuestionOption || isSubmittingQuestionnaire}
              onClick={handleQuestionnaireSubmit}
              className="rounded-lg bg-primary-700 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingQuestionnaire ? "Submitting..." : "Submit answer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreditSection;