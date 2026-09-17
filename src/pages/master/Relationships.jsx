import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoPerson, IoTrashBin } from "react-icons/io5";
import DataTable from "react-data-table-component";
import {
  branchData,
  branchManagerData,
  relationshipData,
} from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

const Relationships = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      sortable: true,
      width: 60,
      center: true,
    },
    {
      name: "Relation",
      selector: (row) => row.name,
      sortable: true,
      width: "70%",
    },
    {
      name: "Edits",
      center: true,
      selector: (row) => (
        <div className="flex gap-5">
          <button className="">
            <Icon name={"FaEdit"} size={18} color="black" />
          </button>
        </div>
      ),
    },
    {
      name: "Status",
      center: true,
      selector: (row) => (
        <TogleInput checked={row.isActive} onChange={() => {}} />
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* header  */}
        <div className="flex justify-between px-4">
          <div className="text-md font-medium self-center">Relation Master</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 p-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 cursor-pointer text-sm font-medium text-white"
          >
            {" "}
            New Relation <IoPerson className="self-center" />
          </button>
        </div>

        {/* table data */}
        <Table data={relationshipData} columns={columns} />
      </div>

      <Modal
        title={"Add Relationship"}
        // description={'Read-only asset return status for this offboarding employee.'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {/* content  */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <TextInput
            label="Relationship"
            placeholder="Enter relationship name"
          />
        </div>

                <div className="flex justify-end gap-2">
            <Button btnName={"Cancel"} style={"border border-gray-200 hover:bg-gray-100"} />
            <Button btnName={"Submit"} style={"bg-primary text-white hover:bg-primary/90"} />
        </div>
      </Modal>
    </>
  );
};

export default Relationships;
