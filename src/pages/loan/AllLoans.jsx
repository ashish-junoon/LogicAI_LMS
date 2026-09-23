import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoPerson } from "react-icons/io5";
import DataTable from "react-data-table-component";
import { branchData, allLoansData } from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { Link, useNavigate } from "react-router-dom";

const AllLoans = () => {
  const columns = [
    {
      name: "Loan ID",
      selector: (row) => row.loanId,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Mobile No.",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Loan Amount",
      selector: (row) => `₹${row.loanAmount.toLocaleString()}`,
      sortable: true,
      right: true,
    },
    {
      name: "Interest Amount",
      selector: (row) => `₹${row.interestAmount.toLocaleString()}`,
      sortable: true,
      right: true,
    },
    {
      name: "Total Payable",
      selector: (row) => `₹${row.totalPayable.toLocaleString()}`,
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
      name: "Disbursement Date",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => (
        <Link
          to="/loan-detail"
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
          <div className="text-md font-medium self-center">All Loans</div>
        </div>

        {/* table data */}
        <Table data={allLoansData} columns={columns} />
      </div>
    </>
  );
};

export default AllLoans;
