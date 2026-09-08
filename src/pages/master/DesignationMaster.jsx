import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoMap, IoPerson, IoTrashBin } from "react-icons/io5";
import DataTable from "react-data-table-component";
import {
  branchData,
  branchManagerData,
  cityData,
  occupationData,
  relationshipData,
  stateData,
} from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import TogleInput from "../../components/fields/TogleInput";

const DesignationMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const designations = [
  {
    designation: "Software Engineer",
    matrix: 80,
    isActive: true,
  },
  {
    designation: "Senior Software Engineer",
    matrix: 90,
    isActive: true,
  }
]

const columns = [
  {
    name: "#",
    selector: (row, i) => i + 1,
    sortable: true,
    width: 60,
    center: true,
  },
  {
    name: "Designation",
    selector: (row) => row.designation,
    sortable: true,
  },
  {
    name: "Matrix Value (%)",
    selector: (row) => row.matrix,
    sortable: true,
  },
  {
    name: "Action",
    width: 100,
    center: true,
    selector: (row) => (
      <div className="flex gap-5">
        <button>
          <Icon name="FaEdit" size={18} color="black" />
        </button>
      </div>
    ),
  },
  {
    name: "Status",
    width: 100,
    center: true,
    selector: (row) => (
      <TogleInput
        checked={row.isActive}
        onChange={() => {}}
      />
    ),
  },
  {
    name: "Delete",
    selector: () => (
      <IoTrashBin color="red" size={16} />
    ),
    width: 100,
    center: true,
  },
];
  return (
    <>
      <div className="flex-1 h-full border border-gray-200 shadow-sm rounded-lg bg-gray-50">
        {/* header  */}
        <div className="flex justify-between p-3 px-4 bg-gray-100 rounded-t-lg">
          <div className="text-lg font-semibold self-center">
            Occupation Master
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 font-semibold text-sm cursor-pointer text-white flex justify-between gap-3"
          >
            {" "}
            Add Designation
          </button>
        </div>

        {/* table data */}
        <Table data={designations} columns={columns} />
      </div>

      <Modal
        title={"Add Disignation"}
        // description={'Read-only asset return status for this offboarding employee.'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {/* content  */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <TextInput label="Disignation" placeholder="Enter Disignation" />
          <TextInput label="Metrix" placeholder="Enter metrix" />
        </div>
      </Modal>
    </>
  );
};

export default DesignationMaster;
