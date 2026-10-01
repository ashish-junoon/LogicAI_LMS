import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
// import {
//   CreateDocument,
//   GetAllDocuments,
//   UpdateDocument,
// } from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const DocumentMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState(null);

  // =========================================================
  // FETCH ALL DOCUMENTS
  // =========================================================
  const fetchAllDocuments = async () => {
    try {
      const response = '';
    //   const response = await GetAllDocuments();

      const transformedData = response?.data?.map((d, i) => ({
        ...d,
        sn: i + 1,
      }));

      setDocumentList(transformedData || [{sn: "1", document_name: "Sanction Letter", document_type: "PDF", created_by: "Rohit koli", document_value: "sanction_letter"}]);
    } catch (error) {
      console.error("Error fetching documents:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Unable to fetch documents"
      );
    }
  };

  // =========================================================
  // ADD DOCUMENT
  // =========================================================
  const handleAddDocument = () => {
    setIsEdit(false);
    setEditingDocumentId(null);

    documentFormik.resetForm();

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT DOCUMENT
  // =========================================================
  const handleEditDocument = (document) => {
    setIsEdit(true);
    setEditingDocumentId(document?.id);

    documentFormik.setValues({
      document_name: document?.document_name || "",
      document_value: document?.document_value || "",
      document_type: document?.document_type || "",
      created_by: document?.created_by || "ADMIN",
      is_active:
        typeof document?.is_active === "boolean"
          ? document.is_active
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
    setDocumentList((prev) =>
      prev.map((document) =>
        document.id !== row?.id
          ? document
          : {
              ...document,
              is_active: nextStatus,
            }
      )
    );

    try {
      const req = {
        id: row?.id,
        document_name: row?.document_name,
        document_value: row?.document_value,
        document_type: row?.document_type,
        created_by: row?.created_by || "ADMIN",
        is_active: nextStatus,
      };

      const response = '';
    //   const response = await UpdateDocument(req);

      if (response?.status) {
        toast.success(
          response?.msg || "Document status updated successfully!"
        );
      } else {
        // Revert
        setDocumentList((prev) =>
          prev.map((document) =>
            document.id !== row?.id
              ? document
              : {
                  ...document,
                  is_active: row?.is_active,
                }
          )
        );

        toast.info(response?.msg || "Unable to update status!");
      }
    } catch (error) {
      // Revert
      setDocumentList((prev) =>
        prev.map((document) =>
          document.id !== row?.id
            ? document
            : {
                ...document,
                is_active: row?.is_active,
              }
        )
      );

      console.error("Error toggling document status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Something went wrong!"
      );
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const documentFormik = useFormik({
    initialValues: {
      document_name: "",
      document_value: "",
      document_type: "",
      created_by: "ADMIN",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      document_name: Yup.string()
        .trim()
        .required("Document name is required")
        .min(2, "Document name must be at least 2 characters")
        .max(
          150,
          "Document name cannot exceed 150 characters"
        ),

      document_value: Yup.string()
        .trim()
        .required("Document value is required")
        .max(
          500,
          "Document value cannot exceed 500 characters"
        ),

      document_type: Yup.string()
        .required("Document type is required")
        .oneOf(
          ["PDF", "Image", "Word", "Excel", "Other"],
          "Please select a valid document type"
        ),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          document_name: values.document_name.trim(),
          document_value: values.document_value.trim(),
          document_type: values.document_type,
          created_by: "ADMIN",
          is_active: false,
        };

        let response;

        if (isEdit) {
        //   response = await UpdateDocument({ id: editingDocumentId, ...req,});
          response = ""
        } else {
        //   response = await CreateDocument(req);
          response = "";
        }

        if (response?.status) {
          await fetchAllDocuments();

          toast.success(
            response?.msg ||
              (isEdit
                ? "Document updated successfully!"
                : "Document created successfully!")
          );

          setIsModalOpen(false);

          resetForm();

          setIsEdit(false);
          setEditingDocumentId(null);
        } else {
          toast.info(
            response?.msg ||
              (isEdit
                ? "Unable to update document!"
                : "Unable to add document!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error in updating document"
            : "Error in creating document",
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
  // ERROR TEXT
  // =========================================================
  const ErrorText = ({ name }) =>
    documentFormik.touched[name] &&
    documentFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">
        {documentFormik.errors[name]}
      </p>
    ) : null;

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
  const columns = [
    {
      name: "#",
      selector: (row) => row?.sn,
      sortable: true,
      width: "70px",
    },

    {
      name: "Document Name",
      selector: (row) => row?.document_name || "-",
      sortable: true,
      grow: 1.5,
    },

    {
      name: "Document Value",
      selector: (row) => row?.document_value || "-",
      sortable: true,
      grow: 2,
    },

    {
      name: "Document Type",
      selector: (row) => row?.document_type || "-",
      sortable: true,
      width: "140px",
    },

    {
      name: "Created By",
      selector: (row) => row?.created_by || "-",
      sortable: true,
      width: "130px",
    },

    {
      name: "Action",
      center: true,
      width: "100px",
      selector: (row) => (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleEditDocument(row)}
            className="
              w-7 h-7
              flex items-center justify-center
              rounded-md
              hover:bg-primary/10
              transition
            "
          >
            <Icon
              name="RiEditLine"
              size={16}
              color="5050b8"
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
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Document Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage document types and values
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDocument}
            className="
              text-sm
              py-1.5
              px-3
              rounded-sm
              bg-primary
              hover:bg-primary/90
              text-white
              flex items-center
              gap-2
              cursor-pointer
            "
          >
            <Icon name="RiAddLine" size={15} color="white" />

            New Document
          </button>
        </div>

        {/* =====================================================
            TABLE
        ====================================================== */}
        <Table
          data={documentList}
          columns={columns}
        />
      </div>

      {/* =======================================================
          ADD / EDIT DOCUMENT MODAL
      ======================================================== */}
      <Modal
        title={
          isEdit
            ? "Update Document"
            : "Add New Document"
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={documentFormik.handleSubmit}
          className="pt-2"
        >
          <div className="grid grid-cols-2 gap-3">
            {/* =================================================
                DOCUMENT NAME
            ================================================== */}
            <div>
              <TextInput
                label="Document Name"
                name="document_name"
                value={
                  documentFormik.values.document_name
                }
                onChange={documentFormik.handleChange}
                onBlur={documentFormik.handleBlur}
                placeholder="Enter document name"
              />

              <ErrorText name="document_name" />
            </div>

            {/* =================================================
                DOCUMENT TYPE
            ================================================== */}
            <div>
              <SelectInput
                label="Document Type"
                name="document_type"
                value={
                  documentFormik.values.document_type
                }
                onChange={documentFormik.handleChange}
                onBlur={documentFormik.handleBlur}
                placeholder="Select document type"
                options={[
                  {
                    label: "PDF",
                    value: "PDF",
                  },
                  {
                    label: "Image",
                    value: "Image",
                  },
                  {
                    label: "Word",
                    value: "Word",
                  },
                  {
                    label: "Excel",
                    value: "Excel",
                  },
                  {
                    label: "Other",
                    value: "Other",
                  },
                ]}
              />

              <ErrorText name="document_type" />
            </div>

            {/* =================================================
                DOCUMENT VALUE
            ================================================== */}
            <div className="col-span-2">
              <TextInput
                label="Document Value"
                name="document_value"
                value={
                  documentFormik.values.document_value
                }
                onChange={documentFormik.handleChange}
                onBlur={documentFormik.handleBlur}
                placeholder="Enter document value"
              />

              <ErrorText name="document_value" />
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================== */}
          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              type="button"
              onClick={closeModal}
              style="
                border
                text-sm
                border-gray-200
                hover:bg-gray-100
              "
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={
                !documentFormik.isValid ||
                documentFormik.isSubmitting
              }
              style="
                bg-primary
                text-sm
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

export default DocumentMaster;