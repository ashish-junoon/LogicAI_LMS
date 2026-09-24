import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import DateInput from "../../components/fields/DateInput";
import SelectInput from "../../components/fields/SelectInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  CreateBranch,
  CreateBusinessTrade,
  GetAllBusinessTrades,
  UpdateBranch,
  UpdateBusinessTrade,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import Loader from "../../components/utils/Loader";
import { useFormik } from "formik";

const BusinessTradesMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [BusinessTrades, setBusinessTrades] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);

  //? FETCHING ALL BRANCH LIST
  const fetchAllBranches = async () => {
    try {
      setIsLoading(true);
      const response = await GetAllBusinessTrades();
      const transformedData = response.data?.map((d, i) => {
        return { ...d, sn: i + 1 };
      });
      setBusinessTrades(transformedData);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //? TO ADD BRANCH
  const handleAddBranch = () => {
    setIsEdit(false);
    setEditingBusinessId(null);
    BusinessTradeFormik.resetForm();
    setIsModalOpen(true);
  };

  //? TO EDIT BRANCH
  const handleEditBranch = (branch) => {
    setIsEdit(true);
    setEditingBusinessId(branch.id);

    BusinessTradeFormik.setValues({
      business_trade: branch.business_trade || "",
      is_active: branch.is_active,
    });
    setIsModalOpen(true);
  };

  //? FORMIK FUNCTION TO ADD/EDIT BRANCH DATA
  const BusinessTradeFormik = useFormik({
    initialValues: {
      business_trade: "",
      is_active: "",
    },

    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          business_trade: values.business_trade,
          is_active: values.is_active == "true" ? true : false,
          created_by: "ADMIN",
        };

        let response;

        if (isEdit) {
          response = await UpdateBusinessTrade({ id: editingBusinessId, ...req });
        } else {
          response = await CreateBusinessTrade(req);
        }

        if (response?.code === 1) {
          fetchAllBranches();
          toast.success(
            response.msg ||
              (isEdit
                ? "Business Trade updated successfully!"
                : "Business Trade created successfully!"),
          );
          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingBusinessId(null);
        } else {
          toast.info(
            response?.msg ||
              (isEdit ? "Unable to update Business Trade!" : "Unable to add Business Trade!"),
          );
        }
      } catch (error) {
        console.error(
          isEdit ? "Error in updating Business Trade" : "Error in creating Business Trade",
          error,
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.message ||
            "Something went wrong!",
        );
      }
    },
  });

  const columns = [
    {
      name: "#",
      selector: (row) => row.sn,
      sortable: true,
      width: "80px",
    },
    {
      name: "Business Trade",
      selector: (row) => row.business_trade,
      sortable: true,
    },
    {
      name: "Action",
      center: true,
      selector: (row) => (
        <div className="flex gap-5 cursor-pointer">
          <button onClick={() => handleEditBranch(row)}>
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
          checked={row.is_active}
          onChange={() => {
            setBusinessTrades((prev) =>
              prev.map((branch) =>
                branch.id !== row.id
                  ? branch
                  : {
                      ...branch,
                      is_active: !branch.is_active,
                    },
              ),
            );
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchAllBranches();
  }, []);

  // if(isLoading){
  //   return <Loader />
  // }

  return (
    <>
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center p-0 px-4">
          <div className="text-md font-medium self-center">All Business Trade</div>

          <button
            onClick={() => handleAddBranch()}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
          >
            Add Business Trade
          </button>
        </div>

        {/* Table */}
        <Table data={BusinessTrades} columns={columns} />
      </div>

      {/* Add Branch Modal */}
      <Modal
        title={isEdit ? "Update Branch" : "Add New Branch"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={BusinessTradeFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <TextInput
              label="Business Trade"
              name={"business_trade"}
              value={BusinessTradeFormik.values.business_trade}
              onChange={BusinessTradeFormik.handleChange}
              onBlur={BusinessTradeFormik.handleBlur}
              placeholder="Enter Business name"
            />

            <SelectInput
              label="Status"
              placeholder="Select status"
              name={"is_active"}
              value={BusinessTradeFormik.values.is_active}
              onChange={BusinessTradeFormik.handleChange}
              onBlur={BusinessTradeFormik.handleBlur}
              options={[
                { label: "Active", value: true },
                { label: "Deactive", value: false },
              ]}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              onClick={() => setIsModalOpen(false)}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName="Submit"
              type={"submit"}
              style="bg-primary text-sm text-white hover:bg-primary/90"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BusinessTradesMaster;
