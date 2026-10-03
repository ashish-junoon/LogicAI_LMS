import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  CreateDocumentType,
  GetAllDocumentTypes,
  UpdateDocumentType,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../../components/fields/TextInput";

const DocumentMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState(null);

  // =========================================================
  // FETCH ALL DOCUMENT TYPES
  // =========================================================
  const fetchAllDocuments = async () => {
    try {
      const response = await GetAllDocumentTypes();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setDocumentList(transformedData);
    } catch (error) {
      console.error("Error fetching document types:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Unable to fetch document types",
      );
    }
  };

  // =========================================================
  // ADD DOCUMENT TYPE
  // =========================================================
  const handleAddDocument = () => {
    setIsEdit(false);
    setEditingDocumentId(null);
    documentFormik.resetForm();
    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT DOCUMENT TYPE
  // =========================================================
  const handleEditDocument = (document) => {
    setIsEdit(true);
    setEditingDocumentId(document?.id);
    documentFormik.setValues({
      document_type: document?.document_type || "",
      is_active:
        typeof document?.is_active === "boolean" ? document.is_active : true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // TOGGLE STATUS
  // =========================================================
  const handleToggleStatus = async (row) => {
    const nextStatus = !row?.is_active;

    // Optimistic update
    setDocumentList((prev) =>
      prev.map((item) =>
        item.id === row?.id
          ? {
              ...item,
              is_active: nextStatus,
            }
          : item,
      ),
    );

    try {
      const req = {
        id: row?.id,
        document_type: row?.document_type,
        is_active: nextStatus,
      };

      const response = await UpdateDocumentType(req);

      if (response?.status) {
        toast.success(
          response?.message || "Document type status updated successfully!",
        );
      } else {
        // Revert
        setDocumentList((prev) =>
          prev.map((item) =>
            item.id === row?.id
              ? {
                  ...item,
                  is_active: row?.is_active,
                }
              : item,
          ),
        );

        toast.info(response?.message || "Unable to update status!");
      }
    } catch (error) {
      // Revert
      setDocumentList((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item,
        ),
      );

      console.error("Error updating document status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Something went wrong!",
      );
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const documentFormik = useFormik({
    initialValues: {
      document_type: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      document_type: Yup.string()
        .trim()
        .required("Document type is required")
        .max(100, "Document type cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          document_type: values.document_type.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateDocumentType({
            id: editingDocumentId,
            ...req,
          });
        } else {
          response = await CreateDocumentType(req);
        }

        if (response?.status) {
          await fetchAllDocuments();

          toast.success(
            response?.message ||
              (isEdit
                ? "Document type updated successfully!"
                : "Document type created successfully!"),
          );

          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingDocumentId(null);
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update document type!"
                : "Unable to add document type!"),
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating document type:"
            : "Error creating document type:",
          error,
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.message ||
            "Something went wrong!",
        );
      }
    },
  });

  // =========================================================
  // ERROR TEXT
  // =========================================================
  const ErrorText = ({ name }) =>
    documentFormik.touched[name] && documentFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">{documentFormik.errors[name]}</p>
    ) : null;

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
  const columns = [
    {
      name: "#",
      selector: (row) => row?.sn,
      sortable: true,
      // width: "70px",
    },

    {
      name: "Document Type",
      selector: (row) => row?.document_type || "-",
      sortable: true,
      grow: 1,
    },

    {
      name: "Action",
      center: true,
      // width: "100px",
      selector: (row) => (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleEditDocument(row)}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/10 transition"
          >
            <Icon name="RiEditLine" size={16} color="5050b8" />
          </button>
        </div>
      ),
    },

    {
      name: "Status",
      center: true,
      // width: "100px",
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
    fetchAllDocuments();
  }, []);

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeModal = () => {
    setIsModalOpen(false);
    documentFormik.resetForm();
    setIsEdit(false);
    setEditingDocumentId(null);
  };

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Document Master
            </h2>

            <p className="text-[11px] text-slate-400">Manage document types</p>
          </div>

          <button
            type="button"
            onClick={handleAddDocument}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex items-center gap-2 cursor-pointer"
          >
            <Icon name="RiAddLine" size={15} color="white" />
            Add Document
          </button>
        </div>

        {/* TABLE */}
        <Table data={documentList} columns={columns} />
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal
        title={isEdit ? "Update Document Type" : "Add Document Type"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form onSubmit={documentFormik.handleSubmit} className="pt-2">
          <div>
            <TextInput
              label="Document Type"
              name="document_type"
              value={documentFormik.values.document_type}
              onChange={documentFormik.handleChange}
              onBlur={documentFormik.handleBlur}
              placeholder="Select document type"
            />

            <ErrorText name="document_type" />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              type="button"
              onClick={closeModal}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={!documentFormik.isValid || documentFormik.isSubmitting}
              style="bg-primary text-sm text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DocumentMaster;
