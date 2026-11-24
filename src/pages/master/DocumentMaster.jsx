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

  const customStyles = {
    rows: {
      style: {
        minHeight: "75px",
      },
    },
    cells: {
      style: {
        paddingTop: "10px",
        paddingBottom: "10px",
      },
    },
  };

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
        thumbnail_image: null
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
      thumbnail_image: null,
    },

    enableReinitialize: true,

    // validationSchema: Yup.object({
    //   document_type: Yup.string()
    //     .trim()
    //     .required("Document type is required")
    //     .max(100, "Document type cannot exceed 100 characters"),
    // }),

    validationSchema: Yup.object({
      document_type: Yup.string()
        .trim()
        .required("Document type is required")
        .max(100, "Document type cannot exceed 100 characters"),

      thumbnail_image: Yup.mixed().when("$isEdit", {
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required("Thumbnail image is required"),
      }),
    }),

    // onSubmit: async (values, { resetForm }) => {
    //   try {
    //     const req = {
    //       document_type: values.document_type.trim(),
    //       is_active: values.is_active,
    //     };

    //     let response;

    //     if (isEdit) {
    //       response = await UpdateDocumentType({
    //         id: editingDocumentId,
    //         ...req,
    //       });
    //     } else {
    //       response = await CreateDocumentType(req);
    //     }

    //     if (response?.status) {
    //       await fetchAllDocuments();

    //       toast.success(
    //         response?.message ||
    //           (isEdit
    //             ? "Document type updated successfully!"
    //             : "Document type created successfully!"),
    //       );

    //       setIsModalOpen(false);
    //       resetForm();
    //       setIsEdit(false);
    //       setEditingDocumentId(null);
    //     } else {
    //       toast.info(
    //         response?.message ||
    //           (isEdit
    //             ? "Unable to update document type!"
    //             : "Unable to add document type!"),
    //       );
    //     }
    //   } catch (error) {
    //     console.error(
    //       isEdit
    //         ? "Error updating document type:"
    //         : "Error creating document type:",
    //       error,
    //     );

    //     toast.error(
    //       error?.response?.data?.title ||
    //         error?.response?.data?.errors?.request?.[0] ||
    //         error?.message ||
    //         "Something went wrong!",
    //     );
    //   }
    // },

    onSubmit: async (values, { resetForm }) => {
      try {
        let response;

        if (isEdit) {
          // UPDATE API
          // const req = {
          //   id: editingDocumentId,
          //   document_type: values.document_type.trim(),
          //   is_active: values.is_active,
          // };
          
          const formData = new FormData();
          formData.append("id", editingDocumentId);
          formData.append("document_type", values.document_type.trim());
          formData.append("is_active", values.is_active);
          formData.append("thumbnail_image", values.thumbnail_image);

          response = await UpdateDocumentType(formData);
        } else {
          // CREATE API - MULTIPART
          const formData = new FormData();

          formData.append("document_type", values.document_type.trim());
          formData.append("is_active", values.is_active);
          formData.append("thumbnail_image", values.thumbnail_image);

          response = await CreateDocumentType(formData);
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
        console.error("Document type error:", error);

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
      name: "Thumbnail",
      selector: (row) => row?.thumbnail_image || "-",
      sortable: true,
      grow: 1,
      cell: (row) =>
        row?.thumbnail_image ? (
          <img
            src={row.thumbnail_image}
            alt="Document Thumbnail"
            className="w-12 h-12 object-cover rounded-md border border-gray-200 cursor-pointer"
            onClick={() => window.open(row.thumbnail_image, "_blank")}
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        ),
    },

    // {
    //   name: "Thumbnail",
    //   cell: (row) =>
    //     row?.thumbnail_image ? (
    //       <img
    //         src={row.thumbnail_image}
    //         alt="Thumbnail"
    //         className="w-14 h-14 object-cover rounded-md"
    //       />
    //     ) : (
    //       "-"
    //     ),
    //   minWidth: "120px",
    // },

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
        <Table
          data={documentList}
          columns={columns}
          customStyles={customStyles}
        />
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

          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Thumbnail Image
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                documentFormik.setFieldValue(
                  "thumbnail_image",
                  e.currentTarget.files?.[0] || null,
                );
              }}
              onBlur={() =>
                documentFormik.setFieldTouched("thumbnail_image", true)
              }
              className="w-full text-xs border border-gray-200 rounded-md p-2"
            />

            <ErrorText name="thumbnail_image" />

            {documentFormik.values.thumbnail_image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(
                    documentFormik.values.thumbnail_image,
                  )}
                  alt="Thumbnail Preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              </div>
            )}
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
