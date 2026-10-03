import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllDepartments,
  CreateDepartment,
  UpdateDepartment,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const DepartmentMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  // =========================================================
  // FETCH ALL DEPARTMENTS
  // =========================================================
  const fetchAllDepartments = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllDepartments();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setDepartments(transformedData);
    } catch (error) {
      console.error("Error fetching departments:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch departments!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORM
  // =========================================================
  const departmentFormik = useFormik({
    initialValues: {
      department: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      department: Yup.string()
        .trim()
        .required("Department is required")
        .min(2, "Department must be at least 2 characters")
        .max(
          100,
          "Department cannot exceed 100 characters"
        ),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          department: values.department.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateDepartment({
            id: editingDepartmentId,
            ...req,
          });
        } else {
          response = await CreateDepartment(req);
        }

        if (response?.status) {
          await fetchAllDepartments();

          toast.success(
            response?.message ||
              (isEdit
                ? "Department updated successfully!"
                : "Department created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update department!"
                : "Unable to create department!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating department:"
            : "Error creating department:",
          error
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  // =========================================================
  // ADD DEPARTMENT
  // =========================================================
  const handleAddDepartment = () => {
    setIsEdit(false);
    setEditingDepartmentId(null);

    departmentFormik.resetForm({
      values: {
        department: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT DEPARTMENT
  // =========================================================
  const handleEditDepartment = (row) => {
    setIsEdit(true);
    setEditingDepartmentId(row?.id);

    departmentFormik.setValues({
      department: row?.department || "",
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
    setDepartments((prev) =>
      prev.map((item) =>
        item.id === row?.id
          ? {
              ...item,
              is_active: nextStatus,
            }
          : item
      )
    );

    try {
      const req = {
        id: row?.id,
        department: row?.department,
        is_active: nextStatus,
      };

      const response = await UpdateDepartment(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Department status updated successfully!"
        );
      } else {
        // Revert
        setDepartments((prev) =>
          prev.map((item) =>
            item.id === row?.id
              ? {
                  ...item,
                  is_active: row?.is_active,
                }
              : item
          )
        );

        toast.info(
          response?.message ||
            "Unable to update department status!"
        );
      }
    } catch (error) {
      // Revert
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item
        )
      );

      console.error(
        "Error updating department status:",
        error
      );

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
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
    setEditingDepartmentId(null);

    departmentFormik.resetForm({
      values: {
        department: "",
        is_active: true,
      },
    });
  };

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
      name: "Department",
      selector: (row) => row?.department || "-",
      sortable: true,
      grow: 1,
    },

    {
      name: "Action",
      width: "100px",
      center: true,
      selector: (row) => (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleEditDepartment(row)}
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
      width: "100px",
      center: true,
      selector: (row) => (
        <TogleInput
          checked={row?.is_active}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  // =========================================================
  // FETCH ON LOAD
  // =========================================================
  useEffect(() => {
    fetchAllDepartments();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Department Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage departments
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDepartment}
            className="
              flex items-center
              gap-2
              py-1.5
              px-3
              rounded-sm
              bg-primary
              hover:bg-primary/90
              cursor-pointer
              text-sm
              font-medium
              text-white
            "
          >
            <Icon
              name="RiAddLine"
              size={15}
              color="white"
            />

            Add Department
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={departments}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={
          isEdit
            ? "Update Department"
            : "Add Department"
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={departmentFormik.handleSubmit}
          className="pt-2"
        >
          <div>
            <TextInput
              label="Department"
              name="department"
              placeholder="Enter department"
              value={departmentFormik.values.department}
              onChange={departmentFormik.handleChange}
              onBlur={departmentFormik.handleBlur}
            />

            {departmentFormik.touched.department &&
              departmentFormik.errors.department && (
                <p className="mt-1 text-xs text-red-500">
                  {departmentFormik.errors.department}
                </p>
              )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-5">
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
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={
                !departmentFormik.isValid ||
                departmentFormik.isSubmitting
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

export default DepartmentMaster;d