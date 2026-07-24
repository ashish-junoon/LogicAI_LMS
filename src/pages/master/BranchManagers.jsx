import React, { useState } from 'react'
import Icon from '../../components/utils/Icon'
import { IoPerson } from 'react-icons/io5'
import DataTable from 'react-data-table-component'
import { branchData, branchManagerData } from '../../content/masterData'
import Table from '../../components/Table'
import Modal from '../../components/utils/Modal'
import TextInput from '../../components/fields/TextInput'

const BranchManagers = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { name: 'Manager', selector: row => row.name, sortable: true },
        { name: 'Department', selector: row => row.department },
        { name: 'Address', selector: row => row.address, },
    ];

    return (
        <>
            <div className='flex-1 h-full border border-gray-200 shadow-sm rounded-lg bg-gray-50'>
                {/* header  */}
                <div className='flex justify-between p-3 px-4 bg-gray-100 rounded-t-lg'>
                    <div className='text-lg font-semibold self-center'>Branch Mangers</div>
                    <button onClick={() => setIsModalOpen(true)} className='p-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white cursor-pointer flex justify-between gap-3'> New Manager </button>
                </div>

                {/* table data */}
                <Table data={branchManagerData} columns={columns} />

            </div>


            <Modal
                title={'Add Branch Manager'}
                // description={'Read-only asset return status for this offboarding employee.'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {/* content  */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <TextInput label="Manager Name" placeholder="Enter manager name" />
                    <TextInput label="Department" placeholder="Enter department" />

                    <div className="col-span-2">
                        <TextInput label="Address" placeholder="Enter address" />
                    </div>
                </div>

            </Modal>
        </>
    )
}

export default BranchManagers