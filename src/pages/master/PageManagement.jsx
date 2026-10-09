import React, { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { IoTrashBin } from "react-icons/io5";
import { Link } from "react-router-dom";

import Icon from "../../components/utils/Icon.jsx";
import Table from "../../components/Table.jsx";
import Modal from "../../components/utils/Modal.jsx";
import TextInput from "../../components/fields/TextInput.jsx";
import TogleInput from "../../components/fields/TogleInput.jsx";
import Button from "../../components/utils/Button.jsx";

import {
  GetAllPageNames,
  CreatePageName,
  UpdatePageName,
  GetAllPageGroups,
} from "../../api/userApi.js";
import SelectInput from "../../components/fields/SelectInput.jsx";

const initialValues = {
  group_id: "",
  page_name: "",
  page_icon: "",
  page_display_name: "",
  page_url: "",
  page_display_index: "",
  page_small_discription: "",
  is_active: true,
};

const PageManagement = () => {
  const [pageData, setPageData] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);

  // =========================================================
  // FETCH ALL GROUPS
  // =========================================================
  const fetchAllGroups = async () => {
    try {
      const response = await GetAllPageGroups();

      const transformedData =
        response?.data?.map((item) => ({
          value: String(item?.page_group_id),
          label: item?.group_display_name || item?.group_name,
          is_active: item?.is_active
        }))?.filter((gp)=> gp?.is_active) || [];

      setGroupOptions(transformedData);
    } catch (error) {
      console.error("Error fetching groups:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch groups!"
      );
    }
  };

  // =========================================================
  // FETCH ALL PAGES
  // =========================================================
  const fetchAllPages = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllPageNames();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setPageData(transformedData);
    } catch (error) {
      console.error("Error fetching pages:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch pages!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const pageFormik = useFormik({
    initialValues,
    enableReinitialize: true,

    validationSchema: Yup.object({
      group_id: Yup.string().required("Please select group"),

      page_name: Yup.string()
        .trim()
        .required("Page name is required")
        .min(2, "Page name must be at least 2 characters")
        .max(100, "Page name cannot exceed 100 characters"),

      page_icon: Yup.string()
        .trim()
        .required("Page icon is required")
        .max(100, "Page icon cannot exceed 100 characters"),

      page_display_name: Yup.string()
        .trim()
        .required("Page display name is required")
        .max(100, "Display name cannot exceed 100 characters"),

        page_url: Yup.string()
        .trim()
        .required("Page URL is required")
        .max(250, "Page URL cannot exceed 250 characters"),

      page_display_index: Yup.number()
        .typeError("Display index must be a number")
        .integer("Display index must be a whole number")
        .min(0, "Display index cannot be negative")
        .required("Display index is required"),

      page_small_discription: Yup.string()
        .trim()
        .required("Page description is required")
        .max(250, "Description cannot exceed 250 characters"),
    }),

    onSubmit: async (values) => {
      try {
        const req = {
          group_id: Number(values.group_id),
          page_name: values.page_name.trim(),
          page_icon: values.page_icon.trim(),
          page_display_name: values.page_display_name.trim(),
          page_url: values.page_url.trim(),
          page_display_index: Number(values.page_display_index),
          page_small_discription:
            values.page_small_discription.trim(),
          is_active: values.is_active,
          created_by: "USE0001"
        };

        const response = isEdit
          ? await UpdatePageName({
              page_id: editingPageId,
              ...req,
            })
          : await CreatePageName(req);

        if (response?.status) {
          toast.success(
            response?.message ||
              (isEdit
                ? "Page updated successfully!"
                : "Page created successfully!")
          );

          closeModal();
          await fetchAllPages();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update page!"
                : "Unable to create page!")
          );
        }
      } catch (error) {
        console.error(
          isEdit ? "Error updating page:" : "Error creating page:",
          error
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  console.log(groupOptions?.find(gp=> gp.page_group_id == pageFormik.values.group_id));
  

  // =========================================================
  // ADD PAGE
  // =========================================================
  const handleAddPage = () => {
    setIsEdit(false);
    setEditingPageId(null);

    pageFormik.resetForm({
      values: initialValues,
    });

    setIsPageModalOpen(true);
  };

  // =========================================================
  // EDIT PAGE
  // =========================================================
  const handleEditPage = (row) => {
    setIsEdit(true);
    setEditingPageId(row?.page_id);

    pageFormik.setValues({
      group_id: String(row?.group_id ?? ""),
      page_name: row?.page_name || "",
      page_icon: row?.page_icon || "",
      page_display_name: row?.page_display_name || "",
      page_url: row?.page_url || "",
      page_display_index: row?.page_display_index ?? "",
      page_small_discription:
        row?.page_small_discription || "",
      is_active:
        typeof row?.is_active === "boolean"
          ? row.is_active
          : true,
    });

    setIsPageModalOpen(true);
  };

  // =========================================================
  // TOGGLE PAGE STATUS
  // =========================================================
  const handlePageStatus = async (row) => {
    const nextStatus = !row?.is_active;

    setPageData((prev) =>
      prev.map((item) =>
        item.page_id === row?.page_id
          ? { ...item, is_active: nextStatus }
          : item
      )
    );

    try {
      const req = {
        page_id: row?.page_id,
        group_id: row?.group_id,
        page_name: row?.page_name,
        page_icon: row?.page_icon,
        page_display_name: row?.page_display_name,
        page_url: row?.page_url,
        page_display_index: row?.page_display_index,
        page_small_discription: row?.page_small_discription,
        is_active: nextStatus,
        created_by: "USR0001"
      };

      const response = await UpdatePageName(req);

      if (response?.status) {
        toast.success(
          response?.message || "Page status updated successfully!"
        );
      } else {
        setPageData((prev) =>
          prev.map((item) =>
            item.page_id === row?.page_id
              ? { ...item, is_active: row?.is_active }
              : item
          )
        );

        toast.info(
          response?.message || "Unable to update page status!"
        );
      }
    } catch (error) {
      setPageData((prev) =>
        prev.map((item) =>
          item.page_id === row?.page_id
            ? { ...item, is_active: row?.is_active }
            : item
        )
      );

      console.error("Error updating page status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!"
      );
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeModal = () => {
    setIsPageModalOpen(false);
    setIsEdit(false);
    setEditingPageId(null);

    pageFormik.resetForm({
      values: initialValues,
    });
  };

  // =========================================================
  // VALIDATION ERROR
  // =========================================================
  const ErrorText = ({ name }) =>
    pageFormik.touched[name] && pageFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">
        {pageFormik.errors[name]}
      </p>
    ) : null;

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
  const pageColumns = [
    {
      name: "#",
      selector: (row) => row?.sn,
      sortable: true,
      width: "60px",
      center: true,
    },
    {
      name: "Page Name",
      selector: (row) => row?.page_name || "-",
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Display Name",
      selector: (row) => row?.page_display_name || "-",
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Group",
      selector: (row) =>
        groupOptions.find(
          (group) => Number(group.value) === Number(row?.group_id)
        )?.label ||
        row?.group_name ||
        "-",
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "URL",
      selector: (row) => row?.page_url || "-",
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Display Index",
      selector: (row) => row?.page_display_index ?? "-",
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Status",
      center: true,
      width: "90px",
      cell: (row) => (
        <TogleInput
          checked={Boolean(row?.is_active)}
          onChange={() => handlePageStatus(row)}
        />
      ),
    },
    {
      name: "Action",
      center: true,
      width: "90px",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleEditPage(row)}
          title="Edit Page"
          className="
            w-7 h-7 flex items-center justify-center
            rounded-md hover:bg-primary/10 transition
          "
        >
          <Icon name="FaEdit" size={16} color="5050b8" />
        </button>
      ),
    },
  ];

  // =========================================================
  // FETCH ON LOAD
  // =========================================================
  useEffect(() => {
    fetchAllGroups();
    fetchAllPages();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Page Management
            </h2>
            <p className="text-[11px] text-slate-400">
              Manage application pages
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/manage-group"
              className="
                text-sm py-1.5 px-3 rounded-sm bg-primary
                hover:bg-primary/90 text-white flex items-center gap-2
              "
            >
              <Icon name="RiGroupLine" size={15} color="white" />
              Add Group
            </Link>

            <button
              type="button"
              onClick={handleAddPage}
              className="
                text-sm py-1.5 px-3 rounded-sm bg-primary
                hover:bg-primary/90 text-white flex items-center gap-2
              "
            >
              <Icon name="RiAddLine" size={15} color="white" />
              Add Page
            </button>
          </div>
        </div>

        {/* PAGE TABLE */}
        <Table
          data={pageData}
          columns={pageColumns}
          loading={isLoading}
        />
      </div>

      {/* ADD / EDIT PAGE MODAL */}
      <Modal
        title={isEdit ? "Update Page" : "Add Page"}
        isOpen={isPageModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={pageFormik.handleSubmit}
          className="pt-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 px-4">
            {/* GROUP */}
            <div>
              <SelectInput
                name="group_id"
                value={pageFormik.values.group_id}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
                label={"Select Group"}
                placeholder={"Select group name"}
                options={groupOptions}
                className={`
                  w-full mt-1 border rounded-md px-3 py-2 text-sm
                  bg-white outline-none focus:border-primary
                  ${
                    pageFormik.touched.group_id &&
                    pageFormik.errors.group_id
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                `}
              />

              <ErrorText name="group_id" />
            </div>

            {/* PAGE NAME */}
            <div>
              <TextInput
                label="Page Name"
                name="page_name"
                placeholder="Enter page name"
                value={pageFormik.values.page_name}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
              />
              <ErrorText name="page_name" />
            </div>

            {/* PAGE ICON */}
            <div>
              <TextInput
                label="Page Icon"
                name="page_icon"
                placeholder="Enter icon name"
                value={pageFormik.values.page_icon}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
              />
              <ErrorText name="page_icon" />
            </div>

            {/* DISPLAY NAME */}
            <div>
              <TextInput
                label="Page Display Name"
                name="page_display_name"
                placeholder="Enter display name"
                value={pageFormik.values.page_display_name}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
              />
              <ErrorText name="page_display_name" />
            </div>

            {/* PAGE URL */}
            <div>
              <TextInput
                label="Page URL"
                name="page_url"
                placeholder="Enter page URL"
                value={pageFormik.values.page_url}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
              />
              <ErrorText name="page_url" />
            </div>

            {/* DISPLAY INDEX */}
            <div>
              <TextInput
                label="Page Display Index"
                name="page_display_index"
                type="number"
                placeholder="Enter display index"
                value={pageFormik.values.page_display_index}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
              />
              <ErrorText name="page_display_index" />
            </div>

            {/* DESCRIPTION */}
            <div className="sm:col-span-2">
              <TextInput
                label="Page Description"
                name="page_small_discription"
                placeholder="Enter page description"
                value={pageFormik.values.page_small_discription}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
              />
              <ErrorText name="page_small_discription" />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6 px-4 pb-4">
            <Button
              btnName="Cancel"
              type="button"
              onClick={closeModal}
              style="border border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={
                pageFormik.isSubmitting
                  ? "Please wait..."
                  : isEdit
                    ? "Update"
                    : "Submit"
              }
              type="submit"
              disabled={
                !pageFormik.isValid ||
                pageFormik.isSubmitting
              }
              style="
                bg-primary text-white hover:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PageManagement;