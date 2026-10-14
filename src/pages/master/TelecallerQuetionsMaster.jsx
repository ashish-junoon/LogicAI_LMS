import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

import {
  CreateTelecallerQuestion,
  GetAllTelecallerQuestions,
  UpdateTelecallerQuestion,
} from "../../api/mastersApi";

const TelecallerQuetionsMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all telecaller questions
  const fetchAllQuestions = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllTelecallerQuestions();

      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setQuestionList(
        data.map((item, index) => ({
          ...item,
          sn: index + 1,
        }))
      );
    } catch (error) {
      console.error("Error fetching telecaller questions:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch questions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add question
  const handleAddQuestion = () => {
    setIsEdit(false);
    setEditingQuestionId(null);
    questionFormik.resetForm();
    setIsModalOpen(true);
  };

  // Edit question
  const handleEditQuestion = (row) => {
    setIsEdit(true);
    setEditingQuestionId(row.id);

    questionFormik.setValues({
      telecaller_question: row.telecaller_question || "",
      is_active: row.is_active ?? false,
    });

    setIsModalOpen(true);
  };

  // Toggle active status
  const handleToggleStatus = async (row) => {
    const previousStatus = row.is_active;
    const nextStatus = !previousStatus;

    setQuestionList((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? { ...item, is_active: nextStatus }
          : item
      )
    );

    try {
      const response = await UpdateTelecallerQuestion({
        id: row.id,
        telecaller_question: row.telecaller_question,
        is_active: nextStatus,
      });

      if (response?.status) {
        toast.success(
          response?.message || "Status updated successfully!"
        );
      } else {
        setQuestionList((prev) =>
          prev.map((item) =>
            item.id === row.id
              ? { ...item, is_active: previousStatus }
              : item
          )
        );

        toast.error(
          response?.message || "Unable to update status!"
        );
      }
    } catch (error) {
      setQuestionList((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? { ...item, is_active: previousStatus }
            : item
        )
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!"
      );
    }
  };

  // Formik: Add / Update
  const questionFormik = useFormik({
    initialValues: {
      telecaller_question: "",
      is_active: false,
    },

    enableReinitialize: false,

    validationSchema: Yup.object({
      telecaller_question: Yup.string()
        .trim()
        .required("Question is required")
        .min(3, "Question must be at least 3 characters")
        .max(500, "Question cannot exceed 500 characters"),

      is_active: Yup.boolean().required("Status is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          telecaller_question: values.telecaller_question.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateTelecallerQuestion({
            id: editingQuestionId,
            ...payload,
          });
        } else {
          response = await CreateTelecallerQuestion(payload);
        }

        if (response?.status) {
          toast.success(
            response?.message ||
              (isEdit
                ? "Question updated successfully!"
                : "Question added successfully!")
          );

          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingQuestionId(null);

          await fetchAllQuestions();
        } else {
          toast.error(
            response?.message ||
              (isEdit
                ? "Unable to update question!"
                : "Unable to add question!")
          );
        }
      } catch (error) {
        console.error("Error saving telecaller question:", error);

        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  const ErrorText = ({ name }) =>
    questionFormik.touched[name] && questionFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">
        {questionFormik.errors[name]}
      </p>
    ) : null;

  const columns = [
    {
      name: "#",
      selector: (row) => row.sn,
      sortable: true,
      width: "80px",
    },
    {
      name: "Telecaller Question",
      selector: (row) => row.telecaller_question || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      center: true,
      width: "100px",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleEditQuestion(row)}
          className="cursor-pointer"
          title="Edit question"
        >
          <Icon name="FaEdit" size={18} color="black" />
        </button>
      ),
    },
    {
      name: "Status",
      center: true,
      width: "110px",
      cell: (row) => (
        <TogleInput
          checked={!!row.is_active}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  return (
    <>
      <div className="flex-1">
        <div className="flex justify-between items-center px-4">
          <div className="text-md font-medium self-center">
            All Telecaller Questions
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex items-center gap-3 cursor-pointer"
          >
            New Question
          </button>
        </div>

        <div className="mt-4">
          {isLoading && questionList.length === 0 ? (
            <p className="text-sm text-gray-500 p-4">
              Loading questions...
            </p>
          ) : (
            <Table data={questionList} columns={columns} />
          )}
        </div>
      </div>

      <Modal
        title={isEdit ? "Update Telecaller Question" : "Add Telecaller Question"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          questionFormik.resetForm();
          setIsEdit(false);
          setEditingQuestionId(null);
        }}
      >
        <form onSubmit={questionFormik.handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div>
              <TextInput
                label="Telecaller Question"
                name="telecaller_question"
                value={questionFormik.values.telecaller_question}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
                placeholder="Enter telecaller question"
              />

              <ErrorText name="telecaller_question" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>

              <select
                name="is_active"
                value={String(questionFormik.values.is_active)}
                onChange={(e) =>
                  questionFormik.setFieldValue(
                    "is_active",
                    e.target.value === "true"
                  )
                }
                onBlur={questionFormik.handleBlur}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <ErrorText name="is_active" />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                questionFormik.resetForm();
                setIsEdit(false);
                setEditingQuestionId(null);
              }}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={
                questionFormik.isSubmitting ||
                !questionFormik.isValid
              }
              style="bg-primary text-sm text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TelecallerQuetionsMaster;