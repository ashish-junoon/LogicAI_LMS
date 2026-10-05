import React, { useCallback, useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import Loader from "../../components/utils/Loader";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  CreateLoanPurpose,
  GetAllLoanPurposes,
  UpdateLoanPurpose,
} from "../../api/mastersApi";

// =========================================================
// LOGGED-IN USER (used for `created_by` field of the API)
// =========================================================

const getCreatedBy = () =>
  localStorage.getItem("username") ||
  localStorage.getItem("userName") ||
  localStorage.getItem("email") ||
  "admin";

const LoanPurposeMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purposeList, setPurposeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingPurposeId, setEditingPurposeId] = useState(null);

  // =========================================================
  // FETCH ALL LOAN PURPOSES
  // =========================================================

  const fetchAllPurposes = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await GetAllLoanPurposes();

      if (response?.status) {
        const transformedData = (response?.data || []).map(
          (purpose, index) => ({
            ...purpose,
            sn: index + 1,
          })
        );

        setPurposeList(transformedData);
      } else {
        setPurposeList([]);

        toast.info(
          response?.msg || "Unable to fetch loan purpose list!"
        );
      }
    } catch (error) {
      console.error("Error fetching loan purposes:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Something went wrong!"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // FORMIK
  // =========================================================

  const purposeFormik = useFormik({
    initialValues: {
      loan_purpose: "",
      is_active: true,
    },

    validationSchema: Yup.object({
      loan_purpose: Yup.string()
        .trim()
        .required("Loan Purpose is required"),
    }),

    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        const createdBy = getCreatedBy();

        // UPDATE
        if (isEdit) {
          const req = {
            id: editingPurposeId,
            loan_purpose: values.loan_purpose.trim(),
            is_active: values.is_active,
            created_by: createdBy,
          };

          const response = await UpdateLoanPurpose(req);

          if (response?.status) {
            await fetchAllPurposes();

            toast.success(
              response?.msg ||
                "Loan Purpose updated successfully!"
            );

            handleCloseModal();
          } else {
            toast.info(
              response?.msg || "Unable to update loan purpose!"
            );
          }
        }
        // CREATE
        else {
          const req = {
            id: 0,
            loan_purpose: values.loan_purpose.trim(),
            is_active: values.is_active,
            created_by: createdBy,
          };

          const response = await CreateLoanPurpose(req);

          if (response?.status) {
            await fetchAllPurposes();

            toast.success(
              response?.msg || "Loan Purpose added successfully!"
            );

            handleCloseModal();
          } else {
            toast.info(
              response?.msg || "Unable to add loan purpose!"
            );
          }
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating loan purpose:"
            : "Error creating loan purpose:",
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
  // ADD LOAN PURPOSE
  // =========================================================

  const handleAddPurpose = () => {
    setIsEdit(false);
    setEditingPurposeId(null);

    purposeFormik.resetForm({
      values: {
        loan_purpose: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT LOAN PURPOSE
  // =========================================================

  const handleEditPurpose = (purpose) => {
    setIsEdit(true);
    setEditingPurposeId(purpose.id);

    purposeFormik.setValues({
      loan_purpose: purpose.loan_purpose || "",
      is_active: purpose.is_active ?? true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // TOGGLE LOAN PURPOSE STATUS
  // =========================================================

  const handleToggleStatus = async (row) => {
    const nextStatus = !row.is_active;

    // Optimistic update
    setPurposeList((prev) =>
      prev.map((purpose) =>
        purpose.id !== row.id
          ? purpose
          : {
              ...purpose,
              is_active: nextStatus,
            }
      )
    );

    try {
      const response = await UpdateLoanPurpose({
        id: row.id,
        loan_purpose: row.loan_purpose,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      });

      if (response?.status) {
        toast.success(
          response?.msg || "Status updated successfully!"
        );
      } else {
        // Revert on failure
        setPurposeList((prev) =>
          prev.map((purpose) =>
            purpose.id !== row.id
              ? purpose
              : {
                  ...purpose,
                  is_active: row.is_active,
                }
          )
        );

        toast.info(
          response?.msg || "Unable to update status!"
        );
      }
    } catch (error) {
      // Revert on error
      setPurposeList((prev) =>
        prev.map((purpose) =>
          purpose.id !== row.id
            ? purpose
            : {
                ...purpose,
                is_active: row.is_active,
              }
        )
      );

      console.error(
        "Error toggling loan purpose status:",
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
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchAllPurposes();
  }, [fetchAllPurposes]);

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns = [
    {
      name: "#",
      selector: (row) => row.sn,
      sortable: true,
      width: "80px",
    },

    {
      name: "Loan Purpose",
      selector: (row) => row.loan_purpose,
      sortable: true,
    },

    {
      name: "Action",
      center: true,
      width: "100px",
      selector: (row) => (
        <div className="flex justify-center gap-5">
          <button
            type="button"
            onClick={() => handleEditPurpose(row)}
            className="cursor-pointer"
          >
            <Icon
              name="FaEdit"
              size={18}
              color="black"
            />
          </button>
        </div>
      ),
    },

    {
      name: "Status",
      center: true,
      width: "100px",
      selector: (row) => (
        <TogleInput
          checked={row.is_active}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    purposeFormik.resetForm();
    setIsEdit(false);
    setEditingPurposeId(null);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {isLoading && <Loader text="Loading loan purposes..." />}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <div className="text-md font-medium">
            All Loan Purposes
          </div>

          <button
            type="button"
            onClick={handleAddPurpose}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-sm bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
          >
            New Purpose
          </button>
        </div>

        {/* Table */}
        <Table
          data={purposeList}
          columns={columns}
        />
      </div>

      {/* Add / Update Modal */}
      <Modal
        title={
          isEdit
            ? "Update Loan Purpose"
            : "Add New Loan Purpose"
        }
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={purposeFormik.handleSubmit}>
          <div className="mt-6">
            <TextInput
              label="Loan Purpose"
              name="loan_purpose"
              placeholder="Enter Loan Purpose"
              value={purposeFormik.values.loan_purpose}
              onChange={purposeFormik.handleChange}
              onBlur={purposeFormik.handleBlur}
            />

            {purposeFormik.touched.loan_purpose &&
              purposeFormik.errors.loan_purpose && (
                <p className="mt-1 text-xs text-red-500">
                  {purposeFormik.errors.loan_purpose}
                </p>
              )}
          </div>

          {/* Status toggle inside the modal */}
          {/* <div className="mt-4 flex items-center gap-3">
            <span className="text-sm">Active</span>

            <TogleInput
              checked={purposeFormik.values.is_active}
              onChange={() =>
                purposeFormik.setFieldValue(
                  "is_active",
                  !purposeFormik.values.is_active
                )
              }
            />
          </div> */}

          {/* Buttons */}
          <div className="mt-5 flex justify-end gap-2">
            <Button
              btnName="Cancel"
              type="button"
              onClick={handleCloseModal}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              style="bg-primary text-sm text-white hover:bg-primary/90"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default LoanPurposeMaster;