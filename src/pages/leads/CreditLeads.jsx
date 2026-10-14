import React, { useState, useEffect } from "react";
import Icon from "../../components/utils/Icon";
import { IoPerson } from "react-icons/io5";
import DataTable from "react-data-table-component";
import {
  branchData,
  allLoansData,
  PendingLeadsData,
  NewLeadsData,
  // GetAllCustomerDetails,
} from "../../content/masterData"; // adjust path as needed
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { Link, useNavigate } from "react-router-dom";
import { GetAllApplications } from "../../api/application";

const CreditLeads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ordered list of steps used to derive the "Pending Step"
  const STEP_CHECKS = [
    { key: "is_cibil_fatched", label: "CIBIL" },
    { key: "survey_is_completed", label: "Survey" },
    { key: "persoanl_kyc_is_completed", label: "Personal KYC" },
    { key: "address_is_completed", label: "Address" },
    { key: "bank_is_completed", label: "Bank" },
    { key: "coborrower_is_completed", label: "Co-borrower" },
    { key: "cashflow_is_completed", label: "Cashflow" },
    { key: "loaninfo_is_completed", label: "Loan Info" },
    { key: "document_is_completed", label: "Document" },
  ];

  const getPendingStep = (row) => {
    const pendingSteps = STEP_CHECKS
      .filter((step) => row[step.key] === false)
      .map((step) => step.label);

    return pendingSteps.length ? pendingSteps.join(", ") : "Completed";
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestBody = {
        role: "admin",
        created_by: "admin",
      };

      const response = await GetAllApplications(requestBody);

      if (response?.status && Array.isArray(response.data)) {
        const formatted = response.data.map((item) => ({
          leadId: item.application_id,
          customerId: item.customer_id,
          name: item.business_owner_name,
          phone: item.business_owner_mobile_no,
          branch: item.branch ?? "-",                  // not in API response
          loanType: item.loan_type ?? "-",             // not in API response
          sanctionAmount: item.sanction_amount ?? 0,   // not in API response
          pendingStep: getPendingStep(item),
          createdDate: item.created_date,
          createdBy: item.created_by ?? "-",           // not in API response
          status: item.status ?? "Pending",
          raw: item,
        }));
        setLeads(formatted);
      } else {
        setLeads([]);
        setError(response?.message || "Failed to fetch leads.");
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err?.message || "Something went wrong while fetching leads.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const columns = [
    {
      name: "LeadId",
      selector: (row) => row.leadId,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      right: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
      right: true,
    },
    {
      name: "Loan Type",
      selector: (row) => row.loanType,
      sortable: true,
      right: true,
    },
    {
      name: "Sanction Amount",
      selector: (row) =>
        typeof row.sanctionAmount === "number"
          ? `₹${row.sanctionAmount.toLocaleString()}`
          : row.sanctionAmount,
      sortable: true,
      right: true,
    },
    {
      name: "Pending Step",
      selector: (row) => row.pendingStep,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.createdBy,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => (
        <Link
          to="/credit-detail"
          state={{ lead: row.raw }}   // pass full record to detail page
          className="p-1.5 px-2 rounded-sm text-xs font-medium bg-primary flex gap-1 text-white items-center"
        >
          <Icon name="FaRegEye" size={15} color={"white"} />
          View
        </Link>
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* header */}
        <div className="flex justify-between py-0 px-4">
          <div className="text-md font-medium self-center">
            Credit &amp; Analysis
          </div>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* error state */}
        {error && !loading && (
          <div className="px-4 py-2 mt-3 text-sm text-red-600">{error}</div>
        )}

        {/* table data */}
        <Table data={leads} columns={columns} progressPending={loading} />
      </div>
    </>
  );
};

export default CreditLeads;