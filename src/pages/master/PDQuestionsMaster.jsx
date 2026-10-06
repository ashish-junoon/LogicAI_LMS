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
  GetAllPDQuestions,
  CreatePDQuestion,
  UpdatePDQuestion,
} from "../../api/mastersApi";
import SelectInput from "../../components/fields/SelectInput";

// =========================================================
// LOGGED-IN USER
// =========================================================

const getCreatedBy = () =>
  localStorage.getItem("username") ||
  localStorage.getItem("userName") ||
  localStorage.getItem("email") ||
  "admin";

// =========================================================
// PD QUESTIONS MASTER
// =========================================================

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
          response?.message ||
            "Unable to fetch PD questions list!"
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
      categorey: "",
      type: "",
      question: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      categorey: Yup.string()
        .trim()
        .required("Category is required")
        .max(100, "Category cannot exceed 100 characters"),

      type: Yup.string()
        .trim()
        .required("Type is required")
        .max(100, "Type cannot exceed 100 characters"),

      question: Yup.string()
        .trim()
        .required("Question is required")
        .max(500, "Question cannot exceed 500 characters"),
    }),

    onSubmit: async (values) => {
      try {
        const createdBy = getCreatedBy();

        // =====================================================
        // UPDATE
        // =====================================================

        if (isEdit) {
          const req = {
            id: editingQuestionId,
            categorey: values.categorey.trim(),
            type: values.type.trim(),
            question: values.question.trim(),
            is_active: values.is_active,
            created_by: createdBy,
          };

          const response = await UpdatePDQuestion(req);

          if (response?.status) {
            await fetchAllQuestions();

            toast.success(
              response?.message ||
                "PD Question updated successfully!"
            );

            handleCloseModal();
          } else {
            toast.info(
              response?.message ||
                "Unable to update PD question!"
            );
          }
        }

        // =====================================================
        // CREATE
        // =====================================================

        else {
          const req = {
            id: 0,
            categorey: values.categorey.trim(),
            type: values.type.trim(),
            question: values.question.trim(),
            is_active: values.is_active,
            created_by: createdBy,
          };

          const response = await CreatePDQuestion(req);

          if (response?.status) {
            await fetchAllQuestions();

            toast.success(
              response?.message ||
                "PD Question added successfully!"
            );

            handleCloseModal();
          } else {
            toast.info(
              response?.message ||
                "Unable to add PD question!"
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
        categorey: "",
        type: "",
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
    setEditingQuestionId(question?.id);

    questionFormik.setValues({
      categorey: question?.categorey || "",
      type: question?.type || "",
      question: question?.question || "",
      is_active:
        typeof question?.is_active === "boolean"
          ? question.is_active
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
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === row?.id
          ? {
              ...question,
              is_active: nextStatus,
            }
          : question
      )
    );

    try {
      const response = await UpdatePDQuestion({
        id: row?.id,
        categorey: row?.categorey,
        type: row?.type,
        question: row?.question,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      });

      if (response?.status) {
        toast.success(
          response?.message ||
            "Status updated successfully!"
        );
      } else {
        // Revert
        setQuestions((prev) =>
          prev.map((question) =>
            question.id === row?.id
              ? {
                  ...question,
                  is_active: row?.is_active,
                }
              : question
          )
        );

        toast.info(
          response?.message ||
            "Unable to update status!"
        );
      }
    } catch (error) {
      // Revert
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === row?.id
            ? {
                ...question,
                is_active: row?.is_active,
              }
            : question
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

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    questionFormik.resetForm({
      values: {
        categorey: "",
        type: "",
        question: "",
        is_active: true,
      },
    });

    setIsEdit(false);
    setEditingQuestionId(null);
  };

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
      selector: (row) => row?.sn,
      sortable: true,
      width: "60px",
      center: true,
    },

    {
      name: "Category",
      selector: (row) => row?.categorey || "-",
      sortable: true,
      width: "180px",
    },

    {
      name: "Type",
      selector: (row) => row?.type || "-",
      sortable: true,
      width: "160px",
    },

    {
      name: "Question",
      selector: (row) => row?.question || "-",
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
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/10 transition"
        >
          <Icon
            name="FaEdit"
            size={16}
            color="5050b8"
          />
        </button>
      ),
    },

    {
      name: "Status",
      width: "100px",
      center: true,
      cell: (row) => (
        <TogleInput
          checked={row?.is_active ?? true}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {isLoading && (
        <Loader text="Loading PD questions..." />
      )}

      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Questions Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage PD questions
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
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

            Add Question
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={questions}
          columns={columns}
        />
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
          ===================================================== */}

      <Modal
        title={
          isEdit
            ? "Edit PD Question"
            : "Add PD Question"
        }
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <form
          onSubmit={questionFormik.handleSubmit}
          className="pt-2"
        >
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* CATEGORY */}
            <div>
              <SelectInput
                label="Category"
                name="categorey"
                placeholder="Enter category"
                options={[
                  {label: "Borrower & Business Details", value: "Borrower & Business Details"},
                  {label: "Purpose of Loan", value: "Purpose of Loan"},
                  {label: "Business Operations", value: "Business Operations"},
                  {label: "Financial Understanding", value: "Financial Understanding"},
                  {label: "Banking & Cashflow", value: "Banking & Cashflow"},
                ]}
                value={questionFormik.values.categorey}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
              />

              {questionFormik.touched.categorey &&
                questionFormik.errors.categorey && (
                  <p className="mt-1 text-xs text-red-500">
                    {questionFormik.errors.categorey}
                  </p>
                )}
            </div>

            {/* TYPE */}
            <div>
              <SelectInput
                label="Type"
                name="type"
                options={[
                  {label: "Pre PD", value: "pre-pd"},
                  {label: "Post PD", value: "post-pd"}
                ]}
                placeholder="Enter question type"
                value={questionFormik.values.type}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
              />

              {questionFormik.touched.type &&
                questionFormik.errors.type && (
                  <p className="mt-1 text-xs text-red-500">
                    {questionFormik.errors.type}
                  </p>
                )}
            </div>

            {/* QUESTION */}
            <div className="col-span-2">
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

          {/* BUTTONS */}
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
              disabled={
                !questionFormik.isValid ||
                questionFormik.isSubmitting
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

export default PDQuestionsMaster;