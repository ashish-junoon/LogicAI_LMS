import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoMap, IoTrashBin } from "react-icons/io5";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import { FaUser } from "react-icons/fa";
import SelectInput from "../../components/fields/SelectInput";

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData = [
    {
      emp_id: "EMP0011",
      id: 1,
      full_name: "Rahul Sharma",
      gender: "Male",
      email_id: "rahul.sharma@example.com",
      mobile: "9876543210",
      aadhaar_number: "458712369845",
      pan_number: "ABCDE1234F",
      branch: "Delhi Main Branch",
      department: "Credit",
      designation: "Credit Manager",
      role: "Manager",
      view_permision: "Yes",
      is_active: true,
    },
    {
      emp_id: "EMP0012",
      id: 2,
      full_name: "Priya Verma",
      gender: "Female",
      email_id: "priya.verma@example.com",
      mobile: "9876501234",
      aadhaar_number: "569823147856",
      pan_number: "FGHIJ5678K",
      branch: "Noida Branch",
      department: "Operations",
      designation: "Operations Executive",
      role: "Executive",
      view_permision: "Yes",
      is_active: true,
    },
    {
      emp_id: "EMP0013",
      id: 3,
      full_name: "Amit Kumar",
      gender: "Male",
      email_id: "amit.kumar@example.com",
      mobile: "9812345678",
      aadhaar_number: "784512369874",
      pan_number: "KLMNO9012P",
      branch: "Gurgaon Branch",
      department: "Sales",
      designation: "Sales Officer",
      role: "Officer",
      view_permision: "No",
      is_active: false,
    },
    {
      emp_id: "EMP0014",
      id: 4,
      full_name: "Sneha Kapoor",
      gender: "Female",
      email_id: "sneha.kapoor@example.com",
      mobile: "9123456789",
      aadhaar_number: "321456789012",
      pan_number: "QRSTU3456V",
      branch: "Mumbai Branch",
      department: "Finance",
      designation: "Finance Executive",
      role: "Executive",
      view_permision: "Yes",
      is_active: true,
    },
  ];

  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "60px",
      center: true,
    },
    {
      name: "Emp Id",
      selector: (row) => row.emp_id,
      sortable: true,
      wrap: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.full_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
      width: "100px",
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.email_id,
      sortable: true,
      wrap: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
      width: "130px",
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      center: true,
    },
    {
      name: "View Permission",
      selector: (row) => row.view_permision,
      sortable: true,
      center: true,
      width: "150px",
    },
    {
      name: "Action",
      center: true,
      width: "100px",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => handleEdit(row)} title="Edit">
            <Icon name="FaEdit" size={18} color="black" />
          </button>
        </div>
      ),
    },
    {
      name: "Status",
      center: true,
      width: "100px",
      cell: (row) => (
        <TogleInput
          checked={row.is_active}
          onChange={() => handleStatusChange(row)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* header  */}
        <div className="flex justify-between px-4">
          <div className="text-md font-medium self-center">Manage User</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 p-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 cursor-pointer text-sm font-medium text-white"
          >
            {" "}
            Add User <FaUser className="self-center" />
          </button>
        </div>

        {/* table data */}
        <Table data={userData} columns={columns} />
      </div>

      <Modal
        title={"Add User"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <TextInput label="Full Name" placeholder="Enter Full Name" />

            <SelectInput
              label="Gender"
              placeholder="Select Gender"
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
            />

            <TextInput
              label="Email"
              type="email"
              placeholder="Enter Email Address"
            />

            <TextInput
              label="Mobile Number"
              type="tel"
              placeholder="Enter Mobile Number"
              maxLength={10}
            />

            <TextInput
              label="Aadhaar Number"
              placeholder="Enter Aadhaar Number"
              maxLength={12}
            />

            <TextInput
              label="PAN Number"
              placeholder="Enter PAN Number"
              maxLength={10}
            />

            <SelectInput
              label="Branch"
              placeholder="Select Branch"
              options={[
                { label: "Delhi Main Branch", value: "Delhi Main Branch" },
                { label: "Noida Branch", value: "Noida Branch" },
                { label: "Gurgaon Branch", value: "Gurgaon Branch" },
                { label: "Mumbai Branch", value: "Mumbai Branch" },
              ]}
            />

            <SelectInput
              label="Department"
              placeholder="Select Department"
              options={[
                { label: "Credit", value: "Credit" },
                { label: "Operations", value: "Operations" },
                { label: "Sales", value: "Sales" },
                { label: "Finance", value: "Finance" },
              ]}
            />

            <SelectInput
              label="Designation"
              placeholder="Select Designation"
              options={[
                { label: "Credit Manager", value: "Credit Manager" },
                {
                  label: "Operations Executive",
                  value: "Operations Executive",
                },
                { label: "Sales Officer", value: "Sales Officer" },
                { label: "Finance Executive", value: "Finance Executive" },
              ]}
            />

            <SelectInput
              label="Role"
              placeholder="Select Role"
              options={[
                { label: "Manager", value: "Manager" },
                { label: "Executive", value: "Executive" },
                { label: "Officer", value: "Officer" },
                { label: "Admin", value: "Admin" },
              ]}
            />

            <SelectInput
              label="View Permission"
              placeholder="Select View Permission"
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              btnName={"Cancel"}
              onClick={() => setIsModalOpen(false)}
              style={"border border-gray-200 hover:bg-gray-100"}
            />

            <Button
              btnName={"Submit"}
              style={"bg-primary text-white hover:bg-primary/90"}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageUser;
