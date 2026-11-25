import { useState } from "react";
import {
  RiBankCardLine,
  RiFileDownloadLine,
  RiRefreshLine,
} from "react-icons/ri";
// import {
//   CreditReport,
//   CrifAuthQuestionnaireReport,
// } from "../../api/kycVerificationApi";
import AuthDataContext, { useAuthData } from "../../context/authContext";
import { toast } from "react-toastify";
// import Modal from "../../components/ui/Modal";
// import { showValidationError } from "../../utils/common";
import { CreditReport, CrifAuthQuestionnaireReport } from "../../api/kycApi";
import { showValidationError } from "../utils/common";
import Modal from "../utils/Modal";

const creditData = {
  score: 765,
  totalAccounts: 8,
  activeAccounts: 4,
  creditUtilization: 32,
  paymentHistory: "100%",
  totalOutstanding: 450000,
};

const BUREAUS = [
  { value: "cibil", label: "CIBIL" },
  { value: "experian", label: "Experian" },
  { value: "transunion", label: "TransUnion" },
];

const getScoreTone = (score) => {
  if (score >= 750)
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-200",
      label: "Excellent",
    };
  if (score >= 700)
    return {
      text: "text-primary-700",
      bg: "bg-primary-50",
      ring: "ring-primary-200",
      label: "Good",
    };
  if (score >= 650)
    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-200",
      label: "Fair",
    };
  return {
    text: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    label: "Poor",
  };
};

/* ---------- Score card ---------- */

