import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllEmploymentTypes,
  CreateEmploymentType,
  UpdateEmploymentType,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const EmployementTypeMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingEmploymentTypeId, setEditingEmploymentTypeId] =
    useState(null);

  // =========================================================
  // FETCH ALL EMPLOYMENT TYPES
  // =========================================================
  const fetchAllEmploymentTypes = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllEmploymentTypes();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setEmploymentTypes(transformedData);
    } catch (error) {
      console.error(
        "Error fetching employment types:",
        error
      );

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch employment types!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const employmentTypeFormik = useFormik({
    initialValues: {
      employment_type: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      employment_type: Yup.string()
        .trim()
        .required("Employment type is required")
        .min(
          2,
          "Employment type must be at least 2 characters"
        )
        .max(
          100,
          "Employment type cannot exceed 100 characters"
        ),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          employment_type: values.employment_type.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateEmploymentType({
            id: editingEmploymentTypeId,
            ...req,
          });
        } else {
          response = await CreateEmploymentType(req);
        }

        if (response?.status) {
          await fetchAllEmploymentTypes();

          toast.success(
            response?.message ||
              (isEdit
                ? "Employment type updated successfully!"
                : "Employment type created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update employment type!"
                : "Unable to create employment type!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating employment type:"
            : "Error creating employment type:",
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
  // ADD EMPLOYMENT TYPE
  // =========================================================
  const handleAddEmploymentType = () => {
    setIsEdit(false);
    setEditingEmploymentTypeId(null);

    employmentTypeFormik.resetForm({
      values: {
        employment_type: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT EMPLOYMENT TYPE
  // =========================================================
  const handleEditEmploymentType = (row) => {
    setIsEdit(true);
    setEditingEmploymentTypeId(row?.id);

    employmentTypeFormik.setValues({
      employment_type: row?.employment_type || "",
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
    setEmploymentTypes((prev) =>
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
        employment_type: row?.employment_type,
        is_active: nextStatus,
      };

      const response = await UpdateEmploymentType(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Employment type status updated successfully!"
        );
      } else {
        // Revert
        setEmploymentTypes((prev) =>
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
            "Unable to update employment type status!"
        );
      }
    } catch (error) {
      // Revert
      setEmploymentTypes((prev) =>
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
        "Error updating employment type status:",
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
    setEditingEmploymentTypeId(null);

    employmentTypeFormik.resetForm({
      values: {
        employment_type: "",
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
      name: "Employment Type",
      selector: (row) => row?.employment_type || "-",
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
            onClick={() => handleEditEmploymentType(row)}
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
    fetchAllEmploymentTypes();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Employment Type Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage employment types
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddEmploymentType}
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

            Add Employment Type
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={employmentTypes}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={
          isEdit
            ? "Update Employment Type"
            : "Add Employment Type"
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={employmentTypeFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Employment Type"
            name="employment_type"
            placeholder="Enter employment type"
            value={
              employmentTypeFormik.values.employment_type
            }
            onChange={employmentTypeFormik.handleChange}
            onBlur={employmentTypeFormik.handleBlur}
          />

          {employmentTypeFormik.touched.employment_type &&
            employmentTypeFormik.errors.employment_type && (
              <p className="mt-1 text-xs text-red-500">
                {
                  employmentTypeFormik.errors
                    .employment_type
                }
              </p>
            )}

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
                !employmentTypeFormik.isValid ||
                employmentTypeFormik.isSubmitting
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

export default EmployementTypeMaster;