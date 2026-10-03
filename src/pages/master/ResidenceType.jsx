import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllResidenceTypes,
  CreateResidenceType,
  UpdateResidenceType,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const ResidenceType = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residenceTypes, setResidenceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingResidenceTypeId, setEditingResidenceTypeId] =
    useState(null);

  // =========================================================
  // FETCH ALL RESIDENCE TYPES
  // =========================================================
  const fetchAllResidenceTypes = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllResidenceTypes();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setResidenceTypes(transformedData);
    } catch (error) {
      console.error("Error fetching residence types:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch residence types!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const residenceTypeFormik = useFormik({
    initialValues: {
      residence_type: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      residence_type: Yup.string()
        .trim()
        .required("Residence type is required")
        .min(2, "Residence type must be at least 2 characters")
        .max(100, "Residence type cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          residence_type: values.residence_type.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateResidenceType({
            id: editingResidenceTypeId,
            ...req,
          });
        } else {
          response = await CreateResidenceType(req);
        }

        if (response?.status) {
          await fetchAllResidenceTypes();

          toast.success(
            response?.message ||
              (isEdit
                ? "Residence type updated successfully!"
                : "Residence type created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update residence type!"
                : "Unable to create residence type!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating residence type:"
            : "Error creating residence type:",
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
  // ADD RESIDENCE TYPE
  // =========================================================
  const handleAddResidenceType = () => {
    setIsEdit(false);
    setEditingResidenceTypeId(null);

    residenceTypeFormik.resetForm({
      values: {
        residence_type: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT RESIDENCE TYPE
  // =========================================================
  const handleEditResidenceType = (row) => {
    setIsEdit(true);
    setEditingResidenceTypeId(row?.id);

    residenceTypeFormik.setValues({
      residence_type: row?.residence_type || "",
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
    setResidenceTypes((prev) =>
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
      const response = await UpdateResidenceType({
        id: row?.id,
        residence_type: row?.residence_type,
        is_active: nextStatus,
      });

      if (response?.status) {
        toast.success(
          response?.message ||
            "Residence type status updated successfully!"
        );
      } else {
        // Revert if API fails
        setResidenceTypes((prev) =>
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
            "Unable to update residence type status!"
        );
      }
    } catch (error) {
      // Revert if API throws an error
      setResidenceTypes((prev) =>
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
        "Error updating residence type status:",
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
    setEditingResidenceTypeId(null);

    residenceTypeFormik.resetForm({
      values: {
        residence_type: "",
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
      name: "Residence Type",
      selector: (row) => row?.residence_type || "-",
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
            onClick={() => handleEditResidenceType(row)}
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
    fetchAllResidenceTypes();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Residence Type Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage residence types
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddResidenceType}
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
            Add Residence Type
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={residenceTypes}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={
          isEdit
            ? "Update Residence Type"
            : "Add Residence Type"
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={residenceTypeFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Residence Type"
            name="residence_type"
            placeholder="Enter residence type"
            value={residenceTypeFormik.values.residence_type}
            onChange={residenceTypeFormik.handleChange}
            onBlur={residenceTypeFormik.handleBlur}
          />

          {residenceTypeFormik.touched.residence_type &&
            residenceTypeFormik.errors.residence_type && (
              <p className="mt-1 text-xs text-red-500">
                {residenceTypeFormik.errors.residence_type}
              </p>
            )}

          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              type="button"
              onClick={closeModal}
              style="border border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={
                !residenceTypeFormik.isValid ||
                residenceTypeFormik.isSubmitting
              }
              style="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ResidenceType;