const CreditScoreCard = ({ report, customerType, customerTypeLabel }) => {
  // Gracefully handle a missing report so this card still renders
  // (shows N/A placeholders) for co-borrower / guarantor without a score.
  const safeReport = report || {};

  const score = Number(safeReport.credit_score);
  const hasScore =
    safeReport.credit_score !== null &&
    safeReport.credit_score !== undefined &&
    safeReport.credit_score !== "";

  const tone = hasScore ? getScoreTone(score) : null;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date.replace(" ", "T"));

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Header label: prefer the value on the report, else the caller-provided
  // friendly label (e.g. "Co-Borrower"), else N/A.
  const headerLabel = (
    safeReport.customer_type ||
    customerTypeLabel ||
    customerType ||
    "N/A"
  ).replaceAll("_", " ");

  return (
    <div className="rounded-xl border border-ink-300 bg-white overflow-hidden">
      <div className="px-4 py-3 bg-ink-200 border-b border-ink-100 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink-900 capitalize">
            {headerLabel}
          </h3>

          <p className="text-[11px] text-ink-400 mt-0.5">Credit Report</p>
        </div>

        <RiBankCardLine className="text-primary-700" size={21} />
      </div>

      <div className="p-4 space-y-4">
        {/* Bureau and Score */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                Bureau
              </p>
              <p className="text-sm font-semibold text-ink-800 mt-1">
                {safeReport.bureau_name || "—"}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                Customer Name
              </p>
              <p className="text-sm font-semibold text-ink-800 mt-0">
                {`${safeReport.applicant_first_name ? safeReport.applicant_first_name : "—"} ${safeReport.applicant_last_name ? safeReport.applicant_last_name : ""}` ||
                  "—"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              Credit Score
            </p>

            {hasScore ? (
              <>
                <p className={`text-2xl font-bold mt-0.5 ${tone.text}`}>
                  {safeReport.credit_score}
                </p>
                <span
                  className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tone.bg} ${tone.text}`}
                >
                  {tone.label}
                </span>
              </>
            ) : (
              <p className="text-sm font-semibold text-ink-400 mt-1">—</p>
            )}
          </div>
        </div>

        <div className="border-t border-ink-100 pt-3 space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              Request Date
            </p>
            <p className="text-xs font-medium text-ink-700 mt-1">
              {formatDate(safeReport.request_date)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              Credit Type
            </p>
            <p className="text-xs font-medium text-ink-700 mt-1">
              {safeReport.credit_type || "—"}
            </p>
          </div>
        </div>

        {safeReport.credit_report_link ? (
          <a
            href={safeReport.credit_report_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold py-2.5 transition-colors"
          >
            <RiFileDownloadLine size={15} />
            View / Download Report
          </a>
        ) : (
          <div className="text-center rounded-lg bg-ink-50 text-ink-400 text-xs py-2.5">
            Report link not available
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Stat tile ---------- */

const StatTile = ({ label, value, hint, accent }) => (
  <div className="rounded-lg border border-ink-100 px-3 py-2.5 bg-white">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
      {label}
    </p>
    <p className={`text-sm font-semibold mt-0.5 ${accent || "text-ink-800"}`}>
      {value}
    </p>
    {hint && <p className="text-[10px] text-ink-400 mt-0.5">{hint}</p>}
  </div>
);

/* ---------- Main ---------- */

const CreditAnalysis = ({ data = {}, fetchData }) => {
  const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);
  const [fetchCustomerType, setFetchCustomerType] = useState("BORROWER");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [QuesionareData, setQuesionareData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] =
    useState(false);
  const { authData } = useAuthData();

  const ApplicationId = data?.workflowNodes?.[0]?.application_id;
  const customerId = data?.workflowNodes?.[0]?.customer_id;

  const customerTypes = [
    { value: "BORROWER", label: "Borrower" },
    { value: "CO_BORROWER", label: "Co-Borrower" },
    { value: "GUARANTOR", label: "Guarantor" },
  ];

  const cibilDetails = Array.isArray(data?.cibilDetails)
    ? data.cibilDetails
    : [];

  const personOrder = {
    BORROWER: 0,
    "CO BORROWER": 1,
    CO_BORROWER: 1, // API returns underscore form; keep both for safety
    GUARANTOR: 2,
  };

  const reports = [...cibilDetails].sort(
    (a, b) =>
      (personOrder[a.customer_type] ?? 99) -
      (personOrder[b.customer_type] ?? 99),
  );

  const splitFullName = (fullName = "") => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    return {
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || parts[0] || "",
    };
  };

  // const handleFetchScore = async () => {
  //   setFetchError("");
  //
  //   try {
  //     setIsLoading(true);
  //
  //     const personalKyc = data?.personalKyc?.[0] || {};
  //     const marketSurvey = data?.marketSurvey?.[0] || {};
  //     const coBorrowerGuarantor = data?.coBorrowerGuarantor?.[0] || {};
  //     const workflow = data?.workflowNodes?.[0] || {};
  //
  //     let applicant = {};
  //
  //     switch (fetchCustomerType) {
  //       case "BORROWER": {
  //         applicant = {
  //           // ...splitFullName(personalKyc?.full_name),
  //           // uid_number: personalKyc?.uid_number || "",
  //           // mobile_number: marketSurvey?.business_owner_mobile_no || "",
  //
  //           first_name: "Jitendra",
  //           last_name: "Kumar",
  //           uid_number: "BMOPK8977K",
  //           mobile_number: "9170734822",
  //         };
  //         break;
  //       }
  //
  //       case "CO_BORROWER": {
  //         applicant = {
  //           ...splitFullName(coBorrowerGuarantor?.co_borrower_name),
  //           uid_number: coBorrowerGuarantor?.co_borrower_aahaar_number || "",
  //           mobile_number: coBorrowerGuarantor?.co_borrower_mobile || "",
  //
  //           // first_name: "ROHIT",
  //           // last_name: "K",
  //           // uid_number: "EMNPR6323E",
  //           // mobile_number: "9582207407",
  //         };
  //         break;
  //       }
  //
  //       case "GUARANTOR": {
  //         applicant = {
  //           ...splitFullName(coBorrowerGuarantor?.guarantor_name),
  //           uid_number: coBorrowerGuarantor?.guarantor_aahaar_number || "",
  //           mobile_number: coBorrowerGuarantor?.guarantor_mobile || "",
  //         };
  //         break;
  //       }
  //
  //       default:
  //         throw new Error("Please select a valid applicant type.");
  //     }
  //
  //     if (!applicant.first_name || !applicant.mobile_number) {
  //       throw new Error("Applicant name or mobile number is missing.");
  //     }
  //
  //     const payload = {
  //       customer_id: customerId,
  //       application_id: ApplicationId,
  //       ...applicant,
  //       bureau_name: "CRIF",
  //       credit_type: "SOFT PULL",
  //       customer_type: fetchCustomerType,
  //       company_id: import.meta.env.VITE_COMPANY_ID,
  //       product_name: import.meta.env.VITE_PRODUCT_NAME,
  //       created_by: authData?.user_id || "USR_0001",
  //       step_status: "3"
  //     };
  //
  //     const response = await CreditReport(payload);
  //
  //     if (response?.status) {
  //       fetchData()
  //       setIsFetchModalOpen(false);
  //     } else {
  //       toast.info(
  //         response?.message ||
  //           response?.data?.message ||
  //           "Failed to fetch credit score.",
  //       );
  //     }
  //   } catch (error) {
  //     setFetchError(
  //       error?.response?.data?.message ||
  //         error?.message ||
  //         "Failed to fetch credit score. Please try again.",
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFetchScore = async () => {
    setFetchError("");

    try {
      setIsLoading(true);
      const personalKyc = data?.personalKyc?.[0] || {};
      const coBorrowerGuarantor = data?.coBorrowerGuarantor?.[0] || {};
      const marketSurvey = data?.marketSurvey?.[0] || {};

      let applicant = {};

      switch (fetchCustomerType) {
        case "BORROWER": {
          applicant = {
            ...splitFullName(personalKyc?.full_name),
            uid_number: personalKyc?.pan_number || "",
            mobile_number: marketSurvey?.business_owner_mobile_no || "",

            // first_name: "Jitendra",
            // last_name: "Kumar",
            // uid_number: "BMOPK8977K",
            // mobile_number: "9170734822",
          };
          break;
        }

        case "CO_BORROWER": {
          applicant = {
            ...splitFullName(coBorrowerGuarantor?.co_borrower_name),
            uid_number: coBorrowerGuarantor?.co_borrower_pan || "",
            mobile_number: coBorrowerGuarantor?.co_borrower_mobile || "",
          };
          break;
        }

        case "GUARANTOR": {
          applicant = {
            ...splitFullName(coBorrowerGuarantor?.guarantor_name),
            uid_number: coBorrowerGuarantor?.guarantor_pan || "",
            mobile_number: coBorrowerGuarantor?.guarantor_mobile || "",
          };
          break;
        }

        default:
          throw new Error("Please select a valid applicant type.");
      }

      if (!applicant.first_name || !applicant.mobile_number) {
        throw new Error("Applicant name or mobile number is missing.");
      }

      const payload = {
        customer_id: customerId,
        application_id: ApplicationId,
        ...applicant,
        bureau_name: "CRIF",
        credit_type: "SOFT PULL",
        customer_type: fetchCustomerType,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        created_by: authData?.user_id || "USR_0001",
        step_status: "3",
      };

      const response = await CreditReport(payload);

      // Handle both normal and nested API response structures
      if (response?.data?.data?.status === "S11") {
        setQuesionareData({
          TransactionId: response?.data?.transactionId,
          Data: {
            orderId: response?.data?.data?.orderid,
            reportId: response?.data?.data?.reportId,
            question: response?.data?.data?.question,
            statusDesc: response?.data?.data?.statusDesc,
            optionsList: response?.data?.data?.optionsList || [],
          },
        });

        setSelectedOption(null);
        setIsQuestionnaireModalOpen(true);
        return;
      } else if (response?.data?.data?.status === "S02") {
        setIsQuestionnaireModalOpen(false);
        setQuesionareData(null);
        setSelectedOption(null);
        toast.info(
          response?.data?.data?.statusDesc ||
            response?.data?.message ||
            response?.message ||
            "CRIF authentication failed!.",
        );
        return;
      } else if (response.status && !response.data.creditReportLink) {
        toast.info("Report not generated!");
      } else if (response.status && response.data.creditReportLink) {
        toast.success(response.message);
        fetchData?.();
        setIsFetchModalOpen(false);
      } else {
        toast.info(
          response?.data?.data?.statusDesc ||
            response?.data?.message ||
            response?.message ||
            "Failed to fetch credit score.",
        );
        setQuesionareData({});
      }
    } catch (error) {
      // Some APIs return S11 inside an HTTP error response.
      showValidationError(error);
      setFetchError(
        error ||
          error?.message ||
          "Failed to fetch credit score. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async () => {
    console.log(QuesionareData);

    if (!selectedOption?.option || !QuesionareData?.TransactionId) {
      toast.info("Please select a bank or institution.");
      return;
    }

    setIsSubmiting(true);

    try {
      const payload = {
        transaction_id: QuesionareData.TransactionId,
        orderid: QuesionareData.Data.orderId,
        amsware: selectedOption.option.trim(),

        customer_id: customerId,
        application_id: ApplicationId,
        bureau_name: "CRIF",
        credit_type: "SOFT PULL",
        customer_type: fetchCustomerType,
        step_status: "3",
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        created_by: authData?.user_id || "USR_0001",
      };

      const response = await CrifAuthQuestionnaireReport(payload);

      // CRIF requests another authentication question
      if (response?.data?.data?.status === "S11") {
        setQuesionareData((previous) => ({
          ...previous,
          TransactionId:
            response?.data?.transactionId ?? previous?.TransactionId,
          Data: {
            ...previous?.Data,
            orderId: response?.data?.data?.orderid,
            reportId: response?.data?.data?.reportId,
            question: response?.data?.data?.question,
            optionsList: response?.data?.data?.optionsList || [],
          },
        }));
        setSelectedOption(null);
        return;
      }

      // Authentication completed without generating a report
      else if (response?.data?.data?.status === "S02") {
        setIsQuestionnaireModalOpen(false);
        setQuesionareData(null);
        setSelectedOption(null);
        setIsFetchModalOpen(false);
        toast.info(
          response?.data?.message ||
            response.message ||
            "CRIF authentication completed.",
        );
        return;
      } else if (response?.data?.status) {
        setIsQuestionnaireModalOpen(false);
        setQuesionareData(null);
        setSelectedOption(null);
        setIsFetchModalOpen(false);
        await fetchData?.();
        toast.success(
          response?.data?.status || "Credit report fetched successfully.",
        );
        return;
      }

      toast.info(
        response?.data?.message ||
          response?.message ||
          "CRIF authentication response received.",
      );
    } catch (error) {
      showValidationError(error);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* <div className="bg-white rounded-xl border border-ink-100 shadow-card p-4 flex flex-wrap items-center gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-display font-bold text-ink-900">
              Credit Analysis
            </h2>
            <p className="text-xs text-ink-400 mt-0.5">
              View credit reports and fetch updated scores for applicants.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFetchCustomerType("BORROWER");
              setFetchError("");
              setIsFetchModalOpen(true);
            }}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white transition-colors"
          >
            <RiRefreshLine size={14} />
            Fetch Score
          </button>
        </div> */}

        {/* Always render a card per applicant type. If a report exists for that
            customer_type the card binds it, otherwise every field shows N/A. */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customerTypes.map(({ value, label }) => {
            const matchingReport = reports.find(
              (r) =>
                String(r?.customer_type || "")
                  .replaceAll("_", " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .toUpperCase() ===
                String(value)
                  .replaceAll("_", " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .toUpperCase(),
            );

            return (
              <CreditScoreCard
                key={value}
                report={matchingReport}
                customerType={value}
                customerTypeLabel={label}
              />
            );
          })}
        </div>
      </div>

      {isFetchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="border-b border-ink-100 px-5 py-4">
              <h3 className="text-base font-display font-bold text-ink-900">
                Fetch Credit Score
              </h3>
              <p className="mt-1 text-xs text-ink-400">
                Select whose credit score you want to fetch.
              </p>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="fetch-customer-type"
                  className="mb-2 block text-xs font-semibold text-ink-700"
                >
                  Applicant Type
                </label>

                <select
                  id="fetch-customer-type"
                  value={fetchCustomerType}
                  onChange={(e) => {
                    setFetchCustomerType(e.target.value);
                    setFetchError("");
                  }}
                  disabled={isLoading}
                  className="h-11 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-800 outline-none focus:border-primary-500 disabled:opacity-60"
                >
                  {customerTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {fetchError && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
                  {fetchError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setIsFetchModalOpen(false);
                    setFetchError("");
                  }}
                  className="rounded-lg border border-ink-200 px-4 py-2 text-xs font-semibold text-ink-600 hover:bg-ink-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleFetchScore}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RiRefreshLine className="animate-spin" size={14} />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <RiRefreshLine size={14} />
                      Fetch Score
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isQuestionnaireModalOpen}
        onClose={() => {
          if (isSubmiting) return;

          setIsQuestionnaireModalOpen(false);
          setQuesionareData(null);
          setSelectedOption(null);
        }}
        title={QuesionareData?.Data?.statusDesc || "CRIF Authentication"}
      >
        <div className="p-5">
          {QuesionareData?.Data && (
            <>
              {/* Question */}
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-800">
                  {QuesionareData.Data.question}
                </h3>
              </div>

              <p className="text-xs font-medium text-gray-500 my-2">
                Select one option
              </p>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2">
                {QuesionareData.Data.optionsList?.map((option, index) => {
                  const isSelected = selectedOption?.option === option;

                  return (
                    <label
                      key={index}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="crifBank"
                        value={option}
                        checked={isSelected}
                        onChange={() => setSelectedOption({ option })}
                        className="h-4 w-4 shrink-0 accent-primary"
                      />

                      <span
                        className={`text-sm leading-5 ${
                          isSelected
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {option.trim()}
                      </span>

                      {isSelected && (
                        <span className="ml-auto shrink-0 text-primary">
                          <RiBankCardLine size={17} />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={isSubmiting}
              onClick={() => {
                setIsQuestionnaireModalOpen(false);
                setQuesionareData(null);
                setSelectedOption(null);
              }}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedOption?.option || isSubmiting}
              onClick={handleOptionClick}
              className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            >
              {isSubmiting && (
                <RiRefreshLine size={15} className="animate-spin" />
              )}

              {isSubmiting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreditAnalysis;
