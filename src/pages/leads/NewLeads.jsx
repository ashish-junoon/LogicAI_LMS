import React, { useState } from 'react'
import Icon from '../../components/utils/Icon'
import { IoPerson } from 'react-icons/io5'
import DataTable from 'react-data-table-component'
import { branchData, allLoansData, PendingLeadsData, NewLeadsData } from '../../content/masterData'
import Table from '../../components/Table'
import Modal from '../../components/utils/Modal'
import TextInput from '../../components/fields/TextInput'
import { Link, useNavigate } from 'react-router-dom'

const NewLeads = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()

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
      <Link to="/leads-detail"
        className={`p-1.5 rounded-sm text-xs font-medium bg-primary`}
      >
        <Icon name="MdPendingActions" size={15} color={'white'} />
      </Link>
    ),
  },
];

  return (
    <>
      <div className='flex-1 border border-gray-200 shadow-sm rounded-lg bg-gray-50'>
        {/* header  */}
        <div className='flex justify-between p-3 px-4 bg-gray-100 rounded-t-lg'>
          <div className='text-lg font-semibold self-center'>New Leads</div>
          {/* <button onClick={() => navigate("/apply-loan")} className='p-2 px-4 rounded-sm bg-blue-600 text-white flex justify-between gap-3 cursor-pointer'>  Add Loan <IoPerson className='self-center' /></button> */}
        </div>

        {/* table data */}
        <Table data={NewLeadsData} columns={columns} />

      </div>
    </>
  )
}

export default NewLeads