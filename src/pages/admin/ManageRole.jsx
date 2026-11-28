import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaUserTag } from "react-icons/fa";

import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

// Import your role APIs from the appropriate API file
import { GetAllRoles, CreateRole, UpdateRole } from "../../api/userApi.js";
import { useNavigate } from "react-router-dom";
import { useAuthData } from "../../context/authContext.jsx";

const initialValues = {
  role_name: "",
  is_active: false,
  hierarchy_level: "",
};

const ManageRole = () => {
  const [roleList, setRoleList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const navgate = useNavigate();

  const { authData } = useAuthData();
  // GET ALL ROLES
  const fetchAllRoles = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await GetAllRoles();

      const transformedData = (response?.data || []).map((role, index) => ({
        ...role,
        sn: index + 1,
      }));

      setRoleList(transformedData);
    } catch (error) {
      console.error("Error fetching roles:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch roles!",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  // FORMIK: ADD / EDIT ROLE
  const roleFormik = useFormik({
    initialValues,

    enableReinitialize: true,

    // validationSchema: Yup.object({
    //   role_name: Yup.string()
    //     .trim()
    //     .required("Role name is required")
    //     .min(2, "Role name must be at least 2 characters")
    //     .max(100, "Role name cannot exceed 100 characters"),
    // }),

    validationSchema: Yup.object({
      role_name: Yup.string()
        .trim()
        .required("Role name is required")
        .min(2, "Role name must be at least 2 characters")
        .max(100, "Role name cannot exceed 100 characters"),

      role_code: Yup.string()
        .trim()
        .required("Role code is required")
        .max(50, "Role code cannot exceed 50 characters"),

      hierarchy_level: Yup.number()
        .typeError("Hierarchy level must be a number")
        .integer("Hierarchy level must be an integer")
        .min(0, "Hierarchy level cannot be negative")
        .required("Hierarchy level is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          role_id: isEdit ? editingRoleId : 0,
          role_name: values.role_name.trim(),
          role_code: values.role_code.trim(),
          hierarchy_level: Number(values.hierarchy_level),
          is_active: Boolean(values.is_active),
          created_by: authData?.user_id,
        };

        let response;

        if (isEdit) {
          response = await UpdateRole(payload);
        } else {
          response = await CreateRole(payload);
        }

        if (response?.status) {
          toast.success(
            response?.message ||
              (isEdit
                ? "Role updated successfully!"
                : "Role created successfully!"),
          );

          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingRoleId(null);

          await fetchAllRoles();
        } else {
          toast.info(
            response?.message ||
              (isEdit ? "Unable to update role!" : "Unable to create role!"),
          );
        }
      } catch (error) {
        console.error(
          isEdit ? "Error updating role:" : "Error creating role:",
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

  // OPEN ADD ROLE MODAL
  const handleAddRole = () => {
    setIsEdit(false);
    setEditingRoleId(null);
    roleFormik.resetForm();
    setIsModalOpen(true);
  };

  // OPEN EDIT ROLE MODAL
  // const handleEdit = (role) => {
  //   setIsEdit(true);
  //   setEditingRoleId(role.role_id);

  //   roleFormik.setValues({
  //     role_name: role.role_name || "",
  //     is_active: Boolean(role.is_active),
  //   });

  //   roleFormik.setTouched({});
  //   setIsModalOpen(true);
  // };

  const handleEdit = (role) => {
    setIsEdit(true);
    setEditingRoleId(role.role_id);

    roleFormik.setValues({
      role_name: role.role_name || "",
      role_code: role.role_code || "",
      hierarchy_level: role.hierarchy_level ?? "",
      is_active: Boolean(role.is_active),
    });

    roleFormik.setTouched({});
    setIsModalOpen(true);
  };

  // TOGGLE ROLE STATUS
  const handleStatusChange = async (row) => {
    const previousStatus = Boolean(row?.is_active);
    const nextStatus = !previousStatus;

    // Optimistic update
    setRoleList((prev) =>
      prev.map((role) =>
        role.role_id === row?.role_id
          ? { ...role, is_active: nextStatus }
          : role,
      ),
    );

    try {
      const response = await UpdateRole({
        role_id: row?.role_id,
        role_name: row?.role_name,
        role_code: row?.role_code,
        hierarchy_level: row?.hierarchy_level,
        is_active: nextStatus,
        created_by: authData?.user_id,
      });

      if (response?.status) {
        toast.success(response?.message || "Role status updated successfully!");
      } else {
        // Revert on API failure
        setRoleList((prev) =>
          prev.map((role) =>
            role.role_id === row?.role_id
              ? { ...role, is_active: previousStatus }
              : role,
          ),
        );

        toast.info(response?.message || "Unable to update role status!");
      }
    } catch (error) {
      // Revert on request failure
      setRoleList((prev) =>
        prev.map((role) =>
          role.role_id === row?.role_id
            ? { ...role, is_active: previousStatus }
            : role,
        ),
      );

      console.error("Error updating role status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update role status!",
      );
    }
  };

  // VALIDATION ERROR
  const ErrorText = ({ name }) =>
    roleFormik.touched[name] && roleFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">{roleFormik.errors[name]}</p>
    ) : null;

  // TABLE COLUMNS
  const columns = [
    {
      name: "#",
      selector: (row) => row?.sn,
      sortable: true,
      width: "70px",
      center: true,
    },
    {
      name: "Role ID",
      selector: (row) => row?.role_id ?? "-",
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Role Name",
      selector: (row) => row?.role_name || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      center: true,
      width: "100px",
      cell: (row) => (
        <button type="button" onClick={() => handleEdit(row)} title="Edit Role">
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
          <div className="text-md font-medium">Manage Role</div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navgate(-1)}
              className="flex items-center
              gap-2 py-1.5 px-3 rounded-sm border border-primary cursor-pointer text-sm font-medium text-primary hover:bg-primary/20"
            >
              {/* <Icon name="RiAddLine" size={15} color="white" /> */}
              Go Back
            </button>

            <button
              type="button"
              onClick={handleAddRole}
              className="flex items-center gap-2 p-1.5 px-3 rounded-sm
              bg-primary hover:bg-primary/90 cursor-pointer
              text-sm font-medium text-white"
            >
              Add Role
              <FaUserTag />
            </button>
          </div>
        </div>

        {/* TABLE */}
        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading roles...
          </div>
        ) : (
          <Table data={roleList} columns={columns} />
        )}
      </div>

      {/* ADD / UPDATE ROLE MODAL */}
      <Modal
        title={isEdit ? "Update Role" : "Add Role"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          roleFormik.resetForm();
          setIsEdit(false);
          setEditingRoleId(null);
        }}
      >
        <form onSubmit={roleFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mt-6 px-4">
            <div>
              <TextInput
                label="Role Name"
                name="role_name"
                placeholder="Enter Role Name"
                value={roleFormik.values.role_name}
                onChange={roleFormik.handleChange}
                onBlur={roleFormik.handleBlur}
              />

              <ErrorText name="role_name" />
            </div>

            <div>
              <TextInput
                label="Role Code"
                name="role_code"
                placeholder="Enter Role Code"
                value={roleFormik.values.role_code}
                onChange={roleFormik.handleChange}
                onBlur={roleFormik.handleBlur}
              />
              <ErrorText name="role_code" />
            </div>

            <div>
              <TextInput
                label="Hierarchy Level"
                name="hierarchy_level"
                type="number"
                placeholder="Enter Hierarchy Level"
                value={roleFormik.values.hierarchy_level}
                onChange={roleFormik.handleChange}
                onBlur={roleFormik.handleBlur}
              />
              <ErrorText name="hierarchy_level" />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Active Status
              </label>

              <TogleInput
                checked={Boolean(roleFormik.values.is_active)}
                onChange={(value) => {
                  roleFormik.setFieldValue(
                    "is_active",
                    typeof value === "boolean" ? value : value?.target?.checked,
                  );
                }}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6 px-4 pb-4">
            <Button
              btnName="Cancel"
              type="button"
              disabled={roleFormik.isSubmitting}
              onClick={() => {
                setIsModalOpen(false);
                roleFormik.resetForm();
                setIsEdit(false);
                setEditingRoleId(null);
              }}
              style="border border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={roleFormik.isSubmitting}
              style="bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageRole;
