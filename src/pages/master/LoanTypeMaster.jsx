import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateLoanType, GetAllLoanTypes, UpdateLoanType } from "../../api/mastersApi";

// =========================================================
// CURRENT USER (for created_by)
// =========================================================
const getCreatedBy = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
      user?.id ??
      user?.user_id ??
      user?.username ??
      user?.email ??
      "system"
    );
  } catch {
    return "system";
  }
};

const LoanTypeMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanTypes, setLoanTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingLoanTypeId, setEditingLoanTypeId] = useState(null);

  // =========================================================
  // FETCH ALL LOAN TYPES
  // =========================================================
  const fetchAllLoanTypes = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllLoanTypes();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setLoanTypes(transformedData);
    } catch (error) {
      console.error("Error fetching loan types:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch loan types!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const loanTypeFormik = useFormik({
    initialValues: {
      loan_type: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      loan_type: Yup.string()
        .trim()
        .required("Loan type is required")
        .min(2, "Loan type must be at least 2 characters")
        .max(100, "Loan type cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          id: isEdit ? editingLoanTypeId : 0,
          loan_type: values.loan_type.trim(),
          is_active: values.is_active,
          created_by: getCreatedBy(),
        };

        let response;

        if (isEdit) {
          response = await UpdateLoanType(req);
        } else {
          response = await CreateLoanType(req);
        }

        if (response?.status) {
          await fetchAllLoanTypes();

          toast.success(
            response?.message ||
              (isEdit
                ? "Loan type updated successfully!"
                : "Loan type created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update loan type!"
                : "Unable to create loan type!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating loan type:"
            : "Error creating loan type:",
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
  // ADD LOAN TYPE
  // =========================================================
  const handleAddLoanType = () => {
    setIsEdit(false);
    setEditingLoanTypeId(null);

    loanTypeFormik.resetForm({
      values: {
        loan_type: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT LOAN TYPE
  // =========================================================
  const handleEditLoanType = (row) => {
    setIsEdit(true);
    setEditingLoanTypeId(row?.id);

    loanTypeFormik.setValues({
      loan_type: row?.loan_type || "",
      is_active:
        typeof row?.is_active === "boolean" ? row.is_active : true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // TOGGLE STATUS
  // =========================================================
  const handleToggleStatus = async (row) => {
    const nextStatus = !row?.is_active;

    // Optimistic update
    setLoanTypes((prev) =>
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
        loan_type: row?.loan_type,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      };

      const response = await UpdateLoanType(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Loan type status updated successfully!"
        );
      } else {
        // Revert
        setLoanTypes((prev) =>
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
            "Unable to update loan type status!"
        );
      }
    } catch (error) {
      // Revert
      setLoanTypes((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item
        )
      );

      console.error("Error updating loan type status:", error);

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
    setEditingLoanTypeId(null);

    loanTypeFormik.resetForm({
      values: {
        loan_type: "",
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
      name: "Loan Type",
      selector: (row) => row?.loan_type || "-",
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
            onClick={() => handleEditLoanType(row)}
            className="
              w-7 h-7
              flex items-center justify-center
              rounded-md
              hover:bg-primary/10
              transition
            "
          >
            <Icon name="FaEdit" size={16} color="5050b8" />
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
    fetchAllLoanTypes();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Loan Type Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage loan types
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddLoanType}
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
            <Icon name="RiAddLine" size={15} color="white" />

            Add Loan Type
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={loanTypes}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Loan Type" : "Add Loan Type"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={loanTypeFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Loan Type"
            name="loan_type"
            placeholder="Enter loan type"
            value={loanTypeFormik.values.loan_type}
            onChange={loanTypeFormik.handleChange}
            onBlur={loanTypeFormik.handleBlur}
          />

          {loanTypeFormik.touched.loan_type &&
            loanTypeFormik.errors.loan_type && (
              <p className="mt-1 text-xs text-red-500">
                {loanTypeFormik.errors.loan_type}
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
                !loanTypeFormik.isValid ||
                loanTypeFormik.isSubmitting
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

export default LoanTypeMaster;