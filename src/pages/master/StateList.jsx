import React, { useState } from 'react'
import Icon from '../../components/utils/Icon'
import { IoMap, IoPerson, IoTrashBin } from 'react-icons/io5'
import DataTable from 'react-data-table-component'
import { branchData, branchManagerData, relationshipData, stateData } from '../../content/masterData'
import Table from '../../components/Table'
import Modal from '../../components/utils/Modal'
import TextInput from '../../components/fields/TextInput'
import { FaEdit } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'

const StateList = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { name: '#', selector: (row, i) =>i+1, sortable: true, width: 60, center: true },
        { name: 'State', selector: row => row.name, sortable: true},
        { name: 'State Code', selector: row => row.code, sortable: true},
        { name: 'Delete', selector: row => <IoTrashBin color='red' size={16} />, width: 150, center: true },
    ];

    return (
        <>
            <div className='flex-1 h-full border border-gray-200 shadow-sm rounded-lg bg-gray-50'>
                {/* header  */}
                <div className='flex justify-between p-3 px-4 bg-gray-100 rounded-t-lg'>
                    <div className='text-lg font-semibold self-center'>State Master</div>
                    <button onClick={() => setIsModalOpen(true)} className='p-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white cursor-pointer flex justify-between gap-3'> New State <IoMap className='self-center' /></button>
                </div>

                {/* table data */}
                <Table data={stateData} columns={columns} />

            </div>


            <Modal
                title={'Add State'}
                // description={'Read-only asset return status for this offboarding employee.'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {/* content  */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <TextInput label="State Name" placeholder="Enter State Name" />
                    <TextInput label="State Code" placeholder="Enter State Code" />
                </div>

            </Modal>
        </>
    )
}

export default StateList