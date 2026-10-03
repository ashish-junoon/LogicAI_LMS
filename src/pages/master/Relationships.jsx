import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";

import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

import {
  GetAllRelations,
  CreateRelation,
  UpdateRelation,
} from "../../api/mastersApi";

const Relationships = () => {
  const [relationships, setRelationships] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRelationshipId, setEditingRelationshipId] = useState(null);

  // =========================================================
  // Get All Relationships
  // =========================================================

  const fetchAllRelationships = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllRelations();

      if (response?.status) {
        setRelationships(response?.data || []);
      } else {
        toast.error(response?.message || "Failed to fetch relationships");
      }
    } catch (error) {
      console.error("Get Relationships Error:", error);
      toast.error("Something went wrong while fetching relationships");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // Formik
  // =========================================================

  const formik = useFormik({
    initialValues: {
      relation: "",
      is_active: true,
    },

    validationSchema: Yup.object({
      relation: Yup.string()
        .trim()
        .required("Relationship is required")
        .min(2, "Relationship must be at least 2 characters")
        .max(100, "Relationship cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          relation: values.relation.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateRelation({
            id: editingRelationshipId,
            ...req,
          });
        } else {
          response = await CreateRelation(req);
        }

        if (response?.status) {
          toast.success(
            response?.message ||
              (isEdit
                ? "Relationship updated successfully"
                : "Relationship created successfully"),
          );

          resetForm();
          closeModal();
          fetchAllRelationships();
        } else {
          toast.error(
            response?.message ||
              (isEdit
                ? "Failed to update relationship"
                : "Failed to create relationship"),
          );
        }
      } catch (error) {
        console.error("Relationship Submit Error:", error);
        toast.error("Something went wrong");
      }
    },
  });

  // =========================================================
  // Add Relationship
  // =========================================================

  const handleAddRelationship = () => {
    setIsEdit(false);
    setEditingRelationshipId(null);

    formik.resetForm({
      values: {
        relation: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // Edit Relationship
  // =========================================================

  const handleEditRelationship = (row) => {
    setIsEdit(true);
    setEditingRelationshipId(row?.id);

    formik.setValues({
      relation: row?.relation || "",
      is_active: row?.is_active ?? true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // Toggle Status
  // =========================================================

  const handleToggleStatus = async (row) => {
    const previousStatus = row?.is_active;
    const newStatus = !previousStatus;

    // Optimistic update
    setRelationships((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
              ...item,
              is_active: newStatus,
            }
          : item,
      ),
    );

    try {
      const response = await UpdateRelation({
        id: row.id,
        relation: row.relation,
        is_active: newStatus,
      });

      if (response?.status) {
        toast.success(
          response?.message || "Relationship status updated successfully",
        );
      } else {
        // Revert if API fails
        setRelationships((prev) =>
          prev.map((item) =>
            item.id === row.id
              ? {
                  ...item,
                  is_active: previousStatus,
                }
              : item,
          ),
        );

        toast.error(response?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Toggle Relationship Status Error:", error);

      // Revert if API fails
      setRelationships((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                is_active: previousStatus,
              }
            : item,
        ),
      );

      toast.error("Something went wrong while updating status");
    }
  };

  // =========================================================
  // Close Modal
  // =========================================================

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setEditingRelationshipId(null);

    formik.resetForm({
      values: {
        relation: "",
        is_active: true,
      },
    });
  };

  // =========================================================
  // Table Columns
  // =========================================================

  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "70px",
      center: true,
    },
    {
      name: "Relation",
      selector: (row) => row?.relation,
      sortable: true,
      width: "70%",
    },
    {
      name: "Edit",
      center: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleEditRelationship(row)}
          className="cursor-pointer"
        >
          <Icon name="FaEdit" size={18} color="black" />
        </button>
      ),
    },
    {
      name: "Status",
      center: true,
      cell: (row) => (
        <TogleInput
          checked={row?.is_active}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  // =========================================================
  // Initial API Call
  // =========================================================

  useEffect(() => {
    fetchAllRelationships();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between px-4">
          <div className="text-md font-medium self-center">Relation Master</div>

          <button
            onClick={handleAddRelationship}
            className="flex items-center gap-2 p-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 cursor-pointer text-sm font-medium text-white"
          >
            New Relation
            <IoPerson className="self-center" />
          </button>
        </div>

        {/* Table */}
        <Table data={relationships} columns={columns} loading={isLoading} />
      </div>

      {/* Modal */}
      <Modal
        title={isEdit ? "Edit Relationship" : "Add Relationship"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mt-6">
            <TextInput
              label="Relationship"
              placeholder="Enter relationship name"
              name="relation"
              value={formik.values.relation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.relation && formik.errors.relation && (
              <p className="text-xs text-red-500 -mt-2">
                {formik.errors.relation}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              btnName="Cancel"
              onClick={closeModal}
              style="border border-gray-200 hover:bg-gray-100"
            />

            <Button
              type="submit"
              btnName={isEdit ? "Update" : "Submit"}
              disabled={formik.isSubmitting}
              style="bg-primary text-white hover:bg-primary/90"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Relationships;
