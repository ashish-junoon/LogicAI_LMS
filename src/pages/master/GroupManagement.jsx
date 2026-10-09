import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import Icon from "../../components/utils/Icon.jsx";
import Table from "../../components/Table.jsx";
import Modal from "../../components/utils/Modal.jsx";
import TextInput from "../../components/fields/TextInput.jsx";
import TogleInput from "../../components/fields/TogleInput.jsx";
import Button from "../../components/utils/Button.jsx";

import {
  GetAllPageGroups,
  CreatePageGroup,
  UpdatePageGroup,
} from "../../api/userApi.js";
import { useNavigate } from "react-router-dom";

const initialValues = {
  group_name: "",
  group_icon: "",
  group_display_name: "",
  group_display_index: "",
  group_small_discription: "",
  is_active: true,
};

const GroupManagement = () => {
  const [groupList, setGroupList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);

  const navgate = useNavigate()

  // =========================================================
  // FETCH ALL GROUPS
  // =========================================================
  const fetchAllGroups = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllPageGroups();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setGroupList(transformedData);
    } catch (error) {
      console.error("Error fetching groups:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch groups!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const groupFormik = useFormik({
    initialValues,

    enableReinitialize: true,

    validationSchema: Yup.object({
      group_name: Yup.string()
        .trim()
        .required("Group name is required")
        .min(2, "Group name must be at least 2 characters")
        .max(100, "Group name cannot exceed 100 characters"),

      group_icon: Yup.string()
        .trim()
        .required("Group icon is required")
        .max(100, "Group icon cannot exceed 100 characters"),

      group_display_name: Yup.string()
        .trim()
        .required("Group display name is required")
        .max(100, "Display name cannot exceed 100 characters"),

      group_display_index: Yup.number()
        .typeError("Display index must be a number")
        .integer("Display index must be a whole number")
        .min(0, "Display index cannot be negative")
        .required("Display index is required"),

      group_small_discription: Yup.string()
        .trim()
        .required("Group description is required")
        .max(250, "Description cannot exceed 250 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          group_name: values.group_name.trim(),
          group_icon: values.group_icon.trim(),
          group_display_name: values.group_display_name.trim(),
          group_display_index: Number(values.group_display_index),
          group_small_discription:
            values.group_small_discription.trim(),
          is_active: values.is_active,
          created_by: "USR0001"
        };

        const response = isEdit
          ? await UpdatePageGroup({
              group_id: editingGroupId,
              ...req,
            })
          : await CreatePageGroup(req);

        if (response?.status) {
          toast.success(
            response?.message ||
              (isEdit
                ? "Group updated successfully!"
                : "Group created successfully!")
          );

          closeModal();
          resetForm();

          await fetchAllGroups();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update group!"
                : "Unable to create group!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating group:"
            : "Error creating group:",
          error
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  // =========================================================
  // ADD GROUP
  // =========================================================
  const handleAddGroup = () => {
    setIsEdit(false);
    setEditingGroupId(null);

    groupFormik.resetForm({
      values: initialValues,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT GROUP
  // =========================================================
  const handleEditGroup = (row) => {
    setIsEdit(true);
    setEditingGroupId(row?.page_group_id);

    groupFormik.setValues({
      group_name: row?.group_name || "",
      group_icon: row?.group_icon || "",
      group_display_name: row?.group_display_name || "",
      group_display_index: row?.group_display_index ?? "",
      group_small_discription:
        row?.group_small_discription || "",
      is_active:
        typeof row?.is_active === "boolean"
          ? row.is_active
          : true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // TOGGLE STATUS
  // =========================================================
  const handleToggleStatus = async (row) => {
    const nextStatus = !row?.is_active;

    // Optimistic update
    setGroupList((prev) =>
      prev.map((item) =>
        item.page_group_id === row?.page_group_id
          ? {
              ...item,
              is_active: nextStatus,
            }
          : item
      )
    );

    try {
      const req = {
        group_id: row?.page_group_id,
        group_name: row?.group_name,
        group_icon: row?.group_icon,
        group_display_name: row?.group_display_name,
        group_display_index: row?.group_display_index,
        group_small_discription:
          row?.group_small_discription,
        is_active: nextStatus,
        created_by: "USR0001"
      };

      const response = await UpdatePageGroup(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Group status updated successfully!"
        );
      } else {
        // Revert status
        setGroupList((prev) =>
          prev.map((item) =>
            item.page_group_id === row?.page_group_id
              ? {
                  ...item,
                  is_active: row?.is_active,
                }
              : item
          )
        );

        toast.info(
          response?.message ||
            "Unable to update group status!"
        );
      }
    } catch (error) {
      // Revert status
      setGroupList((prev) =>
        prev.map((item) =>
          item.page_group_id === row?.page_group_id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item
        )
      );

      console.error("Error updating group status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!"
      );
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setEditingGroupId(null);

    groupFormik.resetForm({
      values: initialValues,
    });
  };

  // =========================================================
  // VALIDATION ERROR
  // =========================================================
  const ErrorText = ({ name }) =>
    groupFormik.touched[name] && groupFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">
        {groupFormik.errors[name]}
      </p>
    ) : null;

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
  const columns = [
    {
      name: "#",
      selector: (row) => row?.sn,
      sortable: true,
      width: "60px",
      center: true,
    },

    {
      name: "Group Name",
      selector: (row) => row?.group_name || "-",
      sortable: true,
      grow: 1,
      wrap: true,
    },

    {
      name: "Display Name",
      selector: (row) => row?.group_display_name || "-",
      sortable: true,
      grow: 1,
      wrap: true,
    },

    {
      name: "Icon",
      selector: (row) => row?.group_icon || "-",
      sortable: true,
      width: "120px",
      wrap: true,
    },

    {
      name: "Display Index",
      selector: (row) => row?.group_display_index ?? "-",
      sortable: true,
      width: "120px",
      center: true,
    },

    {
      name: "Description",
      selector: (row) => row?.group_small_discription || "-",
      sortable: true,
      grow: 2,
      wrap: true,
    },

    {
      name: "Action",
      width: "90px",
      center: true,
      cell: (row) => (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleEditGroup(row)}
            title="Edit Group"
            className="
              w-7 h-7
              flex items-center justify-center
              rounded-md
              hover:bg-primary/10
              transition
            "
          >
            <Icon
              name="FaEdit"
              size={16}
              color="5050b8"
            />
          </button>
        </div>
      ),
    },

    {
      name: "Status",
      width: "90px",
      center: true,
      cell: (row) => (
        <TogleInput
          checked={Boolean(row?.is_active)}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  // =========================================================
  // FETCH ON LOAD
  // =========================================================
  useEffect(() => {
    fetchAllGroups();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Group Management
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage page groups
            </p>
          </div>

          <div className="flex gap-2">
            <button
            type="button"
            onClick={()=> navgate(-1)}
            className="flex items-center
              gap-2 py-1.5 px-3 rounded-sm border border-primary cursor-pointer text-sm font-medium text-primary hover:bg-primary/20"
          >
            {/* <Icon name="RiAddLine" size={15} color="white" /> */}

            Go Back
          </button>
          <button
            type="button"
            onClick={handleAddGroup}
            className="flex items-center
              gap-2 py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 cursor-pointer text-sm font-medium text-white"
          >
            <Icon name="RiAddLine" size={15} color="white" />

            Add Group
          </button>
          </div>
        </div>

        {/* TABLE */}
        <Table
          data={groupList}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* ADD / UPDATE GROUP MODAL */}
      <Modal
        title={isEdit ? "Update Group" : "Add Group"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={groupFormik.handleSubmit}
          className="pt-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 px-4">
            <div>
              <TextInput
                label="Group Name"
                name="group_name"
                placeholder="Enter group name"
                value={groupFormik.values.group_name}
                onChange={groupFormik.handleChange}
                onBlur={groupFormik.handleBlur}
              />
              <ErrorText name="group_name" />
            </div>

            <div>
              <TextInput
                label="Group Icon"
                name="group_icon"
                placeholder="Enter icon name"
                value={groupFormik.values.group_icon}
                onChange={groupFormik.handleChange}
                onBlur={groupFormik.handleBlur}
              />
              <ErrorText name="group_icon" />
            </div>

            <div>
              <TextInput
                label="Group Display Name"
                name="group_display_name"
                placeholder="Enter display name"
                value={groupFormik.values.group_display_name}
                onChange={groupFormik.handleChange}
                onBlur={groupFormik.handleBlur}
              />
              <ErrorText name="group_display_name" />
            </div>

            <div>
              <TextInput
                label="Group Display Index"
                name="group_display_index"
                type="number"
                placeholder="Enter display index"
                value={groupFormik.values.group_display_index}
                onChange={groupFormik.handleChange}
                onBlur={groupFormik.handleBlur}
              />
              <ErrorText name="group_display_index" />
            </div>

            <div className="sm:col-span-2">
              <TextInput
                label="Group Description"
                name="group_small_discription"
                placeholder="Enter group description"
                value={groupFormik.values.group_small_discription}
                onChange={groupFormik.handleChange}
                onBlur={groupFormik.handleBlur}
              />
              <ErrorText name="group_small_discription" />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6 px-4 pb-4">
            <Button
              btnName="Cancel"
              type="button"
              onClick={closeModal}
              style="
                border
                border-gray-200
                hover:bg-gray-100
              "
            />

            <Button
              btnName={
                groupFormik.isSubmitting
                  ? "Please wait..."
                  : isEdit
                    ? "Update"
                    : "Submit"
              }
              type="submit"
              disabled={
                !groupFormik.isValid ||
                groupFormik.isSubmitting
              }
              style="
                bg-primary
                text-white
                hover:bg-primary/90
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GroupManagement;