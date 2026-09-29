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
import * as Yup from 'yup'

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

  //? TO TOGGLE BRANCH STATUS
  const handleToggleStatus = async (row) => {
    const nextStatus = !row?.is_active;

    // Optimistic update
    setBranchList((prev) =>
      prev.map((branch) =>
        branch.id !== row?.id ? branch : { ...branch, is_active: nextStatus }
      )
    );

    try {
      const req = {
        id: row?.id,
        branch_name: row?.branch_name,
        branch_type: row?.branch_type,
        branch_code: row?.branch_code,
        owner_name: row?.owner_name,
        branchOffice_contactNumber: row?.branchOffice_contactNumber,
        branch_emailid: row?.branch_emailid,
        date_of_opening: row?.date_of_opening,
        branch_address: row?.branch_address,
        branch_pin_code: row?.branch_pin_code,
        branch_lat_log: row?.branch_lat_log,
        is_active: nextStatus,
        created_by: "ADMIN",
      };

      const response = await UpdateBranch(req);

      if (response?.status) {
        toast.success(response?.msg || "Status updated successfully!");
      } else {
        // Revert on failure
        setBranchList((prev) =>
          prev.map((branch) =>
            branch.id !== row?.id ? branch : { ...branch, is_active: row?.is_active }
          )
        );
        toast.info(response?.msg || "Unable to update status!");
      }
    } catch (error) {
      // Revert on error
      setBranchList((prev) =>
        prev.map((branch) =>
          branch.id !== row?.id ? branch : { ...branch, is_active: row?.is_active }
        )
      );

      console.error("Error toggling branch status:", error);

      toast.error(
        error?.response?.data?.title ||
        error?.response?.data?.errors?.request?.[0] ||
        error?.message ||
        "Something went wrong!"
      );
    }
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

    validationSchema: Yup.object({
      branch_name: Yup.string()
        .trim()
        .required("Branch name is required")
        .min(2, "Branch name must be at least 2 characters")
        .max(100, "Branch name cannot exceed 100 characters"),

      branch_type: Yup.string()
        .required("Branch type is required")
        .oneOf(
          ["Head Office", "Project Office", "Branch"],
          "Please select a valid branch type"
        ),

      branch_code: Yup.string()
        .trim()
        .required("Branch code is required")
        .max(20, "Branch code cannot exceed 20 characters"),

      owner_name: Yup.string()
        .trim()
        .required("Manager / Owner name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

      branchOffice_contactNumber: Yup.string()
        .trim()
        .required("Contact number is required")
        .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),

      branch_emailid: Yup.string()
        .trim()
        .required("Branch email is required")
        .email("Enter a valid email address"),

      date_of_opening: Yup.date()
        .required("Opening date is required")
        .max(new Date(), "Opening date cannot be in the future")
        .typeError("Enter a valid date"),

      branch_address: Yup.string()
        .trim()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters")
        .max(250, "Address cannot exceed 250 characters"),

      branch_pin_code: Yup.string()
        .trim()
        .required("Pin code is required")
        .matches(/^[0-9]{6}$/, "Pin code must be exactly 6 digits"),

      branch_lat: Yup.number()
        .required("Latitude is required")
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .typeError("Latitude must be a valid number"),

      branch_log: Yup.number()
        .required("Longitude is required")
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .typeError("Longitude must be a valid number"),
    }),


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
          is_active: isEdit ? branchFormik.values.is_active : false,
          created_by: "ADMIN",
        };

        let response;

        if (isEdit) {
          response = await UpdateBranch({ id: editingBranchId, ...req });
        } else {
          response = await CreateBranch(req);
        }

        if (response?.status) {
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
      selector: (row) => row?.sn,
      sortable: true,
      width: "80px",
    },
    {
      name: "Branch Name",
      selector: (row) => row?.branch_name || '-',
      sortable: true,
    },
    {
      name: "Branch Type",
      selector: (row) => row?.branch_type || '-',
      sortable: true,
    },
    {
      name: "Branch Code",
      selector: (row) => row?.branch_code || '-',
      sortable: true,
    },
    {
      name: "Owner Name",
      selector: (row) => row?.owner_name || '-',
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row?.branchOffice_contactNumber || '-',
      sortable: true,
    },
    {
      name: "Branch Email",
      selector: (row) => row?.branch_emailid || '-',
    },
    {
      name: "Opening Date",
      selector: (row) => row?.date_of_opening || '-',
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row?.branch_address || '-',
    },
    {
      name: "Pin Code",
      selector: (row) => row?.branch_pin_code || '-',
      sortable: true,
    },
    {
      name: "Latitude",
      selector: (row) => row?.branch_lat_log?.split(",")[0] || '-',
      sortable: true,
    },
    {
      name: "Longitude",
      selector: (row) => row?.branch_lat_log?.split(",")[0] || '-',
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
          checked={row?.is_active}
          onChange={() => handleToggleStatus(row)}
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

  
const ErrorText = ({ name }) =>
  branchFormik.touched[name] && branchFormik.errors[name] ? (
    <p className="mt-1 text-xs text-red-500">{branchFormik.errors[name]}</p>
  ) : null;

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
        onClose={() => {
          setIsModalOpen(false);
          branchFormik.resetForm();
          setIsEdit(false);
          setEditingBranchId(null);
        }}
      >
        <form onSubmit={branchFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div>
              <TextInput
                label="Branch Name"
                name="branch_name"
                value={branchFormik.values.branch_name}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
                placeholder="Enter branch name"
              />
              <ErrorText name="branch_name" />
            </div>

            <div>
              <SelectInput
                label="Branch Type"
                placeholder="Enter branch type"
                name="branch_type"
                value={branchFormik.values.branch_type}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
                options={[
                  { label: "Head Office", value: "Head Office" },
                  { label: "Project Office", value: "Project Office" },
                  { label: "Branch", value: "Branch" },
                ]}
              />
              <ErrorText name="branch_type" />
            </div>

            <div>
              <TextInput
                label="Branch Code"
                placeholder="Enter branch code"
                name="branch_code"
                value={branchFormik.values.branch_code}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="branch_code" />
            </div>

            <div>
              <TextInput
                label="Manager / Owner Name"
                placeholder="Enter manager name"
                name="owner_name"
                value={branchFormik.values.owner_name}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="owner_name" />
            </div>

            <div>
              <TextInput
                label="Contact No."
                placeholder="Enter contact number"
                name="branchOffice_contactNumber"
                value={branchFormik.values.branchOffice_contactNumber}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="branchOffice_contactNumber" />
            </div>

            <div>
              <TextInput
                label="Branch Email"
                placeholder="Enter branch email"
                name="branch_emailid"
                value={branchFormik.values.branch_emailid}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="branch_emailid" />
            </div>

            <div>
              <DateInput
                label="Opening Date"
                type="date"
                name="date_of_opening"
                value={branchFormik.values.date_of_opening}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="date_of_opening" />
            </div>

            <div>
              <TextInput
                label="Pin Code"
                placeholder="Enter pin code"
                name="branch_pin_code"
                value={branchFormik.values.branch_pin_code}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="branch_pin_code" />
            </div>

            <div className="col-span-2">
              <TextInput
                label="Address"
                placeholder="Enter branch address"
                name="branch_address"
                value={branchFormik.values.branch_address}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="branch_address" />
            </div>

            <div>
              <TextInput
                label="Latitude"
                placeholder="Enter latitude"
                name="branch_lat"
                value={branchFormik.values.branch_lat}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="branch_lat" />
            </div>

            <div>
              <TextInput
                label="Longitude"
                placeholder="Enter longitude"
                name="branch_log"
                value={branchFormik.values.branch_log}
                onChange={branchFormik.handleChange}
                onBlur={branchFormik.handleBlur}
              />
              <ErrorText name="branch_log" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                branchFormik.resetForm();
                setIsEdit(false);
                setEditingBranchId(null);
              }}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={!branchFormik.isValid || branchFormik.isSubmitting}
              style="bg-primary text-sm text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};


export default BranchList;
