import React, { useEffect, useRef, useState } from "react";
import {
  RiBankLine,
  RiUserLine,
  RiPhoneLine,
  RiBankCardLine,
  RiFileChartLine,
  RiRefreshLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { useAuthData } from "../../context/authContext";
import {
  AccountAggregatorGet,
  AccountAggregatorResult,
  AccountAggregatorUnderwriting,
  RecurringResult,
  RecurringRun,
  RecurringStatus,
} from "../../api/kycApi";
import { useSearchParams } from "react-router-dom";
import { IoMdRefresh } from "react-icons/io";
import Loader from "../utils/Loader";
import { showValidationError } from "../utils/common";
import { downloadZipFromUrl } from "../utils/downloadZipFromUrl";
import { SettingStatus } from "../../api/userApi";

const AccountAggregator = ({
  userData = {},
  customerDetailsData,
  fetchData,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [Verifying, setVerifying] = useState(false);
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");
  const { authData } = useAuthData();

  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer_id");
  const applicationId = searchParams.get("application_id");

  const requestedAccountRef = useRef([]);

  const isPostPDStep =
    customerDetailsData?.workflowNodes?.[0]?.app_form_status === 3;

  const fetchAccountAggregatorResult = async () => {
    try {
      const req = {
        customer_id: userData?.customerId,
        application_id: userData?.applicationId,
        mobile_number: userData?.mobile,
        pan_no: userData?.pan,
        consent_type: "",
      };
      const response = await AccountAggregatorGet(req);
      if (response.status) {
        setReport(response.data);
      }
    } catch (error) {
      showValidationError(error);
    }
  };

  // const fetchRecurringResult = async (req) => {
  //   const reqId = req?.data.requestId;
  //   try {
  //     const req = {
  //       customer_id: customerId,
  //       application_id: applicationId,
  //       company_id: import.meta.env.VITE_COMPANY_ID,
  //       product_name: import.meta.env.VITE_PRODUCT_NAME,
  //       created_by: authData?.user_id,
  //       current_requestId: reqId,
  //     };
  //     const response = await RecurringResult(req)
  //   } catch (error) {
  //     showValidationError(error)
  //   }
  // }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const fetchRecurringStatus = async (id) => {
    try {
      const req = {
        customer_id: customerId,
        application_id: applicationId,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        created_by: authData?.user_id,
        current_requestId: id,
      };
      for (let attempt = 1; attempt <= 5; attempt++) {
        await delay(10000);
        const response = await RecurringStatus(req);
        if (response.status && response.data.state.state == "SUCCESS") {
          toast.success("Recuring Success")
          return response;
        }else if(response.data.state.state == "FAILED"){
          toast.info("Recuring failed!")
        }
      }
      return false
    } catch (error) {
      showValidationError(error);
    }
  };

  const fetchRecurringResult = async (req) => {
    const reqId = req?.data?.requestId;

    const StatusResponse = await fetchRecurringStatus(reqId)
    if(!StatusResponse){
      toast.info("Reccuring under process!")
      setFetching(false)
      return;
    }

    try {
      const payload = {
        customer_id: customerId,
        application_id: applicationId,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        created_by: authData?.user_id,
        current_requestId: reqId,
      };

      const response = await RecurringResult(payload);
      if (response?.status) {
        return response;
      }
    } catch (error) {
      showValidationError(error);
    }
  };

  // CAN HIT ONCE A DAY
  const handleUpdateBalance = async (acc) => {
    const CT035_ID = report
      ?.filter((d) => d?.request_id == acc?.request_id)
      ?.find((c_id) => c_id?.consent_type == "CT035");
    console.log(CT035_ID);

    try {
      setFetching(true)
      const req = {
        customer_id: userData?.customerId,
        application_id: userData?.applicationId,
        mobile_number: userData?.mobile,
        pan_no: userData?.pan,
        consent_type: "",
        company_id: "LOS",
        product_name: "LOS",
        created_by: authData?.user_id,
        consentHandle: CT035_ID?.consent_handle_id,
      };

      const response = await RecurringRun(req);
      if (response.status && response?.data?.requestId) {
        // toast.success(response?.message || "Recurring success.");
        await fetchRecurringResult(response);
        fetchAccountAggregatorResult();
      } else {
        toast.info(response?.message || "Recurring failed!");
      }
    } catch (error) {
      showValidationError(error);
    }finally{
      setFetching(false)
    }
  };

  // CAN HIT 5 TIMES A MONTH OR A DAY
  const handleReccuringReport = async (acc) => {
    const CT003_ID = report
      ?.filter((d) => d?.request_id == acc?.request_id)
      ?.find((c_id) => c_id?.consent_type == "CT003");
    console.log(CT003_ID);

    try {
      setFetching(true)
      const req = {
        customer_id: userData?.customerId,
        application_id: userData?.applicationId,
        mobile_number: userData?.mobile,
        pan_no: userData?.pan,
        consent_type: "",
        company_id: "LOS",
        product_name: "LOS",
        created_by: authData?.user_id,
        consentHandle: CT003_ID?.consent_handle_id,
      };

      const response = await RecurringRun(req);
      if (response.status && response?.data?.requestId) {
        // toast.success(response?.message || "Recurring success.");
        await fetchRecurringResult(response);
        fetchAccountAggregatorResult();
      } else {
        toast.info(response?.message || "Recurring failed!");
      }
    } catch (error) {
      showValidationError(error);
    }finally{
      setFetching(false)
    }
  };

  useEffect(() => {
    fetchAccountAggregatorResult();
  }, []);

  // const handleDownloadReport = (account) => {
  //   if (!account?.pdf_link) {
  //     toast.info("Report download is not available for this account yet.");
  //     return;
  //   }

  //   window.open(account.pdf_link, "_blank", "noopener,noreferrer");
  // };

  const handleDownloadReport = async (file) => {
    try {
      await downloadZipFromUrl(file?.pdf_link, {
        downloadAll: false,
        onSuccess: (files) => {
          console.log("Files extracted:", files);
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetReport = async () => {
    try {
      setLoading(true);
      setError("");
      const request = {
        customer_id: userData?.customerId,
        application_id: userData?.applicationId,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        step_status: "2",
        created_by: authData?.user_id,
        mobile_number: userData?.mobile,
        pan_no: userData?.pan,
        dob: userData?.dob,
        redirect_url: `${location.href}`,
        // redirect_url: `https://finarkein.com`,
      };

      const response = await AccountAggregatorUnderwriting(request);
      console.log(response);

      // const response = await getAccountAggregatorReport?.(userData);
      // const response = aggres;
      if (response.status && response?.data?.status) {
        const requestIdData = {
          requestId: response?.data?.data?.requestId,
          customerId: userData?.customerId,
        };
        localStorage.setItem("requestId", JSON.stringify(requestIdData));
        location.href = response?.data?.data?.redirectUrl;
      } else {
        toast.info(response.message);
      }
    } catch (err) {
      console.error("Account Aggregator Error:", err);
      toast.error(showValidationError(error));
      setError(
        err?.response?.data?.message ||
          "Unable to generate Account Aggregator report.",
      );
    } finally {
      setLoading(false);
    }
  };

  // const account = report?.data?.[0];
  // const accounts = Array.isArray(report) ? report : [];

  // const accounts = Array.isArray(report)
  //   ? report
  //       .filter((account) => account.consent_type === "CT001")
  //       .sort(
  //         (a, b) =>
  //           new Date(b.created_datetime || 0) -
  //           new Date(a.created_datetime || 0),
  //       )
  //   :
  //     [];

  // GETTING ACCOUNTS ON CONDITIONAL

  const hasAccountData = (account) => {
    return Boolean(
      account?.bank_name ||
      account?.masked_acc_number ||
      account?.ifsc_code ||
      account?.current_balance ||
      account?.pdf_link,
    );
  };

  const getUpdatedTime = (account) => {
    const date = new Date(
      account?.updated_datetime || account?.created_datetime || 0,
    );

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  };

  const accounts = Array.isArray(report)
    ? report
        .filter((account) => account.consent_type === "CT001")
        .map((ct001) => {
          // Find CT003 and CT035 for the same request/account
          const updatedAccounts = report.filter((item) => {
            const isRecurringType = ["CT003", "CT035"].includes(
              item?.consent_type,
            );

            const sameRequest = item?.request_id === ct001?.request_id;

            const sameAccount =
              !item?.fnrk_account_id ||
              !ct001?.fnrk_account_id ||
              item?.fnrk_account_id === ct001?.fnrk_account_id;

            return (
              isRecurringType &&
              sameRequest &&
              sameAccount &&
              hasAccountData(item)
            );
          });

          // Latest updated CT003 / CT035 gets priority
          updatedAccounts.sort((a, b) => getUpdatedTime(b) - getUpdatedTime(a));

          // Otherwise use CT001
          return updatedAccounts[0] || ct001;
        })
        .sort((a, b) => getUpdatedTime(b) - getUpdatedTime(a))
    : [];

  const fetchAllAccountAggregatorResult = async (req) => {
    try {
      const response = await AccountAggregatorResult(req);
      await fetchAccountAggregatorResult();
      console.log("Account Aggregator Result:", response);
    } catch (error) {
      showValidationError(error);
    }
  };

  useEffect(() => {
    const accounts = Array.isArray(report)
      ? report.filter((account) => account.consent_type === "CT001")
      : [];
    if (!Array.isArray(accounts) || accounts.length === 0) return;

    const ct001Accounts = accounts.filter(
      (account) =>
        account.consent_type === "CT001" && account.state === "INPROGRESS",
    );

    ct001Accounts.forEach((account) => {
      const requestId = account.request_id;

      if (!requestId || requestedAccountRef.current.includes(requestId)) {
        return;
      }

      requestedAccountRef.current.push(requestId);

      const payload = {
        customer_id: customerId,
        application_id: applicationId,
        current_requestId: requestId,
        step_status: "0",
        company_id: "LOS",
        product_name: "LOS",
        created_by: authData?.user_id,
      };

      fetchAllAccountAggregatorResult(payload);
    });
  }, [accounts]);

  const handleAggregatorVerified = async () => {
    try {
      setVerifying(true);
      const req = {
        customer_id: customerId,
        application_id: applicationId,
        type: "AGGREGATOR",
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

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "₹0";

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  if(fetching){
    return <Loader />
  }

  return (
    <>
      <div className="space-y-5">
        {/* Applicant Information */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Applicant Information
              </h3>

              <p className="mt-1 text-[12px] text-gray-500">
                Customer information for Account Aggregator
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RiUserLine size={15} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              icon={<RiUserLine />}
              label="Name"
              value={userData?.name || "-"}
            />
            <InfoItem
              icon={<RiPhoneLine />}
              label="Mobile Number"
              value={userData?.mobile || "-"}
            />
            <InfoItem
              icon={<RiBankCardLine />}
              label="PAN Number"
              value={userData?.pan || "-"}
            />
            <InfoItem
              icon={<RiBankCardLine />}
              label="Customer ID"
              value={userData?.customerId || "-"}
            />
          </div>

          <div className="flex justify-end border-t border-gray-100 px-5 py-4">
            <button
              type="button"
              onClick={handleGetReport}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RiRefreshLine size={17} className="animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <RiFileChartLine size={17} />
                  Get Consent
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Account Aggregator Report */}
        {accounts.length > 0
          ? accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <RiBankLine size={17} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-800">
                        {account.bank_name || "Bank Account"}
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Consent Type: {account.consent_type || "-"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      account.data_fetch_status === "SUCCESS"
                        ? "bg-green-50 text-green-600"
                        : account.data_fetch_status === "INPROGRESS"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {account.data_fetch_status || account.state || "Pending"}
                  </span>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-3 px-4 py-3 sm:grid-cols-3 lg:grid-cols-4">
                  <InfoItem
                    label="Bank Name"
                    value={account.bank_name || "-"}
                  />
                  <InfoItem
                    label="Account Number"
                    value={account.masked_acc_number || "-"}
                  />
                  <InfoItem
                    label="IFSC Code"
                    value={account.ifsc_code || "-"}
                  />
                  {/* <InfoItem
            label="Consent Type"
            value={account.consent_type || "-"}
          /> */}
                  <InfoItem
                    label="Consent Status"
                    value={account.consent_status || "-"}
                  />
                  <InfoItem
                    label="Current Balance"
                    value={
                      account.current_balance !== "" &&
                      account.current_balance != null
                        ? formatAmount(account.current_balance)
                        : "-"
                    }
                    highlight
                  />
                  <InfoItem
                    label="Data Fetch Status"
                    value={account.data_fetch_status || "-"}
                  />
                  <InfoItem
                    label="Created Date"
                    value={account.created_datetime || "-"}
                  />
                  <InfoItem
                    label="Concent Type"
                    value={
                      account.consent_type == "CT001"
                        ? "CONCENT DATA"
                        : account.consent_type == "CT035"
                          ? "UPDATED BALANCE"
                          : account.consent_type == "CT003"
                            ? "RECURING DATA"
                            : "-"
                    }
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t border-gray-100 px-4 py-2.5">
                  {/* {isPostPDStep && ( */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateBalance(account)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary border border-dashed border-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-800 hover:text-white disabled:opacity-60"
                      >
                        <IoMdRefresh size={14} />
                        Update Balance
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReccuringReport(account)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 border border-dashed border-primary px-3 py-2 text-xs font-medium text-white hover:bg-gray-600 hover:text-white disabled:opacity-60"
                      >
                        <IoMdRefresh size={14} />
                        Recuring
                      </button>
                    </div>
                  {/* )} */}

                  <button
                    type="button"
                    onClick={() => handleDownloadReport(account)}
                    disabled={loading || !account.pdf_link}
                    className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-primary px-3 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-white disabled:opacity-60"
                  >
                    <RiFileChartLine size={14} />
                    Download Report
                  </button>
                </div>
              </div>
            ))
          : !loading && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-xs text-gray-500">
                No Account Aggregator records found.
              </div>
            )}
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={handleAggregatorVerified}
          disabled={Verifying}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {Verifying ? (
            <>
              <RiRefreshLine size={17} className="animate-spin" />
              Proceeding...
            </>
          ) : (
            <>
              <RiFileChartLine size={17} />
              Proceed Next
            </>
          )}
        </button>
      </div>
    </>
  );
};

const InfoItem = ({ icon, label, value, highlight = false }) => {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-gray-500">
        {icon && <span className="text-primary">{icon}</span>}
        <span>{label}</span>
      </div>

      <p
        className={`truncate text-sm font-semibold ${
          highlight ? "text-primary" : "text-gray-800"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, positive, negative }) => {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <span className="text-primary">{icon}</span>
        {label}
      </div>

      <p
        className={`text-base font-semibold ${
          positive
            ? "text-green-600"
            : negative
              ? "text-red-600"
              : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default AccountAggregator;
