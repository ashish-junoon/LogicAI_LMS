import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllCastes,
  CreateCaste,
  UpdateCaste,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

// =========================================================
// LOGGED-IN USER (used for `created_by` field of the API)
// =========================================================
const getCreatedBy = () =>
  localStorage.getItem("username") ||
  localStorage.getItem("userName") ||
  localStorage.getItem("email") ||
  "admin";

const CasteMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [castes, setCastes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingCasteId, setEditingCasteId] = useState(null);

  // =========================================================
  // FETCH ALL CASTES
  // =========================================================
  const fetchAllCastes = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllCastes();

      if (response?.status) {
        const transformedData =
          response?.data?.map((item, index) => ({
            ...item,
            sn: index + 1,
          })) || [];

        setCastes(transformedData);
      } else {
        setCastes([]);

        toast.info(
          response?.msg ||
            response?.message ||
            "Unable to fetch caste list!"
        );
      }
    } catch (error) {
      console.error("Error fetching castes:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch castes!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const casteFormik = useFormik({
    initialValues: {
      caste_name: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      caste_name: Yup.string()
        .trim()
        .required("Caste is required")
        .min(2, "Caste must be at least 2 characters")
        .max(100, "Caste cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);

        // ---- Exact API payload ----
        const req = {
          id: isEdit ? editingCasteId : 0,
          caste_name: values.caste_name.trim(),
          is_active: values.is_active,
          created_by: getCreatedBy(),
        };

        const response = isEdit
          ? await UpdateCaste(req)
          : await CreateCaste(req);

        if (response?.status) {
          await fetchAllCastes();

          toast.success(
            response?.msg ||
              response?.message ||
              (isEdit
                ? "Caste updated successfully!"
                : "Caste created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.msg ||
              response?.message ||
              (isEdit
                ? "Unable to update caste!"
                : "Unable to create caste!")
          );
        }
      } catch (error) {
        console.error(
          isEdit ? "Error updating caste:" : "Error creating caste:",
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
  // ADD CASTE
  // =========================================================
  const handleAddCaste = () => {
    setIsEdit(false);
    setEditingCasteId(null);

    casteFormik.resetForm({
      values: {
        caste_name: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT CASTE
  // =========================================================
  const handleEditCaste = (row) => {
    setIsEdit(true);
    setEditingCasteId(row?.id);

    casteFormik.setValues({
      caste_name: row?.caste_name || "",
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
    setCastes((prev) =>
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
        caste_name: row?.caste_name,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      };

      const response = await UpdateCaste(req);

      if (response?.status) {
        toast.success(
          response?.msg ||
            response?.message ||
            "Caste status updated successfully!"
        );
      } else {
        // Revert
        setCastes((prev) =>
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
          response?.msg ||
            response?.message ||
            "Unable to update caste status!"
        );
      }
    } catch (error) {
      // Revert
      setCastes((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item
        )
      );

      console.error("Error updating caste status:", error);

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
    setEditingCasteId(null);

    casteFormik.resetForm({
      values: {
        caste_name: "",
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
      name: "Caste",
      selector: (row) => row?.caste_name || "-",
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
            onClick={() => handleEditCaste(row)}
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
    fetchAllCastes();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Caste Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage castes
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCaste}
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

            Add Caste
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={castes}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Caste" : "Add Caste"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form onSubmit={casteFormik.handleSubmit} className="pt-2">
          <TextInput
            label="Caste"
            name="caste_name"
            placeholder="Enter caste"
            value={casteFormik.values.caste_name}
            onChange={casteFormik.handleChange}
            onBlur={casteFormik.handleBlur}
          />

          {casteFormik.touched.caste_name &&
            casteFormik.errors.caste_name && (
              <p className="mt-1 text-xs text-red-500">
                {casteFormik.errors.caste_name}
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
                !casteFormik.isValid || casteFormik.isSubmitting
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

export default CasteMaster;