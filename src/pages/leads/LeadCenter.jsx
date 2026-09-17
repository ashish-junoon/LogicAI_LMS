import React, { useState } from "react";
import Icon from "../../components/utils/Icon";
import { IoPerson } from "react-icons/io5";
import DataTable from "react-data-table-component";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import { Link, useNavigate } from "react-router-dom";
import { allProductData } from "../../content/masterData";
import FilterCard from "../../components/utils/FilterCard";
import SelectInput from "../../components/fields/SelectInput";
import DateInput from "../../components/fields/DateInput";

const LeadCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const navigate = useNavigate();

  const handleFilterBtn = () => {
    setIsOpenFilter((prev) => !prev);
  };

  const columns = [
    {
      name: "Sr No",
      selector: (row) => row.index,
      sortable: true,
      width: "100px",
    },
    {
      name: "User Id",
      selector: (row) => row.userId,
      sortable: true,
    },
    {
      name: "Lead Id",
      selector: (row) => row.leadId,
      sortable: true,
    },
    {
      name: "Loan Id",
      selector: (row) => row.loanId,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      right: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.product,
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.createdBy,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => (
        <Link
          to="/product-leads-detail"
          className={`p-1.5 rounded-sm text-xs font-medium bg-primary`}
        >
          <Icon name="FaRegEye" size={15} color={"white"} />
        </Link>
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* header  */}
        <div className="flex justify-between py-0 px-4">
          <div className="text-md font-medium self-center">
            All Product Leads
          </div>
        </div>

        {isOpenFilter && (
          <FilterCard
            title="Loan Filters"
            defaultOpen={false}
            handleFilterBtn={handleFilterBtn}
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
              <div> 
                <TextInput label={"Search"} placeholder={"Search here"} />
              </div>

              <div>
                <SelectInput
                  label="Select Product"
                  name="currentState"
                  placeholder="ALL"
                  options={[
                    { label: "PaisaUdhar", value: "PU" },
                    { label: "EarlyWages", value: "EW" },
                    { label: "Instapaise", value: "IP" },
                    { label: "Refyne", value: "RF" },
                    { label: "MSME", value: "MSME" },
                    { label: "SME", value: "SME" },
                    { label: "JLG", value: "JLG" },
                  ]}
                />
              </div>

              <div>
                <DateInput label={"Start Date"} />
              </div>
              <div>
                <DateInput label={"End Date"} />
              </div>

              <div className="flex items-end">
                <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer">
                  Apply Filters
                </button>
              </div>
            </div>
          </FilterCard>
        )}

        {/* table data */}
        <Table
          data={allProductData}
          columns={columns}
          handleFilterBtn={handleFilterBtn}
        />
      </div>
    </>
  );
};

export default LeadCenter;
