import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import DataTable from "react-data-table-component";
import { branchData } from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import DateInput from "../../components/fields/DateInput";
import SelectInput from "../../components/fields/SelectInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

const BranchList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchList, setBranchList] = useState(branchData);

  const columns = [
    {
      name: "Sr No",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Branch Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Branch Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Branch Code",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "Owner Name",
      selector: (row) => row.manager,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Branch Email",
      selector: (row) => row.email,
    },
    {
      name: "Opening Date",
      selector: (row) => row.opening_date,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Pin Code",
      selector: (row) => row.pin,
      sortable: true,
    },
    {
      name: "Latitude",
      selector: (row) => row.lat,
      sortable: true,
    },
    {
      name: "Longitude",
      selector: (row) => row.long,
      sortable: true,
    },
    // {
    //   name: "Branch Lat & Long",
    //   selector: (row) => 
    //   <a
    //     href={`https://www.google.com/maps/@${row.lat},${row.long},2912m`}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //     className="text-primary hover:underline"
    //   >
    //     {row.address}
    //   </a>    },
    {
      name: "Action",
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
      center: true,
      selector: (row) => (
        <TogleInput
          checked={row.isActive}
          onChange={() => {
            setBranchList((prev) =>
              prev.map((branch) =>
                branch.id !== row.id
                  ? branch
                  : {
                      ...branch,
                      isActive: !branch.isActive,
                    },
              ),
            );
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center p-0 px-4">
          <div className="text-md font-medium self-center">
            All Branches
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
          >
            New Branch
          </button>
        </div>

        {/* Table */}
        <Table data={branchList} columns={columns} />
      </div>

      {/* Add Branch Modal */}
      <Modal
        title="Add New Branch"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="grid grid-cols-2 gap-3 mt-6">

          <TextInput
            label="Branch Name"
            placeholder="Enter branch name"
          />

          <SelectInput
            label="Branch Type"
            placeholder="Enter branch type"
            options={[
              {label: "Head Office", value: "Head Office"},
              {label: "Project Office", value: "Project Office"},
              {label: "Branch", value: "Branch"},
            ]}
          />

          <TextInput
            label="Manager / Owner Name"
            placeholder="Enter manager name"
          />

          <TextInput
            label="Contact No."
            placeholder="Enter contact number"
          />

          <TextInput
            label="Branch Email"
            placeholder="Enter branch email"
          />

          <DateInput
            label="Opening Date"
            type="date"
          />



          <TextInput
            label="Pin Code"
            placeholder="Enter pin code"
          />

          <div className="col-span-1">
            <TextInput
              label="Address"
              placeholder="Enter branch address"
            />
          </div>

          <TextInput
            label="Latitude"
            placeholder="Enter latitude"
          />

          <TextInput
            label="Longitude"
            placeholder="Enter longitude"
          />

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <Button
            btnName="Cancel"
            onClick={() => setIsModalOpen(false)}
            style="border border-gray-200 hover:bg-gray-100"
          />

          <Button
            btnName="Submit"
            style="bg-primary text-white hover:bg-primary/90"
          />
        </div>
      </Modal>
    </>
  );
};

export default BranchList;