import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoPerson } from "react-icons/io5";
import DataTable from "react-data-table-component";
import { branchData } from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";

const BranchList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { name: "Code", selector: (row) => row.code, sortable: true },
    { name: "Address", selector: (row) => row.address },
    { name: "Branch Name", selector: (row) => row.name, right: true },
    { name: "State", selector: (row) => row.state, right: true },
    { name: "Mobile No.", selector: (row) => row.mobile, right: true },
    { name: "City", selector: (row) => row.city, right: true },
    { name: "Manager Name", selector: (row) => row.manager, right: true },
    { name: "Opening Date", selector: (row) => row.opening_date, right: true },
    {
      name: "Action",
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

  // onChange={(e) => setIsActive(e.target.checked)}

  return (
    <>
      <div className="flex-1">
        {/* header  */}
        <div className="flex justify-between items-center p-0 px-4 bg-gray-100 rounded-t-lg">
          <div className="text-md font-medium self-center">All Branches</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
          >
            {" "}
            New Branch{" "}
          </button>
        </div>

        {/* table data */}
        <Table data={branchData} columns={columns} />
      </div>

      <Modal
        title={"Add New Branch"}
        // description={'Read-only asset return status for this offboarding employee.'}a
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {/* content  */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <TextInput label={"Branch Code"} placeholder={"Branch Code"} />
          <TextInput label={"Address"} placeholder={"address"} />

          <TextInput label={"Branch Name"} placeholder={"Branch name"} />
          <TextInput label={"State"} placeholder={"State"} />

          <TextInput label={"Mobile Number"} placeholder={"Mobile Number"} />
          <TextInput label={"City"} placeholder={"City"} />

          <TextInput label={"Manager Name"} placeholder={"Manager Name"} />
          <TextInput label={"Opening Date"} placeholder={"Opening Date"} />
        </div>
      </Modal>
    </>
  );
};

export default BranchList;
