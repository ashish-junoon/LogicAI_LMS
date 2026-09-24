import React, { useEffect, useState } from "react";
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
import { GetAllLoans } from "../../api/loan";
import { toast } from "react-toastify";

const LeadCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();


  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await GetAllLoans({
        pageNo: page,
        page_size: perPage,
      })
      if(res?.status) {
        setLoanData(res?.data)
        setTotalRows(res?.total_count)
        // console.log("res data", res?.data)
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLoans();
  }, [page, perPage])


  const handleFilterBtn = () => {
    setIsOpenFilter((prev) => !prev);
  };

  const columns = [
    {
      name: "Actions",
      selector: (row) => row?.status || "-",
      sortable: true,
      center: true,
      cell: (row) => (
        <Link
          to="/product-leads-detail"
          state={{loan_id: row?.loan_id, product_code: row?.product_name}}
          className={`p-1.5 px-2 rounded-sm text-xs font-medium bg-primary flex gap-1 text-white items-center`}
        >
          <Icon name="FaRegEye" size={15} color={"white"} />
          View
        </Link>
      ),
    },
    // {
    //   name: "Sr No",
    //   selector: (row) => row?.index || "-",
    //   sortable: true,
    //   width: "100px",
    // },
    // {
    //   name: "User Id",
    //   selector: (row) => row?.userId || "-",
    //   sortable: true,
    // },
    // {
    //   name: "Lead Id",
    //   selector: (row) => row?.leadId || "-",
    //   sortable: true,
    // },
    {
      name: "Loan Id",
      selector: (row) => row?.loan_id || "-",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row?.customer_name || "-",
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row?.mobile_no || "-",
      sortable: true,
      right: true,
    },
    {
      name: "Prod. Name",
      selector: (row) => row?.product_name || "-",
      sortable: true,
    },
    {
      name: "Disb. Date",
      selector: (row) => row?.disbursement_date?.split(" ")[0] || "-",
      sortable: true,
    },
    {
      name: "Disb. Amt",
      selector: (row) => row?.disbursement_amount || "-",
      sortable: true,
    },
    {
      name: "EMI Date",
      selector: (row) => row?.emi_paid_date?.split(" ")[0] || "-",
      sortable: true,
    },
     {
      name: "Repay. Date",
      selector: (row) => row?.repayment_date?.split(" ")[0] || "-",
      sortable: true,
    },
     {
      name: "Repay. Amt",
      selector: (row) => row?.repayment_amount || "-",
      sortable: true,
    },
    {
      name: "Closing Amt",
      selector: (row) => row?.closing_amt || "-",
      sortable: true,
    },
    // {
    //   name: "Created By",
    //   selector: (row) => row?.createdBy || "-",
    //   sortable: true,
    // },
    
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
          data={loanData}
          columns={columns}
          handleFilterBtn={handleFilterBtn}
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={(page) => {console.log(page); setPage(page)}}
          onChangeRowsPerPage={(perPage) => {console.log(perPage); setPerPage(perPage)}}
        />
      </div>
    </>
  );
};

export default LeadCenter;
