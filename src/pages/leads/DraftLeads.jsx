import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { GetAllApplications } from "../../api/application";
// import { GetAllCustomerDetails } from "../../content/masterData"; // adjust import path as needed

const DraftLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        const formatted = response.data.map((item, idx) => ({
          index: idx + 1,
          customerId: item.customer_id,
          leadId: item.application_id,
          name: item.business_owner_name,
          phone: item.business_owner_mobile_no,
          branch: item.branch ?? "-",           // not present in API response
          pendingStep: getPendingStep(item),
          createdDate: item.created_date,
          createdBy: item.created_by ?? "-",    // not present in API response
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
      name: "S. No",
      selector: (row) => row.index,
      sortable: true,
    },
    {
      name: "UserId",
      selector: (row) => row.customerId,
      sortable: true,
    },
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
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "Pending Step",
      selector: (row) => row.pendingStep,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate.split(" ")[0],
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.createdBy,
      sortable: true,
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* header */}
        <div className="flex justify-between py-0 px-4">
          <div>
            <p className="text-xl font-medium self-center">Draft Leads</p>
            <p className="text-sm text-gray-500">
              Applications started but not yet submitted for review
            </p>
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
          <div className="px-4 py-2 mt-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* table data */}
        <Table
          data={leads}
          columns={columns}
          progressPending={loading}
        />
      </div>
    </>
  );
};

export default DraftLeads;