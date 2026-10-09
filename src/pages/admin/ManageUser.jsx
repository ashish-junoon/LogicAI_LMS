import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";

import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import SelectInput from "../../components/fields/SelectInput";
import Button from "../../components/utils/Button";

import { GetAllUsers, CreateUsers, UpdateUsers } from "../../api/userApi.js";
import { GetAllBranches, GetAllDepartments, GetAllDesignations } from "../../api/mastersApi.js";

const initialValues = {
  full_name: "",
  gender: "",
  email_id: "",
  mobile: "",
  aadhaar_number: "",
  pan_number: "",
  branch: "",
  department: "",
  designation: "",
  role: "",
  report_view: true,
  is_active: false
};

const ManageUser = () => {
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [designationOptions, setdesignationOptions] = useState([]);
  const [departmentOptions, setdepartmentOptions] = useState([]);
  const [branchOptions, setbranchOptions] = useState([]);

  // Replace these sample options with your master API data.
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const roleOptions = [
    { label: "Manager", value: "Manager" },
    { label: "Executive", value: "Executive" },
    { label: "Officer", value: "Officer" },
    { label: "Admin", value: "Admin" },
  ];

  const permissionOptions = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  // =========================================================
  // FETCH ALL DESIGNATIONS
  // =========================================================
  const fetchAllDesignations = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllDesignations();

      const transformedData =
        response?.data?.map((item, index) => ({
          value: item?.id,
          label: item?.designation,
          sn: index + 1,
        })) || [];

      setdesignationOptions(transformedData);
    } catch (error) {
      console.error("Error fetching designations:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch designations!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FETCH ALL DEPARTMENT
  // =========================================================
  const fetchAllDepartments = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllDepartments();

      const transformedData =
        response?.data?.map((item, index) => ({
          value: item?.id,
          label: item?.department,
          sn: index + 1,
        })) || [];

      setdepartmentOptions(transformedData);
    } catch (error) {
      console.error("Error fetching department:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch department!",
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // =========================================================
  // FETCH ALL BRANCH
  // =========================================================
  const fetchAllBranches = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllBranches();

      const transformedData =
        response?.data?.map((item, index) => ({
          value: item?.id,
          label: item?.branch_name,
          sn: index + 1,
        })) || [];

      setbranchOptions(transformedData);
    } catch (error) {
      console.error("Error fetching brach:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch brach!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDesignations();
    fetchAllDepartments();
    fetchAllBranches()
  }, []);

  // GET ALL USERS
  const fetchAllUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await GetAllUsers();

      const transformedData = (response?.data || []).map((user, index) => ({
        ...user,
        sn: index + 1,
      }));

      setUserList(transformedData);
    } catch (error) {
      console.error("Error fetching users:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch users!",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // FORMIK: ADD / EDIT USER
  const userFormik = useFormik({
    initialValues,

    enableReinitialize: true,

    validationSchema: Yup.object({
      full_name: Yup.string()
        .trim()
        .required("Full name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

      gender: Yup.string().required("Please select gender"),

      email_id: Yup.string()
        .trim()
        .email("Enter a valid email address")
        .required("Email is required"),

      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),

      aadhaar_number: Yup.string()
        .required("Aadhaar number is required")
        .matches(/^[0-9]{12}$/, "Aadhaar number must be 12 digits"),

      pan_number: Yup.string()
        .trim()
        .required("PAN number is required")
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN number"),

      branch: Yup.string().required("Please select branch"),

      department: Yup.string().required("Please select department"),

      designation: Yup.string().required("Please select designation"),

      role: Yup.string().required("Please select role"),

      report_view: Yup.string()
        .oneOf(["true", "false"])
        .required("Please select view permission"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          full_name: values.full_name.trim(),
          gender: values.gender,
          email_id: values.email_id.trim(),
          mobile: values.mobile,
          aadhaar_number: values.aadhaar_number,
          pan_number: values.pan_number.toUpperCase(),
          branch: String(values.branch),
          department: String(values.department),
          designation: String(values.designation),
          role: values.role,
          report_view:
            values.report_view === true || values.report_view === "true",
          created_by: "Admin",
          is_active: values.is_active
        };

        let response;

        if (isEdit) {
          response = await UpdateUsers({
            user_id: editingUserId,
            ...req,
          });
        } else {
          response = await CreateUsers(req);
        }

        if (response?.status) {
          toast.success(
            response?.message ||
              (isEdit
                ? "User updated successfully!"
                : "User created successfully!"),
          );

          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingUserId(null);

          await fetchAllUsers();
        } else {
          toast.info(
            response?.message ||
              (isEdit ? "Unable to update user!" : "Unable to add user!"),
          );
        }
      } catch (error) {
        console.error(
          isEdit ? "Error updating user:" : "Error creating user:",
          error,
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!",
        );
      }
    },
  });

  // OPEN ADD USER MODAL
  const handleAddUser = () => {
    setIsEdit(false);
    setEditingUserId(null);
    userFormik.resetForm();
    setIsModalOpen(true);
  };

  // OPEN EDIT USER MODAL
  const handleEdit = (user) => {
    setIsEdit(true);
    setEditingUserId(user.user_id);

    userFormik.setValues({
      full_name: user.full_name || "",
      gender: user.gender || "",
      email_id: user.email_id || "",
      mobile: user.mobile || "",
      aadhaar_number: user.aadhaar_number || "",
      pan_number: user.pan_number || "",
      branch: String(user.branch_id ?? ""),
      department: String(user.department_id ?? ""),
      designation: String(user.designation_id ?? ""),
      role: user.role || "",
      report_view: Boolean(user.report_view),
      is_active: user.is_active,
    });

    setIsModalOpen(true);
  };

  // TOGGLE USER STATUS USING UpdateUsers API
  const handleStatusChange = async (row) => {
    const nextStatus = !row?.is_active;

    // Optimistic update
    setUserList((prev) =>
      prev.map((user) =>
        user.user_id !== row?.user_id
          ? user
          : { ...user, is_active: nextStatus },
      ),
    );

    try {
      const req = {
        user_id: row?.user_id,
        full_name: row?.full_name,
        gender: row?.gender,
        email_id: row?.email_id,
        mobile: row?.mobile,
        aadhaar_number: row?.aadhaar_number,
        pan_number: row?.pan_number,
        branch: String(row?.branch_id ?? ""),
        department: String(row?.department_id ?? ""),
        designation: String(row?.designation_id ?? ""),
        role: row?.role,
        report_view: Boolean(row?.report_view),
        created_by: "Admin",
        is_active: nextStatus,
      };

      const response = await UpdateUsers(req);

      if (response?.status) {
        toast.success(response?.message || "Status updated successfully!");
      } else {
        // Revert if API reports failure
        setUserList((prev) =>
          prev.map((user) =>
            user.user_id !== row?.user_id
              ? user
              : { ...user, is_active: row?.is_active },
          ),
        );

        toast.info(response?.message || "Unable to update status!");
      }
    } catch (error) {
      // Revert if request fails
      setUserList((prev) =>
        prev.map((user) =>
          user.user_id !== row?.user_id
            ? user
            : { ...user, is_active: row?.is_active },
        ),
      );

      console.error("Error toggling user status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!",
      );
    }
  };

  // VALIDATION ERROR
  const ErrorText = ({ name }) =>
    userFormik.touched[name] && userFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">{userFormik.errors[name]}</p>
    ) : null;

  // TABLE COLUMNS
  const columns = [
    {
      name: "#",
      selector: (row) => row?.sn,
      sortable: true,
      width: "65px",
      center: true,
    },
    {
      name: "User ID",
      selector: (row) => row?.user_id || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Full Name",
      selector: (row) => row?.full_name || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row) => row?.gender || "-",
      sortable: true,
      width: "100px",
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email_id || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Mobile",
      selector: (row) => row?.mobile || "-",
      sortable: true,
      width: "130px",
    },
    {
      name: "Branch",
      selector: (row) =>
        row?.branch ||
        branchOptions.find(
          (option) => Number(option.value) === Number(row?.branch),
        )?.label ||
        "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Department",
      selector: (row) =>
        row?.department ||
        departmentOptions.find(
          (option) => Number(option.value) === Number(row?.department),
        )?.label ||
        "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Designation",
      selector: (row) => row?.designation || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Role",
      selector: (row) => row?.role || "-",
      sortable: true,
      center: true,
    },
    {
      name: "View Permission",
      selector: (row) => (row?.report_view ? "Yes" : "No"),
      sortable: true,
      center: true,
      width: "150px",
    },
    {
      name: "Action",
      center: true,
      width: "100px",
      cell: (row) => (
        <button type="button" onClick={() => handleEdit(row)} title="Edit User">
          <Icon name="FaEdit" size={18} color="black" />
        </button>
      ),
    },
    {
      name: "Status",
      center: true,
      width: "100px",
      cell: (row) => (
        <TogleInput
          checked={Boolean(row?.is_active)}
          onChange={() => handleStatusChange(row)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 mb-4">
          <div className="text-md font-medium">Manage User</div>

          <button
            type="button"
            onClick={handleAddUser}
            className="flex items-center gap-2 p-1.5 px-3 rounded-sm
              bg-primary hover:bg-primary/90 cursor-pointer
              text-sm font-medium text-white"
          >
            Add User
            <FaUser />
          </button>
        </div>

        {/* TABLE */}
        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading users...
          </div>
        ) : (
          <Table data={userList} columns={columns} />
        )}
      </div>

      {/* ADD / UPDATE USER MODAL */}
      <Modal
        title={isEdit ? "Update User" : "Add User"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          userFormik.resetForm();
          setIsEdit(false);
          setEditingUserId(null);
        }}
      >
        <form onSubmit={userFormik.handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 px-4">
            <div>
              <TextInput
                label="Full Name"
                name="full_name"
                placeholder="Enter Full Name"
                value={userFormik.values.full_name}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="full_name" />
            </div>

            <div>
              <SelectInput
                label="Gender"
                name="gender"
                placeholder="Select Gender"
                options={genderOptions}
                value={userFormik.values.gender}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="gender" />
            </div>

            <div>
              <TextInput
                label="Email"
                name="email_id"
                type="email"
                placeholder="Enter Email Address"
                value={userFormik.values.email_id}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="email_id" />
            </div>

            <div>
              <TextInput
                label="Mobile Number"
                name="mobile"
                type="tel"
                placeholder="Enter Mobile Number"
                maxLength={10}
                value={userFormik.values.mobile}
                onChange={(e) =>
                  userFormik.setFieldValue(
                    "mobile",
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="mobile" />
            </div>

            <div>
              <TextInput
                label="Aadhaar Number"
                name="aadhaar_number"
                placeholder="Enter Aadhaar Number"
                maxLength={12}
                value={userFormik.values.aadhaar_number}
                onChange={(e) =>
                  userFormik.setFieldValue(
                    "aadhaar_number",
                    e.target.value.replace(/\D/g, "").slice(0, 12),
                  )
                }
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="aadhaar_number" />
            </div>

            <div>
              <TextInput
                label="PAN Number"
                name="pan_number"
                placeholder="Enter PAN Number"
                maxLength={10}
                value={userFormik.values.pan_number}
                onChange={(e) =>
                  userFormik.setFieldValue(
                    "pan_number",
                    e.target.value.toUpperCase().slice(0, 10),
                  )
                }
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="pan_number" />
            </div>

            <div>
              <SelectInput
                label="Branch"
                name="branch"
                placeholder="Select Branch"
                options={branchOptions}
                value={userFormik.values.branch}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="branch" />
            </div>

            <div>
              <SelectInput
                label="Department"
                name="department"
                placeholder="Select Department"
                options={departmentOptions}
                value={userFormik.values.department}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="department" />
            </div>

            <div>
              <SelectInput
                label="Designation"
                name="designation"
                placeholder="Select Designation"
                options={designationOptions}
                value={userFormik.values.designation}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="designation" />
            </div>

            <div>
              <SelectInput
                label="Role"
                name="role"
                placeholder="Select Role"
                options={roleOptions}
                value={userFormik.values.role}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="role" />
            </div>

            <div>
              <SelectInput
                label="View Permission"
                name="report_view"
                placeholder="Select View Permission"
                options={permissionOptions}
                value={userFormik.values.report_view}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
              />
              <ErrorText name="report_view" />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6 px-4 pb-4">
            <Button
              btnName="Cancel"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                userFormik.resetForm();
                setIsEdit(false);
                setEditingUserId(null);
              }}
              style="border border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={userFormik.isSubmitting}
              style="bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageUser;
