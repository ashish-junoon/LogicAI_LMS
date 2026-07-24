import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoPerson,
  IoCheckmarkCircle,
  IoClose,
  IoSearch,
} from "react-icons/io5";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import Icon from "../../components/utils/Icon";
import { GiOpenFolder } from "react-icons/gi";

// Sample disbursement data (ishe aap apne actual data se replace karenge)
const disbursementData = [
  {
    id: 1,
    loanId: "LN-2024-001",
    customerName: "Rajesh Kumar",
    loanAmount: 500000,
    interestAmount: 75000,
    totalPayable: 575000,
    status: "Pending",
    createdDate: "2024-01-15",
    createdBy: "Admin",
    bankName: "HDFC Bank",
    accountNumber: "XXXX1234",
    ifscCode: "HDFC0001234",
    disbursementDate: "2024-01-20",
    remarks: "First disbursement",
    gender: "Male",
    mobile: "9999999911"    
  },
  {
    id: 2,
    loanId: "LN-2024-002",
    customerName: "Priya Sharma",
    loanAmount: 300000,
    interestAmount: 45000,
    totalPayable: 345000,
    status: "Disbursed",
    createdDate: "2024-01-16",
    createdBy: "Manager",
    bankName: "ICICI Bank",
    accountNumber: "XXXX5678",
    ifscCode: "ICICI0005678",
    disbursementDate: "2024-01-18",
    remarks: "Full amount disbursed",
    gender: "Female",
    mobile: "9999999922"    
  },
  {
    id: 3,
    loanId: "LN-2024-003",
    customerName: "Amit Patel",
    loanAmount: 750000,
    interestAmount: 112500,
    totalPayable: 862500,
    status: "Ready",
    createdDate: "2024-01-17",
    createdBy: "Admin",
    bankName: "SBI Bank",
    accountNumber: "XXXX9012",
    ifscCode: "SBIN0009012",
    disbursementDate: "2024-01-22",
    remarks: "Awaiting approval",
    gender: "Male",
    mobile: "9999999933"    
  },
  {
    id: 4,
    loanId: "LN-2024-004",
    customerName: "Sunita Reddy",
    loanAmount: 200000,
    interestAmount: 30000,
    totalPayable: 230000,
    status: "Disbursed",
    createdDate: "2024-01-18",
    createdBy: "Manager",
    bankName: "Axis Bank",
    accountNumber: "XXXX3456",
    ifscCode: "AXIS0003456",
    disbursementDate: "2024-01-19",
    remarks: "Partial disbursement",
    gender: "Female",
    mobile: "9999999944"    
  },
];

const DisbursementList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  // Disbursement form state
  const [disburseForm, setDisburseForm] = useState({
    disbursementAmount: "",
    disbursementDate: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    remarks: "",
  });

  // Filtered data based on search and status
  const filteredData = disbursementData.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bankName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Status options for filter
  const statusOptions = ["All", "Pending", "Ready", "Disbursed", "Failed"];

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
      selector: (row) => `₹${row.loanAmount.toLocaleString()}`,
      sortable: true,
    },
    {
      name: "Loan Amount",
      selector: (row) => `₹${row.loanAmount.toLocaleString()}`,
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
        <button
          // onClick={() => handleDisburse(row)}
          onClick={() => navigate('/disbursement-detail')}
          className={`px-3 py-1 rounded text-sm font-medium flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer`}
        >
          <GiOpenFolder />
          {/* Disburse */}
        </button>
      ),
    },
  ];

  const handleDisburse = (row) => {
    setSelectedLoan(row);
    setDisburseForm({
      disbursementAmount: row.loanAmount.toString(),
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

  const handleViewDetails = (row) => {
    // Loan details page par navigate karenge
    navigate(`/loan-details/${row.id}`);
  };

  return (
    <>
      <div className="flex-1 h-full border border-gray-200 shadow-sm rounded-lg bg-gray-50">
        {/* header */}
        <div className="flex justify-between p-3 px-4 bg-gray-100 rounded-t-lg">
          <div className="text-lg font-semibold self-center">
            Disbursement List
          </div>
        </div>

        {/* Table data */}
        <div className="">
          <Table data={filteredData} columns={columns} />
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
