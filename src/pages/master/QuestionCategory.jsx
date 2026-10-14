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
import { CreateQuestionCategory, GetAllQuestionCategories, UpdateQuestionCategory } from "../../api/mastersApi";
import { useNavigate } from "react-router-dom";

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

const QuestionCategoryMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const navigate = useNavigate();

  // =========================================================
  // FETCH ALL QUESTION CATEGORIES
  // =========================================================
  const fetchAllCategories = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllQuestionCategories();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setCategories(transformedData);
    } catch (error) {
      console.error("Error fetching question categories:", error);

      toast.error(
        error?.response?.data?.title ||
        error?.response?.data?.errors?.request?.[0] ||
        error?.message ||
        "Failed to fetch question categories!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const categoryFormik = useFormik({
    initialValues: {
      category: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      category: Yup.string()
        .trim()
        .required("Category is required")
        .min(2, "Category must be at least 2 characters")
        .max(100, "Category cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          id: isEdit ? editingCategoryId : 0,
          category: values.category.trim(),
          is_active: values.is_active,
          created_by: getCreatedBy(),
        };

        let response;

        if (isEdit) {
          response = await UpdateQuestionCategory(req);
        } else {
          response = await CreateQuestionCategory(req);
        }

        if (response?.status) {
          await fetchAllCategories();

          toast.success(
            response?.message ||
            (isEdit
              ? "Question category updated successfully!"
              : "Question category created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
            (isEdit
              ? "Unable to update question category!"
              : "Unable to create question category!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating question category:"
            : "Error creating question category:",
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
  // ADD CATEGORY
  // =========================================================
  const handleAddCategory = () => {
    setIsEdit(false);
    setEditingCategoryId(null);

    categoryFormik.resetForm({
      values: {
        category: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT CATEGORY
  // =========================================================
  const handleEditCategory = (row) => {
    setIsEdit(true);
    setEditingCategoryId(row?.id);

    categoryFormik.setValues({
      category: row?.category || "",
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
    setCategories((prev) =>
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
        category: row?.category,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      };

      const response = await UpdateQuestionCategory(req);

      if (response?.status) {
        toast.success(
          response?.message ||
          "Question category status updated successfully!"
        );
      } else {
        // Revert
        setCategories((prev) =>
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
          "Unable to update question category status!"
        );
      }
    } catch (error) {
      // Revert
      setCategories((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
              ...item,
              is_active: row?.is_active,
            }
            : item
        )
      );

      console.error("Error updating question category status:", error);

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
    setEditingCategoryId(null);

    categoryFormik.resetForm({
      values: {
        category: "",
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
      name: "Category",
      selector: (row) => row?.category || "-",
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
            onClick={() => handleEditCategory(row)}
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
    fetchAllCategories();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-4 items-center">
            
            <div>
              <h2 className="text-md font-medium text-slate-800">
                Question Category Master
              </h2>

              <p className="text-[11px] text-slate-400">
                Manage question categories
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
            type="button"
            onClick={()=> navigate(-1)}
            className="flex items-center
              gap-2 py-1.5 px-3 rounded-sm border border-primary cursor-pointer text-sm font-medium text-primary hover:bg-primary/20"
          >
            {/* <Icon name="RiAddLine" size={15} color="white" /> */}

            Go Back
          </button>
          
          <button
            type="button"
            onClick={handleAddCategory}
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

            Add Category
          </button>
          </div>
        </div>

        {/* TABLE */}
        <Table
          data={categories}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={
          isEdit
            ? "Update Question Category"
            : "Add Question Category"
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={categoryFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Category"
            name="category"
            placeholder="Enter category"
            value={categoryFormik.values.category}
            onChange={categoryFormik.handleChange}
            onBlur={categoryFormik.handleBlur}
          />

          {categoryFormik.touched.category &&
            categoryFormik.errors.category && (
              <p className="mt-1 text-xs text-red-500">
                {categoryFormik.errors.category}
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
                !categoryFormik.isValid ||
                categoryFormik.isSubmitting
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

export default QuestionCategoryMaster;