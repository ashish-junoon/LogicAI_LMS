import { useState } from "react";
import Icon from "../utils/Icon";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import { CreditReport } from "../../api/kycApi";

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

  return participants.map(({ role, label, profile, creditRecord }, index) => {
    const record = creditRecord || {};
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
        creditScore: null,
        generatedDate: null,
        fileUrl: null,
        fileName: null,
        showFile: false,
        isGenerating: false,
        selectedMode: "",
      },
    };
  });
};

const CreditSection = ({ creditDetails, customerDetails }) => {
  const [users, setUsers] = useState(() =>
    createUsers(creditDetails, customerDetails),
  );
  const [creditReportError, setCreditReportError] = useState("");

  const handleGenerateCredit = async (userId, pullType) => {
    if (pullType !== "softPull") return;

    const user = users.find((currentUser) => currentUser.id === userId);
    if (!user) return;

    const marketSurvey = customerDetails?.marketSurvey?.[0] || {};
    const personalKyc = customerDetails?.personalKyc?.[0] || {};
    const loanDetails = customerDetails?.loanDetails?.[0] || {};
    const fullName = user.profile.full_name || "";
    const nameParts = fullName.trim().split(/\s+/);
    const profileUid =
      user.role === "CO-BORROWER"
        ? customerDetails?.coBorrowerGuarantor?.[0]?.co_borrower_aahaar_number
        : user.role === "GUARANTOR"
          ? customerDetails?.coBorrowerGuarantor?.[0]?.guarantor_aahaar_number
          : personalKyc.uid_number;
    const profileMobile =
      user.role === "CO-BORROWER"
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
      const response = await CreditReport({
        customer_id: customerId,
        application_id: applicationId,
        first_name:
          user.detail?.first_name || nameParts[0] || "",
        last_name:
          user.detail?.last_name ||
          nameParts.slice(1).join(" "),
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
        created_by:
          user.detail?.created_by ||
          marketSurvey.created_by ||
          localStorage.getItem("username") ||
          localStorage.getItem("userName") ||
          localStorage.getItem("email") ||
          "admin",
      });
      if (response?.status === false) {
        throw new Error(response?.message || "Failed to fetch the credit report.");
      }

      const report =
        response?.data?.cibilDetails?.[0] ||
        response?.data?.data ||
        (Array.isArray(response?.data) ? response.data[0] : response?.data) ||
        response;
      const rawScore =
        report?.credit_score ?? report?.creditScore ?? report?.score;
      const parsedScore = Number(rawScore);
      const hasScore =
        rawScore !== null &&
        rawScore !== undefined &&
        rawScore !== "" &&
        Number.isFinite(parsedScore);
      const fileUrl =
        report?.credit_report_link ||
        report?.file_url ||
        report?.report_url ||
        report?.pdf_url ||
        report?.url ||
        null;
      const generatedDate =
        report?.request_date ||
        report?.generated_date ||
        report?.generatedDate ||
        null;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                [pullType]: {
                  ...user[pullType],
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
    }
  };

  const handleDownload = (userId, pullType) => {
    const user = users.find(u => u.id === userId);
    const pullData = user[pullType];
    alert(`Downloading ${pullType === 'softPull' ? 'Soft Pull' : 'Hard Pull'} report for ${user.name}...\nFile: ${pullData.fileName}`);
  };

  const handleView = (userId, pullType) => {
    const user = users.find(u => u.id === userId);
    const pullData = user[pullType];
    alert(`Opening ${pullType === 'softPull' ? 'Soft Pull' : 'Hard Pull'} report for ${user.name}...\nFile: ${pullData.fileName}`);
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
    const isSoftPull = pullType === 'softPull';
    const hasScore = pullData.creditScore !== null;

    return (
      <div className={`border ${isSoftPull ? 'border-emerald-200 bg-emerald-50/30' : 'border-blue-200 bg-blue-50/30'} rounded-lg p-3`}>
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
          {!isSoftPull && (
            <span className="text-[8px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Requires Consent
            </span>
          )}
        </div>

        {/* Score and Generate Section */}
        <div className="flex items-center gap-2">
          {/* Score Display or Placeholder */}
          <div className="flex-shrink-0">
            {hasScore ? (
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full border-[4px] flex items-center justify-center shadow-sm bg-white"
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
                      <span>Refetch</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default CreditSection;