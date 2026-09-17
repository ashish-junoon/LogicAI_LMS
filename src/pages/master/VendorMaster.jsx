import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoPerson } from "react-icons/io5";
import DataTable from "react-data-table-component";
import { branchData } from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

const VendorMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorList, setVendorList] = useState([
    {
      id: 1,
      vandor_name: "JANA",
      vendor_code: "V001",
      created_by: "Rohit koli",
      created_date: "08-09-2026",
      is_active: false,
    },
    {
      id: 2,
      vandor_name: "VELEDIAN",
      vendor_code: "V002",
      created_by: "Anil kumar",
      created_date: "02-09-2026",
      is_active: true,
    },
  ]);

  const columns = [
    { name: "Vendor Name.", selector: (row) => row.vandor_name },
    { name: "Vendor Code", selector: (row) => row.vendor_code },
    { name: "Created By", selector: (row) => row.created_by },
    { name: "Created Date", selector: (row) => row.created_date },
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
        <TogleInput
          checked={row.is_active}
          onChange={() => {
            setVendorList((prev) =>
              prev.map((v) =>
                v.id != row.id ? v : { ...row, is_active: !row.is_active },
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
        {/* header  */}
        <div className="flex justify-between items-center p-0 px-4">
          <div className="text-md font-medium self-center">Vendor Master</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
          >
            {" "}
            Add Vendor{" "}
          </button>
        </div>

        {/* table data */}
        <Table data={vendorList} columns={columns} />
      </div>

      <Modal
        title={"Add Vendor"}
        // description={'Read-only asset return status for this offboarding employee.'}a
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {/* content  */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <TextInput label={"Vendor Name"} placeholder={"Vendor Name"} />
          {/* <TextInput label={"Vendor Code"} placeholder={"address"} /> */}
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

export default VendorMaster;
