import React, { useState } from 'react'
import Icon from '../../components/utils/Icon'
import { IoMap, IoPerson, IoTrashBin } from 'react-icons/io5'
import DataTable from 'react-data-table-component'
import { advanceEmiCustomers, branchData, branchManagerData, cityData, relationshipData, stateData } from '../../content/masterData'
import Table from '../../components/Table'
import Modal from '../../components/utils/Modal'
import TextInput from '../../components/fields/TextInput'
import { FaEdit } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'
import Chip from '../../components/utils/Chip'
import Button from '../../components/utils/Button'
import { useNavigate } from 'react-router-dom'

const AdvanceEMI = () => {

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            width: 70,
            center: true,
        },
        {
            name: 'Customer ID',
            selector: row => row.customerId,
            sortable: true,
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName,
            sortable: true,
        },
        {
            name: 'Mobile',
            selector: row => row.mobile,
        },
        {
            name: 'Loan No.',
            selector: row => row.loanNo,
        },
        {
            name: 'EMI Amount',
            selector: row => `₹ ${row.emiAmount}`,
            sortable: true,
        },
        {
            name: 'Due Date',
            selector: row => row.dueDate,
        },
        {
            name: 'Pending EMI',
            selector: row => row.pendingEmi,
            center: true,
        },
        {
            name: 'Status',
            cell: row => (
                <Chip
                    color={
                        row.status === "Paid"
                            ? "green"
                            : row.status === "Overdue"
                                ? "red"
                                : "yellow"
                    }
                    title={row.status}
                />
            ),
            center: true,
        },
        {
            name: 'Action',
            cell: () => (
                <Button onClick={() => navigate('/emi-details')} btnName={'View Details'} style="bg-blue-600 text-white  hover:bg-blue-700" />
            ),
            center: true,
            width: 150,
        },
    ];

    return (
        <>

            <div className='flex-1 h-full border border-gray-200 shadow-sm rounded-lg bg-gray-50'>
                {/* header  */}
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Advance EMI Customers
                        </h2>
                    </div>

                </div>

                {/* table data */}
                <Table data={advanceEmiCustomers} columns={columns} />

            </div>


            <Modal
                title={'Add City'}
                // description={'Read-only asset return status for this offboarding employee.'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {/* content  */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <TextInput label="State Name" placeholder="Enter State Name" />
                    <TextInput label="City Name" placeholder="Enter City Name" />
                </div>

            </Modal>
        </>
    )
}

export default AdvanceEMI