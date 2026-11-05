import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../components/utils/Icon";

import { useAuthData } from "../../context/authContext";
import { toast } from "react-toastify";
import {
  RiArrowRightBoxFill,
  RiFileChartLine,
  RiRefreshLine,
} from "react-icons/ri";

import {
  BSA_FlowGet,
  BSA_FlowResult,
  BSA_FlowRun,
  BSA_FlowStatus,
} from "../../api/kycApi";
import { showValidationError, downloadBase64File } from "../utils/common";


const cleanValue = (value) => {
  if (value == null || value === "") return "—";

  return String(value).replace(/^"+|"+$/g, "");
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const BSAReportUrl = ({
  data = {},
  onAnalyze,
  onDownloadReport,
  fetchData,
}) => {
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [BSA_Report, setBSAReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const { authData } = useAuthData();

  const personalKyc = data?.personalKyc?.[0] || {};
  const mobileNo = data?.marketSurvey?.[0]?.business_owner_mobile_no || "";

  const customerName = personalKyc?.full_name;
  const customerId = personalKyc?.customer_id;
  const applicationId = personalKyc?.application_id;

  const documents = Array.isArray(data?.documents)
    ? data.documents.filter((doc) => {
        const type = String(doc?.document_type || "").toLowerCase();
        return type.includes("statement") || type.includes("bank");
      })
    : [];

  const getUrl = (doc) => doc?.document_path;

  const getName = (doc, index) =>
    doc?.document_type || doc?.document_name || `Bank Statement ${index + 1}`;

  const isImage = (url = "") => /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url);

  const availableDocuments = documents.filter((doc) => getUrl(doc));

  // Fetch BSA report when customer/application details are available.
  const fetchBSAReport = async (isMounted) => {
    setIsFetching(true);

    try {
      const payload = {
        customer_id: customerId,
        application_id: applicationId,
        mobile_no: applicationId || "",
      };
      const response = await BSA_FlowGet(payload);
      // console.log("BSA_FlowGet Response:", response);
      // Store response.data directly in state.
      const reportData = response?.data;

      if (isMounted) {
        setBSAReport(reportData || null);

        const hasData = Array.isArray(reportData)
          ? reportData.length > 0
          : !!reportData &&
            typeof reportData === "object" &&
            Object.keys(reportData).length > 0;

        setIsFetched(hasData);
      }
    } catch (error) {
      console.error("BSA_FlowGet Error:", error);

      if (isMounted) {
        setBSAReport(null);
        setIsFetched(false);
      }
    } finally {
      if (isMounted) {
        setIsFetching(false);
      }
    }
  };

  const hasBsaResultData = (response) => {
    const accounts = response?.data?.data?.data?.depositAccounts?.accounts;

    return Array.isArray(accounts) && accounts.length > 0;
  };

  useEffect(() => {
    if (!customerId || !applicationId) {
      setBSAReport(null);
      setIsFetched(false);
      return;
    }

    let isMounted = true;

    fetchBSAReport(isMounted);

    return () => {
      isMounted = false;
    };
  }, [customerId, applicationId, mobileNo]);

  const handleUpdateStatus = async (runId) => {
    try {
      const response = await BSA_FlowStatus({
        customer_id: customerId,
        application_id: applicationId,
        run_id: runId,
        unique_id: runId,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        created_by: authData?.user_id,
      });

      const statusData = response?.data?.data?.[0];

      if (
        response?.status &&
        response?.data?.status &&
        statusData?.bsa_status?.toUpperCase() === "SUCCESS"
      ) {
        // SUCCESS hone par result API call karo,
        // chahe result_state WAITING hi kyon na ho.
        await handleFetchBsaResult(statusData.run_id || runId);
      }
    } catch (error) {
      console.error("BSA Status Error:", error);
      showValidationError(error);
    }
  };

const handleFetchBsaResult = async (runId) => {
  if (!runId) {
    toast.info("BSA Run ID is missing.");
    return;
  }

  try {
    const response = await BSA_FlowResult({
      customer_id: customerId,
      application_id: applicationId,
      runId: runId, // Changed from run_id to runId
      company_id: import.meta.env.VITE_COMPANY_ID,
      product_name: import.meta.env.VITE_PRODUCT_NAME,
      created_by: authData?.user_id,
    });

    if (!response?.status) {
      toast.info(response?.message || "BSA result not available.");
      return;
    }

    if (!hasBsaResultData(response)) {
      toast.info("BSA result is still processing.");
      return;
    }

    const resultData = response?.data?.data?.data;

    setBSAReport(resultData);
  } catch (error) {
    console.error("BSA Result Error:", error);
    showValidationError(error);
  }
};

  const handleFetch = async () => {
    if (!selectedDocument) {
      toast.info("Please select a bank statement.");
      return;
    }

    const payload = {
      customer_id: data?.personalKyc[0]?.customer_id || "",
      application_id: data?.personalKyc[0]?.application_id || "",
      fileurl: selectedDocument?.document_path,
      // fileurl:
      //   "https://lmsapi.junooncapital.com/document/PU19340/PU193403572_BankStatement.pdf",
      fileName: selectedDocument?.document_type,
      filepassword: selectedDocument?.filepassword || "N",
      mobileno: data?.marketSurvey[0]?.business_owner_mobile_no || "",
      emailid: data?.personalKyc[0]?.email_id || "",
      company_id: import.meta.env.VITE_COMPANY_ID,
      product_name: import.meta.env.VITE_PRODUCT_NAME,
      created_by: authData?.user_id,
    };

    if (!payload.fileurl) {
      toast.info("Bank statement file URL is missing.");
      return;
    }

    try {
      setIsFetching(true);
      const response = await BSA_FlowRun(payload);

      if (response?.data?.status && response?.status) {
        // toast.success(response?.data?.message || response?.data?.data?.message || "BSA processing started successfully.");
        setShowFetchModal(false);

        const result = response?.data;
        await handleFetchBsaResult(response?.data?.runId);
      } else {
        toast.info(
          response?.data?.message || "Failed to start BSA processing.",
        );
      }
    } catch (error) {
      console.error("BSA Flow Run error:", error);
      showValidationError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownload = (base64) => {
    if (!base64) {
      toast.info("Report is not available for download.");
      return;
    }

    downloadBase64File(base64, "documents.zip");
  };

  // Handles either an object or an array in response.data.
  // const reportList = useMemo(() => {
  //   const reports = Array.isArray(BSA_Report)
  //     ? BSA_Report
  //     : BSA_Report
  //       ? [BSA_Report]
  //       : [];

  //   return reports
  //     .filter((item) =>
  //       ["SUCCESS", "WAITING", "PENDING"].includes(
  //         String(item?.bsaStatus || "").toUpperCase(),
  //       ),
  //     )
  //     .sort(
  //       (a, b) =>
  //         new Date(b?.updated || b?.created || 0) -
  //         new Date(a?.updated || a?.created || 0),
  //     );
  // }, [BSA_Report]);

  const reportList = useMemo(() => {
    const reports = Array.isArray(BSA_Report)
      ? BSA_Report
      : BSA_Report
        ? [BSA_Report]
        : [];

    return reports
      .filter(
        (item) =>
          ["SUCCESS", "WAITING", "PENDING", "FAILED"].includes(
            String(item?.bsaStatus || "")
              .trim()
              .toUpperCase(),
          ) || !item?.bsaStatus,
      )
      .sort(
        (a, b) =>
          new Date(b?.updatedDate || b?.createdDate || 0).getTime() -
          new Date(a?.updatedDate || a?.createdDate || 0).getTime(),
      );
  }, [BSA_Report]);

  const successReports = reportList.filter(
    (item) => item?.bsaStatus?.toUpperCase() === "SUCCESS",
  );

  const pendingReports = reportList.filter(
    (item) => item?.bsaStatus?.toUpperCase() !== "SUCCESS",
  );

  const handleBSAVerified = async () => {
    try {
      setVerifying(true);
      const req = {
        customer_id: customerId,
        application_id: applicationId,
        type: "BSA",
        status: true,
        created_by: authData?.user_id,
        company_id: import.meta.VITE_COMPANY_ID,
        product_name: import.meta.VITE_PRODUCT_NAME,
      };

      const response = await SettingStatus(req);
      if (response.status) {
        toast.success(response.message || "Application Procceds.");
        fetchData?.();
      } else {
        toast.info(response.message || "Unable to Proceed!");
      }
    } catch (error) {
      showValidationError(error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <div className="space-y-4 py-2">
        {/* Customer Details */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Icon name="RiUser3Line" size={21} color="#2563EB" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Customer Details
              </h3>
              <p className="text-xs text-slate-500">Applicant information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Info label="Customer Name" value={customerName} />
            <Info label="Customer ID" value={customerId} />
            <Info label="Application ID" value={applicationId} />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedDocument(null);
                setShowFetchModal(true);
              }}
              disabled={!availableDocuments.length || isFetching}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="RiDownloadLine" size={16} color="white" />
              Fetch Bank Statement
            </button>
          </div>

          {!availableDocuments.length && (
            <p className="mt-2 text-right text-xs text-slate-500">
              No bank statement documents available.
            </p>
          )}
        </section>

        {/* Bank Account Details */}
        {/* SUCCESS REPORTS */}
        {isFetched && successReports.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Successful Bank Reports
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verified bank statement reports
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                {successReports.length} Success
              </span>
            </div>

            {successReports.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-emerald-50/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Icon name="RiBankLine" size={20} color="#059669" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {item.accountsAccountDetailsFipName || "Bank Account"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.fileName || "Bank Statement"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <Icon name="RiCheckboxCircleFill" size={15} />
                    SUCCESS
                  </span>
                </div>

                <div className="space-y-4 p-4">
                  {/* Account Holder */}
                  {/* <div>
            <p className="text-xs text-slate-500">
              Account Holder Name
            </p>
            <h3 className="mt-1 text-md font-bold text-slate-800">
              {item.accountsAccountHolderName || "—"}
            </h3>
          </div> */}

                  {/* Main Account Information */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Account Holder Name
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {item.accountsAccountHolderName || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Account Number</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {item.accountsAccountDetailsMaskedAccNumber || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-emerald-50 p-3">
                      <p className="text-xs text-emerald-700">
                        Current Balance
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-700">
                        {formatCurrency(
                          cleanValue(item.accountsAccountDetailsCurrentBalance),
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">IFSC Code</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {item.accountsAccountDetailsIfscCode || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Account Status</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {item.accountsAccountDetailsStatus || "—"}
                      </p>
                    </div>

                    <Info label="Mobile Number" value={item.mobileNo} />
                    <Info label="Provider" value={item.provider} />
                    <Info
                      label="Transactions"
                      value={item.accountsStatementMetaNoOfTransactions}
                    />
                    <Info
                      label="Statement From"
                      value={formatDate(
                        cleanValue(item.accountsStatementMetaTransactionStart),
                      )}
                    />
                    <Info
                      label="Statement To"
                      value={formatDate(
                        cleanValue(item.accountsStatementMetaTransactionEnd),
                      )}
                    />
                    <Info label="Created By" value={item.createdBy} />
                  </div>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-xs text-slate-500">Processed On</p>
                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {formatDate(item.updatedDate || item.createdDate)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.fileUrl) {
                            window.open(
                              item.fileUrl,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }
                        }}
                        disabled={!item.fileUrl}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Icon name="RiEyeLine" size={15} />
                        View Statement
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(item.reportasBase64)}
                        disabled={!item.reportasBase64}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <Icon name="RiDownloadLine" size={15} color="white" />
                        Download Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* WAITING / PENDING / FAILED REPORTS */}
        {isFetched && pendingReports.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Other BSA Reports
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Reports currently processing or unsuccessful
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {pendingReports.length} Reports
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Provider",
                      "Mobile Number",
                      "Created By",
                      "Created Date",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-xs font-bold text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {pendingReports.map((item) => {
                    const status = String(
                      item.bsaStatus || "NO STATUS FOUND",
                    ).toUpperCase();

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {item.provider || "—"}
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600">
                          {item.mobileNo || "—"}
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600">
                          {item.createdBy || "—"}
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600">
                          {formatDate(item.createdDate)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              status === "WAITING"
                                ? "bg-amber-100 text-amber-700"
                                : status === "PENDING"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(item.runId);
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-primary hover:bg-primary/90 disabled:opacity-40"
                          >
                            {/* <Icon name="RiEyeLine" size={14} /> */}
                            Check status
                          </button>

                          <button
                            type="button"
                            disabled={!item.fileUrl}
                            onClick={() =>
                              window.open(
                                item.fileUrl,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          >
                            <Icon name="RiEyeLine" size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {isFetched && reportList.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Icon name="RiFileChartLine" size={35} color="#94A3B8" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No BSA Reports Found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Fetch a bank statement to generate a BSA report.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isFetching && (
          <p className="text-right text-xs text-slate-500">
            Loading BSA report...
          </p>
        )}

        {/* Statement Selection Modal */}
        {showFetchModal && (
          <div
            className="fixed inset-0 -top-5 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              if (!isFetching) setShowFetchModal(false);
            }}
          >
            <div
              className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Fetch Bank Statement
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Select one statement to continue.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isFetching}
                  onClick={() => setShowFetchModal(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <Icon name="RiCloseLine" size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {availableDocuments.map((doc) => {
                  const index = documents.indexOf(doc);
                  const url = getUrl(doc);
                  const name = getName(doc, index);
                  const isSelected = selectedDocument === doc;

                  return (
                    <div
                      key={doc?.document_id || doc?.id || index}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="bankStatement"
                        checked={isSelected}
                        disabled={isFetching}
                        onChange={() => setSelectedDocument(doc)}
                        className="h-4 w-4 accent-emerald-600"
                      />

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                        <Icon name="RiFilePdfLine" size={21} color="#DC2626" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Bank statement document
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewDocument({ url, name })}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Icon name="RiEyeLine" size={15} />
                        Preview
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 p-4">
                <button
                  type="button"
                  disabled={isFetching}
                  onClick={() => setShowFetchModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!selectedDocument || isFetching}
                  onClick={handleFetch}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon
                    name={isFetching ? "RiLoader4Line" : "RiDownloadLine"}
                    size={16}
                    color="white"
                  />
                  {isFetching ? "Loading..." : "Fetch Selected Statement"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDocument && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setPreviewDocument(null)}
          >
            <div
              className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
                <h3 className="truncate text-sm font-semibold text-slate-800">
                  {previewDocument.name}
                </h3>

                <button
                  type="button"
                  onClick={() => setPreviewDocument(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <Icon name="RiCloseLine" size={20} />
                </button>
              </div>

              <div className="min-h-[300px] flex-1 overflow-auto bg-slate-100 p-3">
                {isImage(previewDocument.url) ? (
                  <img
                    src={previewDocument.url}
                    alt={previewDocument.name}
                    className="mx-auto max-h-[70vh] max-w-full object-contain"
                  />
                ) : (
                  <iframe
                    src={previewDocument.url}
                    title={previewDocument.name}
                    className="h-[70vh] w-full rounded-lg bg-white"
                  />
                )}
              </div>

              <div className="flex justify-end border-t border-slate-200 p-3">
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      previewDocument.url,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  <Icon name="RiExternalLinkLine" size={15} />
                  Open Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={handleBSAVerified}
          disabled={verifying}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? (
            <>
              <RiRefreshLine size={17} className="animate-spin" />
              Proceeding...
            </>
          ) : (
            <>
              Proceed Next
              <RiArrowRightBoxFill size={17} />
            </>
          )}
        </button>
      </div>
    </>
  );
};
const Info = ({ label, value }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
      {value ?? "—"}
    </p>
  </div>
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default BSAReportUrl;
