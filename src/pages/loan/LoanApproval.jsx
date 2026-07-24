import React, { useState } from 'react'
import Icon from '../../components/utils/Icon'
import { IoPerson } from 'react-icons/io5'
import DataTable from 'react-data-table-component'
import { branchData, allLoansData } from '../../content/masterData'
import Table from '../../components/Table'
import Modal from '../../components/utils/Modal'
import TextInput from '../../components/fields/TextInput'
import { Link, useNavigate } from 'react-router-dom'

const LoanApproval = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()

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
    name: "Action",
    selector: (row) => row.status,
    sortable: true,
    center: true,
    cell: (row) => (
      <Link
      to="/loan-info"
        className={`px-2 py-1 rounded-sm text-xs font-medium bg-blue-500 text-white`}
      >
        Open
      </Link>
    ),
  },
];

  return (
    <>
      <div className='flex-1 h-full border border-gray-200 shadow-sm rounded-lg bg-gray-50'>
        {/* header  */}
        <div className='flex justify-between p-3 px-4 bg-gray-100 rounded-t-lg'>
          <div className='text-lg font-semibold self-center'>Loan Approval</div>
          <button onClick={() => navigate("/apply-loan")} className='p-2 px-4 rounded-sm bg-blue-600 text-white flex justify-between gap-3 cursor-pointer'>  Add Loan <IoPerson className='self-center' /></button>
        </div>

        {/* table data */}
        <Table data={allLoansData} columns={columns} />

      </div>
    </>
  )
}

export default LoanApproval