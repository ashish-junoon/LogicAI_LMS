import React, { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import SelectInput from "../../components/fields/SelectInput";
import Button from "../../components/utils/Button";

const defaultQuestions = [
  {
    id: 1,
    category: "Borrower & Business Details",
    question: "Name of Borrower / Promoter",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 2,
    category: "Borrower & Business Details",
    question: "Business Name & Constitution",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 3,
    category: "Borrower & Business Details",
    question: "Business Address / Factory Location",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 4,
    category: "Borrower & Business Details",
    question: "Nature of Business / Products",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 5,
    category: "Borrower & Business Details",
    question: "Years in Business / Experience",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 6,
    category: "Purpose of Loan",
    question: "Loan Amount Requested",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 7,
    category: "Purpose of Loan",
    question: "Purpose of Loan",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 8,
    category: "Purpose of Loan",
    question: "Repayment Source",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 9,
    category: "Promoter Profile",
    question: "Age / Education / Background",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 10,
    category: "Promoter Profile",
    question: "Family & Dependents",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 11,
    category: "Promoter Profile",
    question: "Residence Type (Owned / Rented)",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 12,
    category: "Promoter Profile",
    question: "Net Worth / Assets",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 13,
    category: "Promoter Profile",
    question: "Other Liabilities / Loans",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 14,
    category: "Business Operations",
    question: "Business Vintage & Stability",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 15,
    category: "Business Operations",
    question: "Office / Factory Setup",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 16,
    category: "Business Operations",
    question: "Number of Employees",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 17,
    category: "Business Operations",
    question: "Key Customers",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 18,
    category: "Business Operations",
    question: "Key Suppliers",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 19,
    category: "Business Operations",
    question: "Seasonality of Business",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 20,
    category: "Business Operations",
    question: "Competitors / Market Standing",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 21,
    category: "Financial Understanding",
    question: "Monthly Turnover (Cash / Digital)",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 22,
    category: "Financial Understanding",
    question: "Average Monthly Expenses",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 23,
    category: "Financial Understanding",
    question: "Stock & Debtor cycle (days)",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 24,
    category: "Financial Understanding",
    question: "Existing Loans / EMIs",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 25,
    category: "Financial Understanding",
    question: "Repayment Track Record",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 26,
    category: "Banking & Cashflow",
    question: "Main Bank Account",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 27,
    category: "Banking & Cashflow",
    question: "Nature of Transactions (Cash/Digital)",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 28,
    category: "Banking & Cashflow",
    question: "Average Bank Balance",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 29,
    category: "Banking & Cashflow",
    question: "Cheque Returns (6 months)",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 30,
    category: "Banking & Cashflow",
    question: "FOIR check",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 31,
    category: "Verification",
    question: "Business Place Visited",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 32,
    category: "Verification",
    question: "Stock / Machinery Seen",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 33,
    category: "Verification",
    question: "Staff Presence Verified",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 34,
    category: "Verification",
    question: "GST Returns Verified",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 35,
    category: "Verification",
    question: "Customer/Supplier References Checked",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 36,
    category: "Red Flags",
    question: "Cheque Bounce History",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 37,
    category: "Red Flags",
    question: "Single Buyer Dependency",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 38,
    category: "Red Flags",
    question: "Turnover Discrepancy",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 39,
    category: "Red Flags",
    question: "Pending Statutory Dues",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 40,
    category: "Red Flags",
    question: "Lifestyle Mismatch",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 41,
    category: "Observations",
    question: "Officer Observations",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 42,
    category: "PD Outcome",
    question: "Loan Recommended (Y/N)",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 43,
    category: "PD Outcome",
    question: "Eligible Loan Amount",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 44,
    category: "PD Outcome",
    question: "Suggested Repayment Terms",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
  {
    id: 45,
    category: "PD Outcome",
    question: "Risk Mitigants / Conditions",
    answer: "",
    uploadDocument: null,
    remarks: "",
  },
];

const categories = [
  { label: "Borrower & Business Details" },
  { label: "Purpose of Loan" },
  { label: "Promoter Profile" },
  { label: "Business Operations" },
  { label: "Financial Understanding" },
  { label: "Banking & Cashflow" },
  { label: "Verification" },
  { label: "Red Flags" },
  { label: "Observations" },
  { label: "PD Outcome" },
];

const PDQuestionsMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "60px",
      center: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      width: "220px",
    },
    {
      name: "Question",
      selector: (row) => row.question,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      width: "100px",
      center: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => {
            // Edit question
          }}
        >
          <Icon name="FaEdit" size={18} color="black" />
        </button>
      ),
    },
    {
      name: "Status",
      width: "100px",
      center: true,
      cell: (row) => (
        <TogleInput
          checked={row.isActive ?? true}
          onChange={() => {
            // Change status
          }}
        />
      ),
    },
    {
      name: "Delete",
      width: "100px",
      center: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => {
            // Delete question
          }}
        >
          <IoTrashBin color="red" size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* Header */}

        <div className="flex justify-between items-center p-0 px-4">
          <div className="text-md font-medium self-center">Quetions Master</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
            >
              Add Category
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Table */}
        <Table data={defaultQuestions} columns={columns} />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        title="Add PD Question"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="grid grid-cols-2 gap-4 mt-6">
          <SelectInput
            options={categories}
            label="Category"
            placeholder="Enter category"
          />

          <TextInput label="Question" placeholder="Enter question" />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            btnName={"Cancel"}
            style={"border border-gray-200 hover:bg-gray-100"}
          />
          <Button
            btnName={"Submit"}
            style={"bg-primary text-white hover:bg-primary/90"}
          />
        </div>
      </Modal>

      {/* Add / Edit Modal --- Category */}
      <Modal
        title="Add PD Question"
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      >
        <div className="grid grid-cols-2 gap-4 mt-6">
          <TextInput label="Category" placeholder="Enter category" />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            btnName={"Cancel"}
            style={"border border-gray-200 hover:bg-gray-100"}
          />
          <Button
            btnName={"Submit"}
            style={"bg-primary text-white hover:bg-primary/90"}
          />
        </div>
      </Modal>
    </>
  );
};

export default PDQuestionsMaster;
