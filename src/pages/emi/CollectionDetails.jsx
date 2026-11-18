import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { RiArrowLeftLine } from "react-icons/ri";
import { useAuthData } from "../../context/authContext";
import { showValidationError } from "../../components/utils/common";
import { CustomerDetails } from "../../api/application";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatus = (paid, due) => {
  if (paid <= 0) return "Pending";
  if (paid >= due) return "Paid";
  return "Partial";
};

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Partial: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-slate-50 text-slate-600 border-slate-200",
    Overdue: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
};

const customStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#F8FAFC",
      borderBottomColor: "#E5E7EB",
      minHeight: "38px",
    },
  },
  headCells: {
    style: {
      fontSize: "10px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: "#64748B",
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  rows: {
    style: {
      minHeight: "44px",
      borderBottomColor: "#F1F5F9",
      "&:hover": {
        backgroundColor: "#F8FAFC",
      },
    },
  },
  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  pagination: {
    style: {
      borderTopColor: "#E5E7EB",
      fontSize: "11px",
      color: "#64748B",
      minHeight: "42px",
    },
    pageButtonsStyle: {
      borderRadius: "6px",
      height: "28px",
      width: "28px",
      padding: "4px",
      cursor: "pointer",
      fill: "#64748B",
      "&:disabled": {
        cursor: "unset",
        opacity: 0.4,
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#F1F5F9",
      },
    },
  },
  noData: {
    style: {
      padding: "20px",
      color: "#94A3B8",
      fontSize: "12px",
    },
  },
};

const inputClass =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-xs text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-100";

const labelClass = "mb-1 block text-[11px] font-semibold text-ink-600";

const initialHistory = [
  {
    id: 1,
    date: "2026-09-24",
    amount: 24818,
    mode: "UPI",
    reference: "UPI102490",
    status: "Paid",
    remarks: "September EMI",
  },
  {
    id: 2,
    date: "2026-08-24",
    amount: 15000,
    mode: "Cash",
    reference: "COL102481",
    status: "Partial",
    remarks: "Partial EMI collection",
  },
];

const CollectionDetails = () => {
  const [searchParams] = useSearchParams();
  const { authData } = useAuthData();
  const navigate = useNavigate()

  const location = useLocation();
  const routeLead = location.state?.lead;
  const { customerId, applicationId } = location.state?.pera || {};

  const [history, setHistory] = useState(initialHistory);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState("Partial");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerDetail, setCustomerDetail] = useState({});

  const customer = {
    customer_id: "CU_1159",
    application_id: "AP_10156",
    business_owner_name: "Rajat Kumar",
    contact_person_mobile_no: "9876543210",
    loan_type: "Business Loan",
    loan_amount: 500000,
    emi_amount: 24818,
    total_due: 24818,
    previously_paid: 0,
    due_date: "2026-10-24",
    ...(location.state?.customer || {}),
  };

  const totalDue = Number(customer.total_due) || 0;
  const alreadyPaid = Number(customer.previously_paid) || 0;
  const outstanding = Math.max(totalDue - alreadyPaid, 0);
  const amount = Number(paymentAmount) || 0;
  const remaining = Math.max(outstanding - amount, 0);

  const fetchCustomerDetails = async () => {
    if (!customerId || !applicationId) return;

    try {
      setLoading(true);

      const request = {
        customer_id: customerId,
        application_id: applicationId,
        role: authData?.role,
        created_by: authData?.user_id,
      };

      const response = await CustomerDetails(request);

      if (response.status) {
        setCustomerDetail(response.data);
      }
    } catch (error) {
      showValidationError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId, applicationId]);

  const columns = useMemo(
    () => [
      {
        name: "Collection Date",
        selector: (row) => row.date,
        cell: (row) => (
          <span className="text-[11px] text-ink-600">
            {formatDate(row.date)}
          </span>
        ),
        width: "135px",
      },
      {
        name: "Reference ID",
        selector: (row) => row.reference,
        cell: (row) => (
          <span className="text-[11px] font-medium text-ink-700">
            {row.reference || "—"}
          </span>
        ),
        minWidth: "135px",
      },
      {
        name: "Payment Mode",
        selector: (row) => row.mode,
        cell: (row) => (
          <span className="text-[11px] text-ink-600">{row.mode}</span>
        ),
        width: "125px",
      },
      {
        name: "Amount",
        selector: (row) => row.amount,
        right: true,
        cell: (row) => (
          <span className="text-[11px] font-semibold text-ink-800">
            {formatCurrency(row.amount)}
          </span>
        ),
        width: "145px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => <StatusBadge status={row.status} />,
        width: "105px",
      },
      {
        name: "Remarks",
        selector: (row) => row.remarks,
        cell: (row) => (
          <span className="max-w-44 truncate text-[11px] text-ink-500">
            {row.remarks || "—"}
          </span>
        ),
        minWidth: "150px",
      },
    ],
    [],
  );

  const handlePaymentType = (type) => {
    setPaymentType(type);
    setError("");
    setSuccess("");

    if (type === "Full") {
      setPaymentAmount(String(outstanding));
    } else {
      setPaymentAmount("");
    }
  };

  const handleReset = () => {
    setPaymentAmount("");
    setPaymentType("Partial");
    setPaymentMode("Cash");
    setPaymentDate(new Date().toLocaleDateString("en-CA"));
    setReference("");
    setRemarks("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (amount <= 0) {
      setError("Please enter a valid collection amount.");
      return;
    }

    if (amount > outstanding) {
      setError("Collection amount cannot exceed the outstanding amount.");
      return;
    }

    if (!paymentDate) {
      setError("Please select the collection date.");
      return;
    }

    if (paymentMode !== "Cash" && !reference.trim()) {
      setError("Please enter the transaction/reference number.");
      return;
    }

    const status = getStatus(alreadyPaid + amount, totalDue);

    const newEntry = {
      id: Date.now(),
      date: paymentDate,
      amount,
      mode: paymentMode,
      reference: reference.trim() || `CASH-${Date.now()}`,
      status,
      remarks: remarks.trim(),
    };

    // Replace with the collection API when available.
    setHistory((previous) => [newEntry, ...previous]);

    setSuccess(
      `Collection recorded successfully. Amount: ${formatCurrency(amount)}`,
    );

    setPaymentAmount("");
    setReference("");
    setRemarks("");
    setPaymentType("Partial");
  };

  const quickStats = [
    {
      label: "Loan Amount",
      value: formatCurrency(customer.loan_amount),
      detail: customer.loan_type || "Loan",
    },
    {
      label: "EMI Due",
      value: formatCurrency(customer.emi_amount),
      detail: `Due date: ${formatDate(customer.due_date)}`,
    },
    {
      label: "Previously Paid",
      value: formatCurrency(alreadyPaid),
      detail: "Adjusted against current due",
    },
    {
      label: "Outstanding",
      value: formatCurrency(outstanding),
      detail: "Amount pending for this due",
    },
  ];

  const customerName =
    customerDetail?.personalKyc?.[0]?.full_name ||
    customer.business_owner_name;

  const displayedCustomerId =
    customerDetail?.workflowNodes?.[0]?.customer_id || customer.customer_id;

  const displayedApplicationId =
    customerDetail?.workflowNodes?.[0]?.application_id ||
    customer.application_id;

  const displayedLoanAmount =
    customerDetail?.loanDetails?.[0]?.loan_amount ?? customer.loan_amount;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <button
          onClick={()=> navigate(-1)}
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-ink-500 transition hover:text-primary-700 cursor-pointer"
        >
          <RiArrowLeftLine size={14} />
          Back to collections
        </button>

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-3 font-display text-lg font-bold text-ink-900">
              {loading ? "Loading customer..." : customerName}
            </h1>

            <p className="mt-0.5 text-[11px] text-ink-400">
              {displayedCustomerId} · {displayedApplicationId} ·{" "}
              {formatCurrency(displayedLoanAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {quickStats.map((item, index) => (
          <div
            key={item.label}
            className="rounded-lg border border-ink-100 bg-white p-3 shadow-card"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-ink-500">
                {item.label}
              </p>

              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  index === 3
                    ? "bg-amber-500"
                    : index === 2
                      ? "bg-emerald-500"
                      : "bg-primary-500"
                }`}
              />
            </div>

            <p className="mt-1.5 text-base font-bold tracking-tight text-ink-900 sm:text-lg">
              {item.value}
            </p>

            <p className="mt-0.5 text-[10px] text-ink-400">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Collection form and payment summary */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <div className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-card xl:col-span-2">
          <div className="border-b border-ink-100 px-4 py-3">
            <h3 className="text-xs font-bold text-ink-900">Collect Payment</h3>
            <p className="mt-0.5 text-[11px] text-ink-500">
              Enter the amount received from the customer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 p-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
                {success}
              </div>
            )}

            {/* Payment type */}
            <div>
              <label className={labelClass}>Collection Type</label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    type: "Full",
                    title: "Full Payment",
                    description: `Settle ${formatCurrency(outstanding)}`,
                  },
                  {
                    type: "Partial",
                    title: "Partial Payment",
                    description: "Collect part of the due",
                  },
                ].map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => handlePaymentType(option.type)}
                    className={`rounded-md border px-3 py-2 text-left transition ${
                      paymentType === option.type
                        ? "border-primary-300 bg-primary-50 ring-1 ring-primary-200"
                        : "border-ink-200 hover:bg-ink-50"
                    }`}
                  >
                    <p
                      className={`text-[11px] font-bold ${
                        paymentType === option.type
                          ? "text-primary-800"
                          : "text-ink-800"
                      }`}
                    >
                      {option.title}
                    </p>

                    <p className="mt-0.5 text-[10px] text-ink-500">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="collectionAmount" className={labelClass}>
                Amount Received (₹) *
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-400">
                  ₹
                </span>

                <input
                  id="collectionAmount"
                  type="number"
                  min="0.01"
                  max={outstanding}
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPaymentAmount(value);
                    setPaymentType(
                      Number(value) >= outstanding && outstanding > 0
                        ? "Full"
                        : "Partial",
                    );
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter collection amount"
                  className={`${inputClass} pl-7 font-semibold`}
                />
              </div>

              <p className="mt-1 text-[10px] text-ink-400">
                Maximum collectible amount: {formatCurrency(outstanding)}
              </p>
            </div>

            {/* Payment mode and date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="paymentMode" className={labelClass}>
                  Payment Mode *
                </label>

                <select
                  id="paymentMode"
                  value={paymentMode}
                  onChange={(event) => setPaymentMode(event.target.value)}
                  className={inputClass}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentDate" className={labelClass}>
                  Collection Date *
                </label>

                <input
                  id="paymentDate"
                  type="date"
                  required
                  max={new Date().toLocaleDateString("en-CA")}
                  value={paymentDate}
                  onChange={(event) => setPaymentDate(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Transaction reference */}
            {paymentMode !== "Cash" && (
              <div>
                <label htmlFor="reference" className={labelClass}>
                  Transaction / Reference Number *
                </label>

                <input
                  id="reference"
                  type="text"
                  required
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder="Enter UTR, cheque or transaction number"
                  className={inputClass}
                />
              </div>
            )}

            {/* Remarks */}
            <div>
              <label htmlFor="remarks" className={labelClass}>
                Remarks
              </label>

              <textarea
                id="remarks"
                rows={2}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Enter collection remarks (optional)"
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse justify-end gap-2 border-t border-ink-100 pt-3 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-ink-200 px-3 py-2 text-[11px] font-semibold text-ink-600 transition hover:bg-ink-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={outstanding <= 0}
                className="rounded-md border border-primary-700 bg-primary-700 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Record Collection
              </button>
            </div>
          </form>
        </div>

        {/* Payment summary */}
        <div className="rounded-lg border border-ink-100 bg-white shadow-card">
          <div className="border-b border-ink-100 px-4 py-3">
            <h3 className="text-xs font-bold text-ink-900">
              Payment Summary
            </h3>
            <p className="mt-0.5 text-[11px] text-ink-500">
              Outstanding due breakdown
            </p>
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-ink-500">Total Due</span>
              <span className="text-xs font-semibold text-ink-800">
                {formatCurrency(totalDue)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-ink-500">Previously Paid</span>
              <span className="text-xs font-semibold text-emerald-700">
                {formatCurrency(alreadyPaid)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-ink-500">
                Outstanding Before Payment
              </span>
              <span className="text-xs font-semibold text-ink-800">
                {formatCurrency(outstanding)}
              </span>
            </div>

            <div className="border-t border-dashed border-ink-200 pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-ink-600">
                  Receiving Now
                </span>
                <span className="text-sm font-bold text-primary-700">
                  {formatCurrency(amount)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-ink-600">
                  Remaining After Payment
                </span>
                <span className="text-sm font-bold text-ink-900">
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>

            <div className="rounded-md bg-ink-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-ink-500">
                  Payment Status
                </span>

                <StatusBadge
                  status={
                    amount <= 0
                      ? getStatus(alreadyPaid, totalDue)
                      : getStatus(alreadyPaid + amount, totalDue)
                  }
                />
              </div>

              <p className="mt-1 text-[10px] leading-4 text-ink-400">
                {amount <= 0
                  ? "Enter the amount to preview the collection status."
                  : remaining <= 0
                    ? "The current due will be fully settled."
                    : "The customer will have an outstanding balance after this payment."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection history */}
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-ink-900">
              Collection History
            </h3>
            <p className="mt-0.5 text-[11px] text-ink-400">
              Previously recorded payments for this customer
            </p>
          </div>

          <span className="rounded-md border border-ink-100 bg-white px-2.5 py-1 text-[10px] font-medium text-ink-600">
            {history.length} Records
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-ink-100 bg-white shadow-card">
          <DataTable
            columns={columns}
            data={history}
            customStyles={customStyles}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 20]}
            paginationComponentOptions={{
              noRowsPerPage: false,
              rowsPerPageText: "Rows per page:",
              rangeSeparatorText: "of",
            }}
            responsive={false}
            highlightOnHover
            pointerOnHover={false}
            persistTableHead
            noDataComponent={
              <p className="py-8 text-center text-xs text-ink-400">
                No collection records found.
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionDetails;




// import { useEffect, useMemo, useState } from "react";
// import { Link, useLocation, useSearchParams } from "react-router-dom";
// import DataTable from "react-data-table-component";
// import { RiArrowLeftLine } from "react-icons/ri";
// import { useAuthData } from "../../context/authContext";
// import { showValidationError } from "../../components/utils/common";
// import { CustomerDetails } from "../../api/application";

// const formatCurrency = (value) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   }).format(Number(value) || 0);

// const formatDate = (value) => {
//   if (!value) return "—";
//   return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const getStatus = (paid, due) => {
//   if (paid <= 0) return "Pending";
//   if (paid >= due) return "Paid";
//   return "Partial";
// };

// const getEmiStatus = (paid, total, dueDate) => {
//   if (paid >= total) return "Paid";
//   if (paid > 0) return "Partial";

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const dueDateValue = new Date(`${dueDate}T00:00:00`);

//   return dueDateValue < today ? "Overdue" : "Pending";
// };

// const StatusBadge = ({ status }) => {
//   const styles = {
//     Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     Partial: "bg-amber-50 text-amber-700 border-amber-200",
//     Pending: "bg-slate-50 text-slate-600 border-slate-200",
//     Overdue: "bg-red-50 text-red-700 border-red-200",
//   };

//   return (
//     <span
//       className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold ${
//         styles[status] || styles.Pending
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// const customStyles = {
//   table: { style: { backgroundColor: "transparent" } },
//   headRow: {
//     style: {
//       backgroundColor: "#F8FAFC",
//       borderBottomColor: "#E5E7EB",
//       minHeight: "38px",
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: "10px",
//       fontWeight: 700,
//       textTransform: "uppercase",
//       letterSpacing: "0.04em",
//       color: "#64748B",
//       paddingLeft: "12px",
//       paddingRight: "12px",
//     },
//   },
//   rows: {
//     style: {
//       minHeight: "44px",
//       borderBottomColor: "#F1F5F9",
//       "&:hover": { backgroundColor: "#F8FAFC" },
//     },
//   },
//   cells: {
//     style: {
//       paddingLeft: "12px",
//       paddingRight: "12px",
//     },
//   },
//   pagination: {
//     style: {
//       borderTopColor: "#E5E7EB",
//       fontSize: "11px",
//       color: "#64748B",
//       minHeight: "42px",
//     },
//     pageButtonsStyle: {
//       borderRadius: "6px",
//       height: "28px",
//       width: "28px",
//       padding: "4px",
//       cursor: "pointer",
//       fill: "#64748B",
//       "&:disabled": { cursor: "unset", opacity: 0.4 },
//       "&:hover:not(:disabled)": { backgroundColor: "#F1F5F9" },
//     },
//   },
//   noData: {
//     style: {
//       padding: "20px",
//       color: "#94A3B8",
//       fontSize: "12px",
//     },
//   },
// };

// const inputClass =
//   "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-xs text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-100";

// const labelClass = "mb-1 block text-[11px] font-semibold text-ink-600";

// const initialHistory = [
//   {
//     id: 1,
//     date: "2026-09-24",
//     amount: 24818,
//     mode: "UPI",
//     reference: "UPI102490",
//     status: "Paid",
//     remarks: "September EMI",
//   },
//   {
//     id: 2,
//     date: "2026-08-24",
//     amount: 15000,
//     mode: "Cash",
//     reference: "COL102481",
//     status: "Partial",
//     remarks: "Partial EMI collection",
//   },
// ];

// // Demo EMI schedule. Replace this with the installment schedule from API.
// const initialEmiSchedule = [
//   {
//     id: 1,
//     emiNo: 1,
//     dueDate: "2026-08-24",
//     amount: 24818,
//     paidAmount: 15000,
//   },
//   {
//     id: 2,
//     emiNo: 2,
//     dueDate: "2026-09-24",
//     amount: 24818,
//     paidAmount: 24818,
//   },
//   {
//     id: 3,
//     emiNo: 3,
//     dueDate: "2026-10-24",
//     amount: 24818,
//     paidAmount: 0,
//   },
//   {
//     id: 4,
//     emiNo: 4,
//     dueDate: "2026-11-24",
//     amount: 24818,
//     paidAmount: 0,
//   },
// ];

// const CollectionDetails = () => {
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const { authData } = useAuthData();

//   const customerId = searchParams.get("customer_id");
//   const applicationId = searchParams.get("application_id");

//   const [history, setHistory] = useState(initialHistory);
//   const [emiSchedule, setEmiSchedule] = useState(initialEmiSchedule);
//   const [showCollectionForm, setShowCollectionForm] = useState(false);
//   const [selectedEmiId, setSelectedEmiId] = useState(null);

//   const [paymentAmount, setPaymentAmount] = useState("");
//   const [paymentType, setPaymentType] = useState("Partial");
//   const [paymentMode, setPaymentMode] = useState("Cash");
//   const [paymentDate, setPaymentDate] = useState(
//     new Date().toLocaleDateString("en-CA")
//   );
//   const [reference, setReference] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [customerDetail, setCustomerDetail] = useState({});

//   const customer = {
//     customer_id: "CU_1159",
//     application_id: "AP_10156",
//     business_owner_name: "Rajat Kumar",
//     contact_person_mobile_no: "9876543210",
//     loan_type: "Business Loan",
//     loan_amount: 500000,
//     emi_amount: 24818,
//     total_due: 24818,
//     previously_paid: 0,
//     due_date: "2026-10-24",
//     ...(location.state?.customer || {}),
//   };

//   const selectedEmi = emiSchedule.find((emi) => emi.id === selectedEmiId);
//   const totalDue = selectedEmi
//     ? Math.max(selectedEmi.amount - selectedEmi.paidAmount, 0)
//     : Number(customer.total_due) || 0;
//   const alreadyPaid = selectedEmi
//     ? selectedEmi.paidAmount
//     : Number(customer.previously_paid) || 0;
//   const outstanding = selectedEmi
//     ? totalDue
//     : Math.max(totalDue - alreadyPaid, 0);

//   const amount = Number(paymentAmount) || 0;
//   const remaining = Math.max(outstanding - amount, 0);

//   const fetchCustomerDetails = async () => {
//     if (!customerId || !applicationId) return;

//     try {
//       setLoading(true);
//       const request = {
//         customer_id: customerId,
//         application_id: applicationId,
//         role: authData?.role,
//         created_by: authData?.user_id,
//       };

//       const response = await CustomerDetails(request);
//       if (response.status) setCustomerDetail(response.data);
//     } catch (error) {
//       showValidationError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomerDetails();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [customerId, applicationId]);

//   const columns = useMemo(
//     () => [
//       {
//         name: "Collection Date",
//         selector: (row) => row.date,
//         cell: (row) => (
//           <span className="text-[11px] text-ink-600">
//             {formatDate(row.date)}
//           </span>
//         ),
//         width: "135px",
//       },
//       {
//         name: "Reference ID",
//         selector: (row) => row.reference,
//         cell: (row) => (
//           <span className="text-[11px] font-medium text-ink-700">
//             {row.reference || "—"}
//           </span>
//         ),
//         minWidth: "135px",
//       },
//       {
//         name: "Payment Mode",
//         selector: (row) => row.mode,
//         cell: (row) => (
//           <span className="text-[11px] text-ink-600">{row.mode}</span>
//         ),
//         width: "125px",
//       },
//       {
//         name: "Amount",
//         selector: (row) => row.amount,
//         right: true,
//         cell: (row) => (
//           <span className="text-[11px] font-semibold text-ink-800">
//             {formatCurrency(row.amount)}
//           </span>
//         ),
//         width: "145px",
//       },
//       {
//         name: "Status",
//         selector: (row) => row.status,
//         cell: (row) => <StatusBadge status={row.status} />,
//         width: "105px",
//       },
//       {
//         name: "Remarks",
//         selector: (row) => row.remarks,
//         cell: (row) => (
//           <span className="max-w-44 truncate text-[11px] text-ink-500">
//             {row.remarks || "—"}
//           </span>
//         ),
//         minWidth: "150px",
//       },
//     ],
//     []
//   );

//   const handlePaymentType = (type) => {
//     setPaymentType(type);
//     setError("");
//     setSuccess("");

//     if (type === "Full") {
//       setPaymentAmount(String(outstanding));
//     } else {
//       setPaymentAmount("");
//     }
//   };

//   const handleReset = () => {
//     setPaymentAmount("");
//     setPaymentType("Partial");
//     setPaymentMode("Cash");
//     setPaymentDate(new Date().toLocaleDateString("en-CA"));
//     setReference("");
//     setRemarks("");
//     setError("");
//     setSuccess("");
//     setSelectedEmiId(null);
//   };

//   const handleAddCollection = (emi = null) => {
//     setShowCollectionForm(true);
//     setError("");
//     setSuccess("");

//     if (emi) {
//       setSelectedEmiId(emi.id);
//       const dueAmount = Math.max(emi.amount - emi.paidAmount, 0);
//       setPaymentAmount(String(dueAmount));
//       setPaymentType("Full");
//     } else {
//       setSelectedEmiId(null);
//       setPaymentAmount("");
//       setPaymentType("Partial");
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     if (amount <= 0) {
//       setError("Please enter a valid collection amount.");
//       return;
//     }

//     if (amount > outstanding) {
//       setError("Collection amount cannot exceed the outstanding amount.");
//       return;
//     }

//     if (!paymentDate) {
//       setError("Please select the collection date.");
//       return;
//     }

//     if (paymentMode !== "Cash" && !reference.trim()) {
//       setError("Please enter the transaction/reference number.");
//       return;
//     }

//     const newPaidAmount = alreadyPaid + amount;
//     const status = getStatus(newPaidAmount, selectedEmi ? selectedEmi.amount : totalDue);

//     const newEntry = {
//       id: Date.now(),
//       date: paymentDate,
//       amount,
//       mode: paymentMode,
//       reference: reference.trim() || `CASH-${Date.now()}`,
//       status,
//       remarks: remarks.trim(),
//     };

//     // Replace with the collection API when available.
//     setHistory((previous) => [newEntry, ...previous]);

//     if (selectedEmiId !== null) {
//       setEmiSchedule((previous) =>
//         previous.map((emi) =>
//           emi.id === selectedEmiId
//             ? {
//                 ...emi,
//                 paidAmount: Math.min(emi.paidAmount + amount, emi.amount),
//               }
//             : emi
//         )
//       );
//     }

//     setSuccess(
//       `Collection recorded successfully. Amount: ${formatCurrency(amount)}`
//     );

//     setPaymentAmount("");
//     setReference("");
//     setRemarks("");
//     setPaymentType("Partial");
//     setSelectedEmiId(null);
//   };

//   const paidEmis = emiSchedule.filter(
//     (emi) => getEmiStatus(emi.paidAmount, emi.amount, emi.dueDate) === "Paid"
//   ).length;

//   const pendingEmis = emiSchedule.filter((emi) =>
//     ["Pending", "Overdue", "Partial"].includes(
//       getEmiStatus(emi.paidAmount, emi.amount, emi.dueDate)
//     )
//   ).length;

//   const quickStats = [
//     {
//       label: "Loan Amount",
//       value: formatCurrency(customer.loan_amount),
//       detail: customer.loan_type || "Loan",
//     },
//     {
//       label: "EMI Due",
//       value: formatCurrency(customer.emi_amount),
//       detail: `Due date: ${formatDate(customer.due_date)}`,
//     },
//     {
//       label: "Previously Paid",
//       value: formatCurrency(alreadyPaid),
//       detail: "Adjusted against selected EMI",
//     },
//     {
//       label: "Outstanding",
//       value: formatCurrency(outstanding),
//       detail: "Amount pending for selected due",
//     },
//   ];

//   const customerName =
//     customerDetail?.personalKyc?.[0]?.full_name ||
//     customer.business_owner_name;

//   const displayedCustomerId =
//     customerDetail?.workflowNodes?.[0]?.customer_id || customer.customer_id;

//   const displayedApplicationId =
//     customerDetail?.workflowNodes?.[0]?.application_id ||
//     customer.application_id;

//   const displayedLoanAmount =
//     customerDetail?.loanDetails?.[0]?.loan_amount ?? customer.loan_amount;

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div>
//         <Link
//           to="/collection-list"
//           className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-ink-500 transition hover:text-primary-700"
//         >
//           <RiArrowLeftLine size={14} />
//           Back to collections
//         </Link>

//         <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
//           <div>
//             <h1 className="flex items-center gap-3 font-display text-lg font-bold text-ink-900">
//               {loading ? "Loading customer..." : customerName}
//             </h1>
//             <p className="mt-0.5 text-[11px] text-ink-400">
//               {displayedCustomerId} · {displayedApplicationId} ·{" "}
//               {formatCurrency(displayedLoanAmount)}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => handleAddCollection()}
//             className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-primary-800"
//           >
//             <span className="text-base leading-none">+</span>
//             Add Collection
//           </button>
//         </div>
//       </div>

//       {/* Summary cards */}
//       <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
//         {quickStats.map((item, index) => (
//           <div
//             key={item.label}
//             className="rounded-lg border border-ink-100 bg-white p-3 shadow-card"
//           >
//             <div className="flex items-center justify-between gap-2">
//               <p className="text-[11px] font-medium text-ink-500">
//                 {item.label}
//               </p>
//               <span
//                 className={`h-1.5 w-1.5 shrink-0 rounded-full ${
//                   index === 3
//                     ? "bg-amber-500"
//                     : index === 2
//                     ? "bg-emerald-500"
//                     : "bg-primary-500"
//                 }`}
//               />
//             </div>
//             <p className="mt-1.5 text-base font-bold tracking-tight text-ink-900 sm:text-lg">
//               {item.value}
//             </p>
//             <p className="mt-0.5 text-[10px] text-ink-400">{item.detail}</p>
//           </div>
//         ))}
//       </div>

//       {/* EMI Payment Schedule */}
//       <div className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-card">
//         <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-4 py-3">
//           <div>
//             <h3 className="text-xs font-bold text-ink-900">
//               EMI Payment Schedule
//             </h3>
//             <p className="mt-0.5 text-[11px] text-ink-500">
//               Track paid and pending installments
//             </p>
//           </div>

//           <div className="flex items-center gap-3 text-[10px] font-semibold">
//             <span className="text-emerald-700">Paid: {paidEmis}</span>
//             <span className="text-amber-700">Pending: {pendingEmis}</span>
//             <span className="text-ink-500">Total: {emiSchedule.length}</span>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[760px] text-left">
//             <thead className="bg-slate-50">
//               <tr className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
//                 <th className="px-4 py-3">EMI No.</th>
//                 <th className="px-4 py-3">Due Date</th>
//                 <th className="px-4 py-3 text-right">EMI Amount</th>
//                 <th className="px-4 py-3 text-right">Paid Amount</th>
//                 <th className="px-4 py-3 text-right">Outstanding</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3 text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {emiSchedule.map((emi) => {
//                 const status = getEmiStatus(
//                   emi.paidAmount,
//                   emi.amount,
//                   emi.dueDate
//                 );
//                 const emiOutstanding = Math.max(
//                   emi.amount - emi.paidAmount,
//                   0
//                 );

//                 return (
//                   <tr
//                     key={emi.id}
//                     className="border-t border-ink-100 transition hover:bg-slate-50"
//                   >
//                     <td className="px-4 py-3 text-[11px] font-semibold text-ink-800">
//                       EMI {emi.emiNo}
//                     </td>
//                     <td className="px-4 py-3 text-[11px] text-ink-600">
//                       {formatDate(emi.dueDate)}
//                     </td>
//                     <td className="px-4 py-3 text-right text-[11px] font-medium text-ink-800">
//                       {formatCurrency(emi.amount)}
//                     </td>
//                     <td className="px-4 py-3 text-right text-[11px] font-semibold text-emerald-700">
//                       {formatCurrency(emi.paidAmount)}
//                     </td>
//                     <td className="px-4 py-3 text-right text-[11px] font-semibold text-ink-800">
//                       {formatCurrency(emiOutstanding)}
//                     </td>
//                     <td className="px-4 py-3">
//                       <StatusBadge status={status} />
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       {emiOutstanding > 0 ? (
//                         <button
//                           type="button"
//                           onClick={() => handleAddCollection(emi)}
//                           className="rounded-md border border-primary-200 px-2.5 py-1.5 text-[10px] font-semibold text-primary-700 transition hover:bg-primary-50"
//                         >
//                           Collect
//                         </button>
//                       ) : (
//                         <span className="text-[10px] text-emerald-600">
//                           Completed
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Collection form and payment summary - hidden until Add Collection */}
//       {showCollectionForm && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-[2px] sm:p-5"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setShowCollectionForm(false);
//               handleReset();
//             }
//           }}
//         >
//           <div
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="collection-modal-title"
//             className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-ink-100 bg-slate-50 p-3 shadow-2xl sm:p-5"
//           >
//             <div className="mb-4 flex items-center justify-between gap-3">
//               <div>
//                 <h2 id="collection-modal-title" className="text-sm font-bold text-ink-900">
//                   Add Collection
//                 </h2>
//                 <p className="mt-0.5 text-[11px] text-ink-500">
//                   Record an EMI payment and review the updated balance.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowCollectionForm(false);
//                   handleReset();
//                 }}
//                 aria-label="Close collection modal"
//                 className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-200 bg-white text-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
//           <div className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-card xl:col-span-2">
//             <div className="flex items-center justify-between gap-2 border-b border-ink-100 px-4 py-3">
//               <div>
//                 <h3 className="text-xs font-bold text-ink-900">
//                   Collect Payment
//                 </h3>
//                 <p className="mt-0.5 text-[11px] text-ink-500">
//                   {selectedEmi
//                     ? `Recording payment for EMI ${selectedEmi.emiNo}`
//                     : "Enter the amount received from the customer."}
//                 </p>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-3 p-4">
//               {error && (
//                 <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
//                   {error}
//                 </div>
//               )}

//               {success && (
//                 <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
//                   {success}
//                 </div>
//               )}

//               {selectedEmi && (
//                 <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary-100 bg-primary-50 px-3 py-2">
//                   <div>
//                     <p className="text-[11px] font-semibold text-primary-800">
//                       EMI {selectedEmi.emiNo}
//                     </p>
//                     <p className="text-[10px] text-primary-700">
//                       Due date: {formatDate(selectedEmi.dueDate)}
//                     </p>
//                   </div>
//                   <p className="text-xs font-bold text-primary-800">
//                     Pending: {formatCurrency(outstanding)}
//                   </p>
//                 </div>
//               )}

//               {/* Payment type */}
//               <div>
//                 <label className={labelClass}>Collection Type</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[
//                     {
//                       type: "Full",
//                       title: "Full Payment",
//                       description: `Settle ${formatCurrency(outstanding)}`,
//                     },
//                     {
//                       type: "Partial",
//                       title: "Partial Payment",
//                       description: "Collect part of the due",
//                     },
//                   ].map((option) => (
//                     <button
//                       key={option.type}
//                       type="button"
//                       onClick={() => handlePaymentType(option.type)}
//                       className={`rounded-md border px-3 py-2 text-left transition ${
//                         paymentType === option.type
//                           ? "border-primary-300 bg-primary-50 ring-1 ring-primary-200"
//                           : "border-ink-200 hover:bg-ink-50"
//                       }`}
//                     >
//                       <p
//                         className={`text-[11px] font-bold ${
//                           paymentType === option.type
//                             ? "text-primary-800"
//                             : "text-ink-800"
//                         }`}
//                       >
//                         {option.title}
//                       </p>
//                       <p className="mt-0.5 text-[10px] text-ink-500">
//                         {option.description}
//                       </p>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Amount */}
//               <div>
//                 <label htmlFor="collectionAmount" className={labelClass}>
//                   Amount Received (₹) *
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-400">
//                     ₹
//                   </span>
//                   <input
//                     id="collectionAmount"
//                     type="number"
//                     min="0.01"
//                     max={outstanding}
//                     step="0.01"
//                     required
//                     value={paymentAmount}
//                     onChange={(event) => {
//                       const value = event.target.value;
//                       setPaymentAmount(value);
//                       setPaymentType(
//                         Number(value) >= outstanding && outstanding > 0
//                           ? "Full"
//                           : "Partial"
//                       );
//                       setError("");
//                       setSuccess("");
//                     }}
//                     placeholder="Enter collection amount"
//                     className={`${inputClass} pl-7 font-semibold`}
//                   />
//                 </div>
//                 <p className="mt-1 text-[10px] text-ink-400">
//                   Maximum collectible amount: {formatCurrency(outstanding)}
//                 </p>
//               </div>

//               {/* Payment mode and date */}
//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div>
//                   <label htmlFor="paymentMode" className={labelClass}>
//                     Payment Mode *
//                   </label>
//                   <select
//                     id="paymentMode"
//                     value={paymentMode}
//                     onChange={(event) => setPaymentMode(event.target.value)}
//                     className={inputClass}
//                   >
//                     <option value="Cash">Cash</option>
//                     <option value="UPI">UPI</option>
//                     <option value="Bank Transfer">Bank Transfer</option>
//                     <option value="Cheque">Cheque</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="paymentDate" className={labelClass}>
//                     Collection Date *
//                   </label>
//                   <input
//                     id="paymentDate"
//                     type="date"
//                     required
//                     max={new Date().toLocaleDateString("en-CA")}
//                     value={paymentDate}
//                     onChange={(event) => setPaymentDate(event.target.value)}
//                     className={inputClass}
//                   />
//                 </div>
//               </div>

//               {/* Transaction reference */}
//               {paymentMode !== "Cash" && (
//                 <div>
//                   <label htmlFor="reference" className={labelClass}>
//                     Transaction / Reference Number *
//                   </label>
//                   <input
//                     id="reference"
//                     type="text"
//                     required
//                     value={reference}
//                     onChange={(event) => setReference(event.target.value)}
//                     placeholder="Enter UTR, cheque or transaction number"
//                     className={inputClass}
//                   />
//                 </div>
//               )}

//               {/* Remarks */}
//               <div>
//                 <label htmlFor="remarks" className={labelClass}>
//                   Remarks
//                 </label>
//                 <textarea
//                   id="remarks"
//                   rows={2}
//                   value={remarks}
//                   onChange={(event) => setRemarks(event.target.value)}
//                   placeholder="Enter collection remarks (optional)"
//                   className={`${inputClass} resize-y`}
//                 />
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col-reverse justify-end gap-2 border-t border-ink-100 pt-3 sm:flex-row">
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className="rounded-md border border-ink-200 px-3 py-2 text-[11px] font-semibold text-ink-600 transition hover:bg-ink-50"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={outstanding <= 0}
//                   className="rounded-md border border-primary-700 bg-primary-700 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Record Collection
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Payment summary */}
//           <div className="rounded-lg border border-ink-100 bg-white shadow-card">
//             <div className="border-b border-ink-100 px-4 py-3">
//               <h3 className="text-xs font-bold text-ink-900">
//                 Payment Summary
//               </h3>
//               <p className="mt-0.5 text-[11px] text-ink-500">
//                 Outstanding due breakdown
//               </p>
//             </div>

//             <div className="space-y-3 p-4">
//               <div className="flex items-center justify-between gap-3">
//                 <span className="text-[11px] text-ink-500">EMI Amount</span>
//                 <span className="text-xs font-semibold text-ink-800">
//                   {formatCurrency(selectedEmi?.amount ?? totalDue)}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between gap-3">
//                 <span className="text-[11px] text-ink-500">Previously Paid</span>
//                 <span className="text-xs font-semibold text-emerald-700">
//                   {formatCurrency(alreadyPaid)}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between gap-3">
//                 <span className="text-[11px] text-ink-500">
//                   Outstanding Before Payment
//                 </span>
//                 <span className="text-xs font-semibold text-ink-800">
//                   {formatCurrency(outstanding)}
//                 </span>
//               </div>

//               <div className="border-t border-dashed border-ink-200 pt-3">
//                 <div className="flex items-center justify-between gap-3">
//                   <span className="text-[11px] font-medium text-ink-600">
//                     Receiving Now
//                   </span>
//                   <span className="text-sm font-bold text-primary-700">
//                     {formatCurrency(amount)}
//                   </span>
//                 </div>

//                 <div className="mt-3 flex items-center justify-between gap-3">
//                   <span className="text-[11px] font-medium text-ink-600">
//                     Remaining After Payment
//                   </span>
//                   <span className="text-sm font-bold text-ink-900">
//                     {formatCurrency(remaining)}
//                   </span>
//                 </div>
//               </div>

//               <div className="rounded-md bg-ink-50 p-3">
//                 <div className="flex items-center justify-between gap-2">
//                   <span className="text-[11px] text-ink-500">
//                     Payment Status
//                   </span>
//                   <StatusBadge
//                     status={
//                       amount <= 0
//                         ? getEmiStatus(
//                             alreadyPaid,
//                             selectedEmi?.amount ?? totalDue,
//                             selectedEmi?.dueDate ?? customer.due_date
//                           )
//                         : getStatus(
//                             alreadyPaid + amount,
//                             selectedEmi?.amount ?? totalDue
//                           )
//                     }
//                   />
//                 </div>
//                 <p className="mt-1 text-[10px] leading-4 text-ink-400">
//                   {amount <= 0
//                     ? "Enter the amount to preview the collection status."
//                     : remaining <= 0
//                     ? "The current EMI will be fully settled."
//                     : "The customer will have an outstanding balance after this payment."}
//                 </p>
//               </div>
//             </div>
//             </div>
//           </div>
//         </div>
//         </div>
//       )}

//       {/* Collection history */}
//       <div>
//         <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//           <div>
//             <h3 className="text-xs font-bold text-ink-900">
//               Collection History
//             </h3>
//             <p className="mt-0.5 text-[11px] text-ink-400">
//               Previously recorded payments for this customer
//             </p>
//           </div>

//           <span className="rounded-md border border-ink-100 bg-white px-2.5 py-1 text-[10px] font-medium text-ink-600">
//             {history.length} Records
//           </span>
//         </div>

//         <div className="overflow-x-auto rounded-lg border border-ink-100 bg-white shadow-card">
//           <DataTable
//             columns={columns}
//             data={history}
//             customStyles={customStyles}
//             pagination
//             paginationPerPage={5}
//             paginationRowsPerPageOptions={[5, 10, 20]}
//             paginationComponentOptions={{
//               noRowsPerPage: false,
//               rowsPerPageText: "Rows per page:",
//               rangeSeparatorText: "of",
//             }}
//             responsive={false}
//             highlightOnHover
//             pointerOnHover={false}
//             persistTableHead
//             noDataComponent={
//               <p className="py-8 text-center text-xs text-ink-400">
//                 No collection records found.
//               </p>
//             }
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollectionDetails;
