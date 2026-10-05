import React, { useCallback, useEffect, useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import SelectInput from "../../components/fields/SelectInput";
import Button from "../../components/utils/Button";
import Loader from "../../components/utils/Loader";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  GetAllPDQuestions,
  CreatePDQuestion,
  UpdatePDQuestion,
  // DeletePDQuestion,
} from "../../api/mastersApi";

// =========================================================
// LOGGED-IN USER (used for `created_by` field of the API)
// =========================================================

const getCreatedBy = () =>
  localStorage.getItem("username") ||
  localStorage.getItem("userName") ||
  localStorage.getItem("email") ||
  "admin";

// Static categories – replace with API call if needed
const categories = [
  { value: "Personal", label: "Personal" },
  { value: "Business", label: "Business" },
  { value: "Financial", label: "Financial" },
  { value: "Credit", label: "Credit" },
];

const PDQuestionsMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // =========================================================
  // FETCH ALL PD QUESTIONS
  // =========================================================

  const fetchAllQuestions = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await GetAllPDQuestions();

      if (response?.status) {
        const transformedData = (response?.data || []).map(
          (question, index) => ({
            ...question,
            sn: index + 1,
          })
        );

        setQuestions(transformedData);
      } else {
        setQuestions([]);

        toast.info(
          response?.msg || "Unable to fetch PD questions list!"
        );
      }
    } catch (error) {
      console.error("Error fetching PD questions:", error);

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

  const questionFormik = useFormik({
    initialValues: {
      category: "",
      question: "",
      is_active: true,
    },

    validationSchema: Yup.object({
      category: Yup.string()
        .trim()
        .required("Category is required"),
      question: Yup.string()
        .trim()
        .required("Question is required"),
    }),

    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        const createdBy = getCreatedBy();

        // UPDATE
        if (isEdit) {
          const req = {
            id: editingQuestionId,
            category: values.category.trim(),
            question: values.question.trim(),
            is_active: values.is_active,
            created_by: createdBy,
          };

          const response = await UpdatePDQuestion(req);

          if (response?.status) {
            await fetchAllQuestions();

            toast.success(
              response?.msg ||
                "PD Question updated successfully!"
            );

            handleCloseModal();
          } else {
            toast.info(
              response?.msg || "Unable to update PD question!"
            );
          }
        }
        // CREATE
        else {
          const req = {
            id: 0,
            category: values.category.trim(),
            question: values.question.trim(),
            is_active: values.is_active,
            created_by: createdBy,
          };

          const response = await CreatePDQuestion(req);

          if (response?.status) {
            await fetchAllQuestions();

            toast.success(
              response?.msg || "PD Question added successfully!"
            );

            handleCloseModal();
          } else {
            toast.info(
              response?.msg || "Unable to add PD question!"
            );
          }
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating PD question:"
            : "Error creating PD question:",
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
  // ADD PD QUESTION
  // =========================================================

  const handleAddQuestion = () => {
    setIsEdit(false);
    setEditingQuestionId(null);

    questionFormik.resetForm({
      values: {
        category: "",
        question: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT PD QUESTION
  // =========================================================

  const handleEditQuestion = (question) => {
    setIsEdit(true);
    setEditingQuestionId(question.id);

    questionFormik.setValues({
      category: question.category || "",
      question: question.question || "",
      is_active: question.is_active ?? true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // TOGGLE PD QUESTION STATUS
  // =========================================================

  const handleToggleStatus = async (row) => {
    const nextStatus = !row.is_active;

    // Optimistic update
    setQuestions((prev) =>
      prev.map((question) =>
        question.id !== row.id
          ? question
          : {
              ...question,
              is_active: nextStatus,
            }
      )
    );

    try {
      const response = await UpdatePDQuestion({
        id: row.id,
        category: row.category,
        question: row.question,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      });

      if (response?.status) {
        toast.success(
          response?.msg || "Status updated successfully!"
        );
      } else {
        // Revert on failure
        setQuestions((prev) =>
          prev.map((question) =>
            question.id !== row.id
              ? question
              : {
                  ...question,
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
      setQuestions((prev) =>
        prev.map((question) =>
          question.id !== row.id
            ? question
            : {
                ...question,
                is_active: row.is_active,
              }
        )
      );

      console.error(
        "Error toggling PD question status:",
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

  // // =========================================================
  // // DELETE PD QUESTION
  // // =========================================================

  // const handleDeleteQuestion = async (row) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this question?"
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     setIsLoading(true);
  //     const response = await DeletePDQuestion(row.id);

  //     if (response?.status) {
  //       await fetchAllQuestions();
  //       toast.success(
  //         response?.msg || "PD Question deleted successfully!"
  //       );
  //     } else {
  //       toast.info(
  //         response?.msg || "Unable to delete PD question!"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error deleting PD question:", error);
  //     toast.error(
  //       error?.response?.data?.title ||
  //         error?.response?.data?.errors?.request?.[0] ||
  //         error?.message ||
  //         "Something went wrong!"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchAllQuestions();
  }, [fetchAllQuestions]);

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "60px",
      center: true,
    },
    {
      name: "Category",
      selector: (row) => row.categorey,
      sortable: true,
      width: "220px",
    },
    {
      name: "Question",
      selector: (row) => row.question,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      width: "100px",
      center: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleEditQuestion(row)}
          className="cursor-pointer"
        >
          <Icon name="FaEdit" size={18} color="black" />
        </button>
      ),
    },
    {
      name: "Status",
      width: "100px",
      center: true,
      cell: (row) => (
        <TogleInput
          checked={row.is_active ?? true}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
    // {
    //   name: "Delete",
    //   width: "100px",
    //   center: true,
    //   cell: (row) => (
    //     <button
    //       type="button"
    //       onClick={() => handleDeleteQuestion(row)}
    //       className="cursor-pointer"
    //     >
    //       <IoTrashBin color="red" size={16} />
    //     </button>
    //   ),
    // },
  ];

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    questionFormik.resetForm();
    setIsEdit(false);
    setEditingQuestionId(null);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {isLoading && <Loader text="Loading PD questions..." />}

      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center p-0 px-4">
          <div className="text-md font-medium self-center">
            Questions Master
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddQuestion}
              className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Table */}
        <Table data={questions} columns={columns} />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        title={isEdit ? "Edit PD Question" : "Add PD Question"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={questionFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <SelectInput
                name="category"
                label="Category"
                placeholder="Select category"
                options={categories}
                value={questionFormik.values.category}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
              />
              {questionFormik.touched.category &&
                questionFormik.errors.category && (
                  <p className="mt-1 text-xs text-red-500">
                    {questionFormik.errors.category}
                  </p>
                )}
            </div>

            <div>
              <TextInput
                label="Question"
                name="question"
                placeholder="Enter question"
                value={questionFormik.values.question}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
              />
              {questionFormik.touched.question &&
                questionFormik.errors.question && (
                  <p className="mt-1 text-xs text-red-500">
                    {questionFormik.errors.question}
                  </p>
                )}
            </div>
          </div>

          {/* Status toggle inside the modal */}
          {/* <div className="mt-4 flex items-center gap-3">
            <span className="text-sm">Active</span>
            <TogleInput
              checked={questionFormik.values.is_active}
              onChange={() =>
                questionFormik.setFieldValue(
                  "is_active",
                  !questionFormik.values.is_active
                )
              }
            />
          </div> */}

          <div className="mt-5 flex justify-end gap-2">
            <Button
              btnName="Cancel"
              type="button"
              onClick={handleCloseModal}
              style="border border-gray-200 hover:bg-gray-100"
            />
            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              style="bg-primary text-white hover:bg-primary/90"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PDQuestionsMaster;