import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoMap, IoPerson, IoTrashBin } from "react-icons/io5";
import DataTable from "react-data-table-component";
import {
  advanceEmiCustomers,
  branchData,
  branchManagerData,
  cityData,
  relationshipData,
  stateData,
} from "../../content/masterData";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Chip from "../../components/utils/Chip";
import Button from "../../components/utils/Button";
import { useNavigate } from "react-router-dom";

const AdvanceEMI = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: 70,
      center: true,
    },
    {
      name: "Customer ID",
      selector: (row) => row.customerId,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
    },
    {
      name: "Loan No.",
      selector: (row) => row.loanNo,
    },
    {
      name: "EMI Amount",
      selector: (row) => `₹ ${row.emiAmount}`,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
    },
    {
      name: "Pending EMI",
      selector: (row) => row.pendingEmi,
      center: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Chip
          color={
            row.status === "Paid"
              ? "green"
              : row.status === "Overdue"
                ? "red"
                : "yellow"
          }
          title={row.status}
        />
      ),
      center: true,
    },
    {
      name: "Action",
      cell: () => (
        <Button
          onClick={() => navigate("/emi-details")}
          btnName={"View"}
          style="bg-primary py-1.5 text-white  hover:bg-blue-700"
        />
      ),
      center: true,
      width: 150,
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* header  */}
        <div className="flex justify-between py-0 px-4">
          <div className="text-md font-medium self-center">
            Advance EMI Customers
          </div>
        </div>

        {/* table data */}
        <Table data={advanceEmiCustomers} columns={columns} />
      </div>
    </>
  );
};

export default AdvanceEMI;
