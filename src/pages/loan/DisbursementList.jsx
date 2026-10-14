import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import Icon from "../../components/utils/Icon";
import { GetAllApplications } from "../../api/application";

const DisbursementList = () => {
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [disbursementData, setDisbursementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDisbursementLeads = async () => {
    try {
      const response = await GetAllApplications({
        role: "admin",
        created_by: "admin",
      });

      if (!response?.status || !Array.isArray(response?.data)) {
        throw new Error(response?.message || "Failed to fetch disbursement leads.");
      }

      setDisbursementData(
        response.data.map((item) => ({
          id: item.application_id,
          loanId: item.application_id || "-",
          customerId: item.customer_id,
          customerName: item.business_owner_name || "-",
          loanAmount: Number(item.loan_amount) || 0,
          interestAmount: Number(item.interest_amount) || 0,
          totalPayable: Number(item.total_payable) || 0,
          status: item.status || "Pending",
          createdDate: item.created_date || "-",
          createdBy: item.created_by || "-",
          bankName: item.bank_name || "-",
          accountNumber: item.account_number || "-",
          ifscCode: item.ifsc_code || "-",
          disbursementDate: item.disbursement_date || "",
          remarks: item.remarks || "",
          gender: item.gender || "N/A",
          mobile: item.business_owner_mobile_no || "-",
          raw: item,
        })),
      );
    } catch (fetchError) {
      console.error("Error fetching disbursement leads:", fetchError);
      setError(
        fetchError?.response?.data?.message ||
        fetchError?.message ||
        "Something went wrong while fetching disbursement leads.",
      );
      setDisbursementData([]);
    } finally {
      setLoading(false);
    }
  };

  // Disbursement form state
  const [disburseForm, setDisburseForm] = useState({
    disbursementAmount: "",
    disbursementDate: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchTimer = window.setTimeout(fetchDisbursementLeads, 0);

    return () => window.clearTimeout(fetchTimer);
  }, []);

  const columns = [
    {
      name: "Lead ID",
      selector: (row) => row.loanId,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender || "N/A",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Salary",
      selector: (row) => row.salary ? `₹${Number(row.salary).toLocaleString()}` : "-",
      sortable: true,
    },
    {
      name: "Loan Amount",
      selector: (row) => row.loanAmount ? `₹${row.loanAmount.toLocaleString()}` : "-",
      sortable: true,
      right: true,
    },
    {
      name: "Bank Name",
      selector: (row) => row.bankName,
      sortable: true,
      right: true,
    },
    {
      name: "Account Number",
      selector: (row) => row.accountNumber,
      sortable: true,
      right: true,
    },
    {
      name: "IFSC Code",
      selector: (row) => row.ifscCode,
      sortable: true,
      right: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link
          to={`/disbursement-detail?customer_id=${encodeURIComponent(row.customerId ?? "")}&application_id=${encodeURIComponent(row.loanId === "-" ? "" : row.loanId)}`}
          state={{ lead: row.raw }}
          className={`p-1.5 px-2 rounded-sm text-xs font-medium bg-primary flex gap-1 text-white items-center`}
        >
          <Icon name="FaRegEye" size={15} color={"white"} />
          View
        </Link>
      ),
    },
  ];

  // className={`p-1.5 rounded-sm text-xs font-medium bg-primary`}
  //     >
  //       <Icon name="FaRegEye" size={15} color={'white'} />
  //     </Link>

  const handleDisburse = (row) => {
    setSelectedLoan(row);
    setDisburseForm({
      disbursementAmount: String(row.loanAmount || ""),
      disbursementDate: new Date().toISOString().split("T")[0],
      bankName: row.bankName || "",
      accountNumber: row.accountNumber || "",
      ifscCode: row.ifscCode || "",
      remarks: "",
    });
    setIsDisburseModalOpen(true);
  };

  const handleDisburseSubmit = () => {
    // Yahan aap API call karenge disbursement process ke liye
    console.log("Disbursing loan:", selectedLoan?.loanId, disburseForm);
    setIsDisburseModalOpen(false);
    // Success message show kar sakte hain
    alert(`Loan ${selectedLoan?.loanId} disbursed successfully!`);
  };

  return (
    <>
      <div className="flex-1">
        {/* header */}
        <div className="flex justify-between py-0 px-4">
          <div className="text-md font-medium self-center">
            Disbursement List
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              fetchDisbursementLeads();
            }}
            disabled={loading}
            className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && !loading && (
          <div role="alert" className="px-4 py-2 mt-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Table data */}
        <div className="">
          <Table data={disbursementData} columns={columns} progressPending={loading} />
        </div>
      </div>

      {/* Disbursement Modal */}
      <Modal
        isOpen={isDisburseModalOpen}
        onClose={() => setIsDisburseModalOpen(false)}
        title={`Disburse Loan - ${selectedLoan?.loanId}`}
        size="md"
      >
        <div className="px-0 py-4">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-100 border border-gray-200 px-4 py-3 rounded-md">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Customer
              </p>
              <p className="font-medium text-gray-800">
                {selectedLoan?.customerName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Loan Amount
              </p>
              <p className="font-medium text-gray-800">
                ₹{selectedLoan?.loanAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <form className="space-y-4">
            {/* Amount & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Disbursement Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={disburseForm.disbursementAmount}
                  onChange={(e) =>
                    setDisburseForm({
                      ...disburseForm,
                      disbursementAmount: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Disbursement Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={disburseForm.disbursementDate}
                  onChange={(e) =>
                    setDisburseForm({
                      ...disburseForm,
                      disbursementDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Bank Details
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={disburseForm.bankName}
                    onChange={(e) =>
                      setDisburseForm({
                        ...disburseForm,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={disburseForm.accountNumber}
                    onChange={(e) =>
                      setDisburseForm({
                        ...disburseForm,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter account no."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={disburseForm.ifscCode}
                    onChange={(e) =>
                      setDisburseForm({
                        ...disburseForm,
                        ifscCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g. HDFC0001234"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <input
                type="text"
                value={disburseForm.remarks}
                onChange={(e) =>
                  setDisburseForm({ ...disburseForm, remarks: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Add any remarks (optional)"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsDisburseModalOpen(false)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisburseSubmit}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer transition-colors flex items-center gap-2"
              >
                <IoCheckmarkCircle className="text-base" />
                Confirm Disbursement
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default DisbursementList;
