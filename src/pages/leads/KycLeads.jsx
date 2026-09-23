import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoPerson } from "react-icons/io5";
import DataTable from "react-data-table-component";
import {
  branchData,
  allLoansData,
  PendingLeadsData,
  NewLeadsData,
} from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { Link, useNavigate } from "react-router-dom";

const KycLeads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
      selector: (row) => `₹${row.sanctionAmount.toLocaleString()}`,
      sortable: true,
      right: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row.status,
    //   sortable: true,
    //   center: true,
    //   cell: (row) => (
    //     <span
    //       className={`px-2 py-1 rounded-full text-xs font-medium ${
    //         row.status === "Approved"
    //           ? "bg-green-100 text-green-700"
    //           : row.status === "Pending"
    //           ? "bg-yellow-100 text-yellow-700"
    //           : row.status === "Rejected"
    //           ? "bg-red-100 text-red-700"
    //           : row.status === "Disbursed"
    //           ? "bg-blue-100 text-blue-700"
    //           : row.status === "Closed"
    //           ? "bg-gray-100 text-gray-700"
    //           : "bg-orange-100 text-orange-700"
    //       }`}
    //     >
    //       {row.status}
    //     </span>
    //   ),
    // },
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
          to="/kyc-detail"
          className={`p-1.5 px-2 rounded-sm text-xs font-medium bg-primary flex gap-1 text-white items-center`}
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
        {/* header  */}
        <div className="flex justify-between py-0 px-4">
          <div className="text-md font-medium self-center">Kyc Leads</div>
        </div>

        {/* table data */}
        <Table data={NewLeadsData} columns={columns} />
      </div>
    </>
  );
};

export default KycLeads;
