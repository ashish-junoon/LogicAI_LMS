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
import { CreateLoanSubPurpose, GetAllLoanPurposes, GetAllLoanSubPurposes, UpdateLoanSubPurpose } from "../../api/mastersApi";
import { useNavigate } from "react-router-dom";

// =========================================================
// LOGGED-IN USER (used for `created_by` field of the API)
// =========================================================

const getCreatedBy = () =>
  localStorage.getItem("username") ||
  localStorage.getItem("userName") ||
  localStorage.getItem("email") ||
  "admin";

// =========================================================
// FALLBACK PARENT LOAN PURPOSES
// Only used if /Master/GetAllLoanPurpose fails — keeps
// the modal's dropdown usable in that edge case.
// =========================================================
const FALLBACK_LOAN_PURPOSES = [
  { id: 1, loan_purpose: "Home Loan" },
  { id: 2, loan_purpose: "Personal Loan" },
  { id: 3, loan_purpose: "Vehicle Loan" },
  { id: 4, loan_purpose: "Education Loan" },
  { id: 5, loan_purpose: "Gold Loan" },
  { id: 6, loan_purpose: "Business Loan" },
];

// Helper to keep the serial number column in sync
const withSn = (list) =>
  list.map((item, index) => ({ ...item, sn: index + 1 }));

const LoanSubPurposeMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subPurposeList, setSubPurposeList] = useState([]);
  const [loanPurposeList, setLoanPurposeList] = useState(
    FALLBACK_LOAN_PURPOSES
  );
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingSubPurposeId, setEditingSubPurposeId] = useState(null);

  const navigate = useNavigate();

  // =========================================================
  // FETCH PARENT LOAN PURPOSES (for the dropdown)
  // =========================================================

  const fetchAllLoanPurposes = useCallback(async () => {
    try {
      const response = await GetAllLoanPurposes();

      if (response?.status && Array.isArray(response?.data)) {
        setLoanPurposeList(response.data);
      }
      // Silently fall back to FALLBACK_LOAN_PURPOSES on failure
    } catch (error) {
      console.error("Error fetching loan purposes:", error);
    }
  }, []);

  // =========================================================
  // FETCH ALL LOAN SUB PURPOSES
  // =========================================================

  const fetchAllSubPurposes = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await GetAllLoanSubPurposes();

      if (response?.status) {
        setSubPurposeList(withSn(response?.data || []));
      } else {
        setSubPurposeList([]);

        toast.info(
          response?.msg ||
            response?.message ||
            "Unable to fetch loan sub purpose list!"
        );
      }
    } catch (error) {
      console.error("Error fetching loan sub purposes:", error);

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
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchAllLoanPurposes();
    fetchAllSubPurposes();
  }, [fetchAllLoanPurposes, fetchAllSubPurposes]);

  // =========================================================
  // FORMIK
  // =========================================================

  const subPurposeFormik = useFormik({
    initialValues: {
      loan_purpose_id: "",
      loan_sub_purpose: "",
      is_active: true,
    },

    validationSchema: Yup.object({
      loan_purpose_id: Yup.mixed().required("Loan Purpose is required"),

      loan_sub_purpose: Yup.string()
        .trim()
        .required("Loan Sub Purpose is required")
        .min(2, "Loan Sub Purpose must be at least 2 characters")
        .max(100, "Loan Sub Purpose cannot exceed 100 characters"),
    }),

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // ---- Exact API payload ----
        const req = {
          id: isEdit ? editingSubPurposeId : 0,
          loan_purpose_id: Number(values.loan_purpose_id),
          loan_sub_purpose: values.loan_sub_purpose.trim(),
          is_active: values.is_active,
          created_by: getCreatedBy(),
        };

        const response = isEdit
          ? await UpdateLoanSubPurpose(req)
          : await CreateLoanSubPurpose(req);

        if (response?.status) {
          await fetchAllSubPurposes();

          toast.success(
            response?.msg ||
              response?.message ||
              (isEdit
                ? "Loan Sub Purpose updated successfully!"
                : "Loan Sub Purpose added successfully!")
          );

          handleCloseModal();
        } else {
          toast.info(
            response?.msg ||
              response?.message ||
              (isEdit
                ? "Unable to update loan sub purpose!"
                : "Unable to add loan sub purpose!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating loan sub purpose:"
            : "Error creating loan sub purpose:",
          error
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.message ||
            "Something went wrong!"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // =========================================================
  // ADD LOAN SUB PURPOSE
  // =========================================================

  const handleAddSubPurpose = () => {
    setIsEdit(false);
    setEditingSubPurposeId(null);

    subPurposeFormik.resetForm({
      values: {
        loan_purpose_id: "",
        loan_sub_purpose: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT LOAN SUB PURPOSE
  // =========================================================

  const handleEditSubPurpose = (row) => {
    setIsEdit(true);
    setEditingSubPurposeId(row.id);

    subPurposeFormik.setValues({
      loan_purpose_id: row.loan_purpose_id ?? "",
      loan_sub_purpose: row.loan_sub_purpose || "",
      is_active: row.is_active ?? true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // TOGGLE LOAN SUB PURPOSE STATUS
  // =========================================================

  const handleToggleStatus = async (row) => {
    const nextStatus = !row.is_active;

    // Optimistic update
    setSubPurposeList((prev) =>
      prev.map((item) =>
        item.id !== row.id
          ? item
          : { ...item, is_active: nextStatus }
      )
    );

    try {
      const req = {
        id: row.id,
        loan_purpose_id: row.loan_purpose_id,
        loan_sub_purpose: row.loan_sub_purpose,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      };

      const response = await UpdateLoanSubPurpose(req);

      if (response?.status) {
        toast.success(
          response?.msg ||
            response?.message ||
            "Status updated successfully!"
        );
      } else {
        // Revert on failure
        setSubPurposeList((prev) =>
          prev.map((item) =>
            item.id !== row.id
              ? item
              : { ...item, is_active: row.is_active }
          )
        );

        toast.info(
          response?.msg ||
            response?.message ||
            "Unable to update status!"
        );
      }
    } catch (error) {
      // Revert on error
      setSubPurposeList((prev) =>
        prev.map((item) =>
          item.id !== row.id
            ? item
            : { ...item, is_active: row.is_active }
        )
      );

      console.error(
        "Error toggling loan sub purpose status:",
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
  // RESOLVE PARENT PURPOSE NAME
  // =========================================================

  const getPurposeName = (id) =>
    loanPurposeList.find((p) => p.id === Number(id))
      ?.loan_purpose || "-";

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
      selector: (row) => getPurposeName(row.loan_purpose_id),
      sortable: true,
      width: "180px",
    },

    {
      name: "Loan Sub Purpose",
      selector: (row) => row.loan_sub_purpose,
      sortable: true,
      grow: 1,
    },

    {
      name: "Action",
      center: true,
      width: "100px",
      selector: (row) => (
        <div className="flex justify-center gap-5">
          <button
            type="button"
            onClick={() => handleEditSubPurpose(row)}
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
    subPurposeFormik.resetForm();
    setIsEdit(false);
    setEditingSubPurposeId(null);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {isLoading && <Loader text="Loading loan sub purposes..." />}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <div>
            <div className="text-md font-medium">
              All Loan Sub Purposes
            </div>

            <p className="text-[11px] text-slate-400">
              Manage loan sub purposes
            </p>
          </div>

           <div className="flex gap-3">
            <button
              type="button"
              onClick={()=> navigate(-1)}
              className="flex items-center
              gap-2 py-1.5 px-3 rounded-sm border border-primary cursor-pointer text-sm font-medium text-primary hover:bg-primary/20"
          >
              Go Back
            </button>

          <button
            type="button"
            onClick={handleAddSubPurpose}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-sm bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
          >
            New Sub Purpose
          </button>
           </div>
        </div>

        {/* Table */}
        <Table
          data={subPurposeList}
          columns={columns}
        />
      </div>

      {/* Add / Update Modal */}
      <Modal
        title={
          isEdit
            ? "Update Loan Sub Purpose"
            : "Add New Loan Sub Purpose"
        }
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={subPurposeFormik.handleSubmit}>
          {/* Parent Loan Purpose dropdown */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Loan Purpose
            </label>

            <select
              name="loan_purpose_id"
              value={subPurposeFormik.values.loan_purpose_id}
              onChange={subPurposeFormik.handleChange}
              onBlur={subPurposeFormik.handleBlur}
              className="mt-1 w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select Loan Purpose</option>

              {loanPurposeList.map((purpose) => (
                <option key={purpose.id} value={purpose.id}>
                  {purpose.loan_purpose}
                </option>
              ))}
            </select>

            {subPurposeFormik.touched.loan_purpose_id &&
              subPurposeFormik.errors.loan_purpose_id && (
                <p className="mt-1 text-xs text-red-500">
                  {subPurposeFormik.errors.loan_purpose_id}
                </p>
              )}
          </div>

          {/* Sub purpose text input */}
          <div className="mt-4">
            <TextInput
              label="Loan Sub Purpose"
              name="loan_sub_purpose"
              placeholder="Enter Loan Sub Purpose"
              value={subPurposeFormik.values.loan_sub_purpose}
              onChange={subPurposeFormik.handleChange}
              onBlur={subPurposeFormik.handleBlur}
            />

            {subPurposeFormik.touched.loan_sub_purpose &&
              subPurposeFormik.errors.loan_sub_purpose && (
                <p className="mt-1 text-xs text-red-500">
                  {subPurposeFormik.errors.loan_sub_purpose}
                </p>
              )}
          </div>

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
              disabled={!subPurposeFormik.isValid}
              style="bg-primary text-sm text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default LoanSubPurposeMaster;