import React, { useState } from 'react'
import Icon from '../../components/utils/Icon'
import { IoPerson, IoTrashBin } from 'react-icons/io5'
import DataTable from 'react-data-table-component'
import { branchData, branchManagerData, relationshipData } from '../../content/masterData'
import Table from '../../components/Table'
import Modal from '../../components/utils/Modal'
import TextInput from '../../components/fields/TextInput'
import { FaEdit } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'

const Relationships = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { name: '#', selector: (row, i) =>i+1, sortable: true, width: 60, center: true },
        { name: 'Relation', selector: row => row.name, sortable: true, width: '70%' },
        { name: 'Edit', selector: row => <FaEdit color='blue' size={16} />, center: true },
        { name: 'Delete', selector: row => <IoTrashBin color='red' size={16} />, center: true },
        
    ];

    return (
        <>
            <div className='flex-1 h-full border border-gray-200 shadow-sm rounded-lg bg-gray-50'>
                {/* header  */}
                <div className='flex justify-between p-3 px-4 bg-gray-100 rounded-t-lg'>
                    <div className='text-lg font-semibold self-center'>Relationship Master</div>
                    <button onClick={() => setIsModalOpen(true)} className='p-2 px-4 rounded-sm bg-blue-600 text-white flex justify-between gap-3'>  New Relationship <IoPerson className='self-center' /></button>
                </div>

                {/* table data */}
                <Table data={relationshipData} columns={columns} />

            </div>


            <Modal
                title={'Add Relationship'}
                // description={'Read-only asset return status for this offboarding employee.'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {/* content  */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <TextInput label="Relationship" placeholder="Enter relationship name" />
                </div>

            </Modal>
        </>
    )
}

export default Relationships