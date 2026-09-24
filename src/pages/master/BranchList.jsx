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
  GetAllBranches,
  UpdateBranch,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import Loader from "../../components/utils/Loader";
import { useFormik } from "formik";

const BranchList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchList, setBranchList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);

  //? FETCHING ALL BRANCH LIST
  const fetchAllBranches = async () => {
    try {
      setIsLoading(true);
      const response = await GetAllBranches();
      const transformedData = response.data?.map((d, i) => {
        return { ...d, sn: i + 1 };
      });
      setBranchList(transformedData);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //? TO ADD BRANCH
  const handleAddBranch = () => {
    setIsEdit(false);
    setEditingBranchId(null);
    branchFormik.resetForm();
    setIsModalOpen(true);
  };

  //? TO EDIT BRANCH
  const handleEditBranch = (branch) => {
    setIsEdit(true);
    setEditingBranchId(branch.id);

    branchFormik.setValues({
      branch_name: branch.branch_name || "",
      branch_type: branch.branch_type || "",
      branch_code: branch.branch_code || "",
      owner_name: branch.owner_name || "",
      branchOffice_contactNumber: branch.branchOffice_contactNumber || "",
      branch_emailid: branch.branch_emailid || "",
      date_of_opening: branch.date_of_opening || "",
      branch_address: branch.branch_address || "",
      branch_pin_code: branch.branch_pin_code || "",
      branch_lat: branch.branch_lat_log?.split(",")[0] || "",
      branch_log: branch.branch_lat_log?.split(",")[1] || "",
    });
    setIsModalOpen(true);
  };

  //? FORMIK FUNCTION TO ADD/EDIT BRANCH DATA
  const branchFormik = useFormik({
    initialValues: {
      branch_name: "",
      branch_type: "",
      branch_code: "",
      owner_name: "",
      branchOffice_contactNumber: "",
      branch_emailid: "",
      date_of_opening: "",
      branch_address: "",
      branch_pin_code: "",
      branch_lat: "",
      branch_log: "",
    },

    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          branch_name: values.branch_name,
          branch_type: values.branch_type,
          branch_code: values.branch_code,
          owner_name: values.owner_name,
          branchOffice_contactNumber: values.branchOffice_contactNumber,
          branch_emailid: values.branch_emailid,
          date_of_opening: values.date_of_opening,
          branch_address: values.branch_address,
          branch_pin_code: values.branch_pin_code,
          branch_lat_log: `${values.branch_lat},${values.branch_log}`,
          is_active: false,
          created_by: "ADMIN",
        };

        let response;

        if (isEdit) {
          response = await UpdateBranch({ id: editingBranchId, ...req });
        } else {
          response = await CreateBranch(req);
        }

        if (response?.code === 1) {
          fetchAllBranches();
          toast.success(
            response.msg ||
              (isEdit
                ? "Branch updated successfully!"
                : "Branch created successfully!"),
          );
          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingBranchId(null);
        } else {
          toast.info(
            response?.msg ||
              (isEdit ? "Unable to update branch!" : "Unable to add branch!"),
          );
        }
      } catch (error) {
        console.error(
          isEdit ? "Error in updating branch" : "Error in creating branch",
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
      name: "Branch Name",
      selector: (row) => row.branch_name,
      sortable: true,
    },
    {
      name: "Branch Type",
      selector: (row) => row.branch_type,
      sortable: true,
    },
    {
      name: "Branch Code",
      selector: (row) => row.branch_code,
      sortable: true,
    },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row.branchOffice_contactNumber,
      sortable: true,
    },
    {
      name: "Branch Email",
      selector: (row) => row.branch_emailid,
    },
    {
      name: "Opening Date",
      selector: (row) => row.date_of_opening,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.branch_address,
    },
    {
      name: "Pin Code",
      selector: (row) => row.branch_pin_code,
      sortable: true,
    },
    {
      name: "Latitude",
      selector: (row) => row.branch_lat_log?.split(",")[0],
      sortable: true,
    },
    {
      name: "Longitude",
      selector: (row) => row.branch_lat_log?.split(",")[0],
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
            setBranchList((prev) =>
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
          <div className="text-md font-medium self-center">All Branches</div>

          <button
            onClick={() => handleAddBranch()}
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
        title={isEdit ? "Update Branch" : "Add New Branch"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={branchFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <TextInput
              label="Branch Name"
              name={"branch_name"}
              value={branchFormik.values.branch_name}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
              placeholder="Enter branch name"
            />

            <SelectInput
              label="Branch Type"
              placeholder="Enter branch type"
              name={"branch_type"}
              value={branchFormik.values.branch_type}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
              options={[
                { label: "Head Office", value: "Head Office" },
                { label: "Project Office", value: "Project Office" },
                { label: "Branch", value: "Branch" },
              ]}
            />

            <TextInput
              label="Branch Code"
              placeholder="Enter branch code"
              name={"branch_code"}
              value={branchFormik.values.branch_code}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
            />

            <TextInput
              label="Manager / Owner Name"
              placeholder="Enter manager name"
              name={"owner_name"}
              value={branchFormik.values.owner_name}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
            />

            <TextInput
              label="Contact No."
              placeholder="Enter contact number"
              value={branchFormik.values.branchOffice_contactNumber}
              name={"branchOffice_contactNumber"}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
            />

            <TextInput
              label="Branch Email"
              placeholder="Enter branch email"
              name={"branch_emailid"}
              value={branchFormik.values.branch_emailid}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
            />

            <DateInput
              label="Opening Date"
              type="date"
              name={"date_of_opening"}
              value={branchFormik.values.date_of_opening}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
            />

            <TextInput
              label="Pin Code"
              placeholder="Enter pin code"
              name={"branch_pin_code"}
              value={branchFormik.values.branch_pin_code}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
            />

            <div className="col-span-2">
              <TextInput
                label="Address"
                placeholder="Enter branch address"
                name={"branch_address"}
                value={branchFormik.values.branch_address}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
            </div>

            <TextInput
              label="Latitude"
              placeholder="Enter latitude"
              name={"branch_lat"}
              value={branchFormik.values.branch_lat}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
            />

            <TextInput
              label="Longitude"
              placeholder="Enter longitude"
              name={"branch_log"}
              value={branchFormik.values.branch_log}
              onChange={branchFormik.handleChange}
              onBlur={branchFormik.handleBlur}
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

export default BranchList;
