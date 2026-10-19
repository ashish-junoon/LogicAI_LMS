import React, { useRef, useState } from "react";
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

// =========================================================
// DUMMY DATA — typical loan sub purposes sourced from
// a Loan Origination System (LOS) / Finacle / Baanknet
// =========================================================
const DUMMY_SUB_PURPOSES = [
  // Home Loan
  { id: 1,  loan_sub_purpose: "Home Loan - Purchase",              is_active: true  },
  { id: 2,  loan_sub_purpose: "Home Loan - Construction",          is_active: true  },
  { id: 3,  loan_sub_purpose: "Home Loan - Renovation",            is_active: true  },
  { id: 4,  loan_sub_purpose: "Home Loan - Plot Purchase",         is_active: false },

  // Personal Loan
  { id: 5,  loan_sub_purpose: "Personal Loan - Medical",           is_active: true  },
  { id: 6,  loan_sub_purpose: "Personal Loan - Travel",            is_active: true  },
  { id: 7,  loan_sub_purpose: "Personal Loan - Wedding",           is_active: true  },
  { id: 8,  loan_sub_purpose: "Personal Loan - Consumer Durable",  is_active: false },

  // Vehicle Loan
  { id: 9,  loan_sub_purpose: "Vehicle Loan - New Car",            is_active: true  },
  { id: 10, loan_sub_purpose: "Vehicle Loan - Used Car",           is_active: true  },
  { id: 11, loan_sub_purpose: "Vehicle Loan - Two Wheeler",        is_active: true  },
  { id: 12, loan_sub_purpose: "Vehicle Loan - Commercial Vehicle", is_active: true  },

  // Education Loan
  { id: 13, loan_sub_purpose: "Education Loan - Domestic",         is_active: true  },
  { id: 14, loan_sub_purpose: "Education Loan - Overseas",         is_active: false },

  // Gold Loan
  { id: 15, loan_sub_purpose: "Gold Loan - Agriculture",           is_active: true  },
  { id: 16, loan_sub_purpose: "Gold Loan - Personal",              is_active: true  },

  // Business Loan
  { id: 17, loan_sub_purpose: "Business Loan - Working Capital",   is_active: true  },
  { id: 18, loan_sub_purpose: "Business Loan - Term Loan",         is_active: false },
];

// Helper to keep the serial number column in sync
const withSn = (list) =>
  list.map((item, index) => ({ ...item, sn: index + 1 }));

const LoanSubPurposeMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subPurposeList, setSubPurposeList] = useState(
    withSn(DUMMY_SUB_PURPOSES)
  );
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingSubPurposeId, setEditingSubPurposeId] = useState(null);

  // Tracks the next id for newly added entries
  const nextIdRef = useRef(
    Math.max(...DUMMY_SUB_PURPOSES.map((p) => p.id), 0) + 1
  );

  // =========================================================
  // FORMIK
  // =========================================================

  const subPurposeFormik = useFormik({
    initialValues: {
      loan_sub_purpose: "",
      is_active: true,
    },

    validationSchema: Yup.object({
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

        // Simulate a short delay like an API call would
        await new Promise((r) => setTimeout(r, 300));

        // UPDATE
        if (isEdit) {
          setSubPurposeList((prev) =>
            withSn(
              prev.map((item) =>
                item.id === editingSubPurposeId
                  ? {
                      ...item,
                      loan_sub_purpose: values.loan_sub_purpose.trim(),
                      is_active: values.is_active,
                    }
                  : item
              )
            )
          );

          toast.success("Loan Sub Purpose updated successfully!");
          handleCloseModal();
        }
        // CREATE
        else {
          const newEntry = {
            id: nextIdRef.current++,
            loan_sub_purpose: values.loan_sub_purpose.trim(),
            is_active: values.is_active,
          };

          setSubPurposeList((prev) => withSn([...prev, newEntry]));

          toast.success("Loan Sub Purpose added successfully!");
          handleCloseModal();
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating loan sub purpose:"
            : "Error creating loan sub purpose:",
          error
        );

        toast.error("Something went wrong!");
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
          : {
              ...item,
              is_active: nextStatus,
            }
      )
    );

    try {
      // Simulate a short delay like an API call would
      await new Promise((r) => setTimeout(r, 200));

      toast.success("Status updated successfully!");
    } catch (error) {
      // Revert on error
      setSubPurposeList((prev) =>
        prev.map((item) =>
          item.id !== row.id
            ? item
            : {
                ...item,
                is_active: row.is_active,
              }
        )
      );

      console.error(
        "Error toggling loan sub purpose status:",
        error
      );

      toast.error("Something went wrong!");
    }
  };

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

          <button
            type="button"
            onClick={handleAddSubPurpose}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-sm bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
          >
            New Sub Purpose
          </button>
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
          <div className="mt-6">
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

          {/* Status toggle inside the modal */}
          {/* <div className="mt-4 flex items-center gap-3">
            <span className="text-sm">Active</span>

            <TogleInput
              checked={subPurposeFormik.values.is_active}
              onChange={() =>
                subPurposeFormik.setFieldValue(
                  "is_active",
                  !subPurposeFormik.values.is_active
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

export default LoanSubPurposeMaster;