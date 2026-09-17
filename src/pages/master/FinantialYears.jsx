import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoPencil, IoPerson } from "react-icons/io5";
import DataTable from "react-data-table-component";
import { branchData, financialYearData } from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { FaEdit } from "react-icons/fa";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

const FinantialYears = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { name: "Finantial Year", selector: (row) => row.year, sortable: true },
    { name: "Start Date", selector: (row) => row.start_date },
    { name: "Status", selector: (row) => row.status },
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
  ];

  return (
    <>
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-0">
          <h2 className="text-md font-medium self-center">Financial Years</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 p-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 cursor-pointer text-sm font-medium text-white"
          >
            Add Financial Year
          </button>
        </div>

        {/* Table */}
        <Table data={financialYearData} columns={columns} />
      </div>

      <Modal
        title="Add Financial Year"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="mt-6 grid grid-cols-2 gap-4">
          <TextInput label="Financial Year" placeholder="2025-2026" />

          <TextInput label="Start Date" type="date" />

          <TextInput label="Start Date" type="date" />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            btnName={"Cancel"}
            style={"border border-gray-200 hover:bg-gray-100"}
          />
          <Button
            btnName={"Submit"}
            style={"bg-primary text-white hover:bg-primary/90"}
          />
        </div>
      </Modal>
    </>
  );
};

export default FinantialYears;
