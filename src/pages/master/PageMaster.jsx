import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoTrashBin } from "react-icons/io5";

import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";

const PageMaster = () => {
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [modalType, setModalType] = useState("add");

  const [pageData, setPageData] = useState([
    {
      id: 1,
      pageName: "Dashboard",
      pageDescription: "Dashboard page",
      groupName: "Dashboard",
      isActive: true,
    },
    {
      id: 2,
      pageName: "Customer List",
      pageDescription: "Customer listing page",
      groupName: "Customer Management",
      isActive: true,
    },
    {
      id: 3,
      pageName: "Add Customer",
      pageDescription: "Add new customer page",
      groupName: "Customer Management",
      isActive: true,
    },
    {
      id: 4,
      pageName: "Loan List",
      pageDescription: "Loan listing page",
      groupName: "Loan Management",
      isActive: false,
    },
  ]);

  const [groupData, setGroupData] = useState([
    {
      id: 1,
      groupName: "Dashboard",
      groupIcon: "RiDashboardLine",
      isActive: true,
    },
    {
      id: 2,
      groupName: "Customer Management",
      groupIcon: "IoPerson",
      isActive: true,
    },
    {
      id: 3,
      groupName: "Loan Management",
      groupIcon: "FaMoneyBillTransfer",
      isActive: true,
    },
  ]);

  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // =========================================================
  // PAGE VALIDATION
  // =========================================================

  const pageValidationSchema = Yup.object({
    groupName: Yup.string().required("Please select group"),

    pageName: Yup.string()
      .trim()
      .required("Page name is required")
      .min(2, "Page name must be at least 2 characters"),

    pageDescription: Yup.string()
      .trim()
      .required("Page description is required")
      .min(3, "Description must be at least 3 characters"),
  });

  // =========================================================
  // GROUP VALIDATION
  // =========================================================

  const groupValidationSchema = Yup.object({
    groupName: Yup.string()
      .trim()
      .required("Group name is required")
      .min(2, "Group name must be at least 2 characters"),

    groupIcon: Yup.string()
      .trim()
      .required("Group icon is required"),
  });

  // =========================================================
  // PAGE FORMIK
  // =========================================================

  const pageFormik = useFormik({
    initialValues: {
      groupName: "",
      pageName: "",
      pageDescription: "",
    },

    validationSchema: pageValidationSchema,

    enableReinitialize: true,

    onSubmit: (values, { resetForm }) => {
      if (modalType === "edit") {
        setPageData((prev) =>
          prev.map((item) =>
            item.id === selectedPage.id
              ? {
                  ...item,
                  groupName: values.groupName,
                  pageName: values.pageName,
                  pageDescription: values.pageDescription,
                }
              : item
          )
        );
      } else {
        const newPage = {
          id: Date.now(),
          groupName: values.groupName,
          pageName: values.pageName,
          pageDescription: values.pageDescription,
          isActive: true,
        };

        setPageData((prev) => [...prev, newPage]);
      }

      resetForm();
      setSelectedPage(null);
      setIsPageModalOpen(false);
    },
  });

  // =========================================================
  // GROUP FORMIK
  // =========================================================

  const groupFormik = useFormik({
    initialValues: {
      groupName: "",
      groupIcon: "",
    },

    validationSchema: groupValidationSchema,

    enableReinitialize: true,

    onSubmit: (values, { resetForm }) => {
      if (modalType === "edit") {
        setGroupData((prev) =>
          prev.map((item) =>
            item.id === selectedGroup.id
              ? {
                  ...item,
                  groupName: values.groupName,
                  groupIcon: values.groupIcon,
                }
              : item
          )
        );
      } else {
        const newGroup = {
          id: Date.now(),
          groupName: values.groupName,
          groupIcon: values.groupIcon,
          isActive: true,
        };

        setGroupData((prev) => [...prev, newGroup]);
      }

      resetForm();
      setSelectedGroup(null);
      setIsGroupModalOpen(false);
    },
  });

  // =========================================================
  // PAGE HANDLERS
  // =========================================================

  const handleAddPage = () => {
    setModalType("add");
    setSelectedPage(null);

    pageFormik.resetForm();

    setIsPageModalOpen(true);
  };

  const handleEditPage = (row) => {
    setModalType("edit");
    setSelectedPage(row);

    pageFormik.setValues({
      groupName: row.groupName || "",
      pageName: row.pageName || "",
      pageDescription: row.pageDescription || "",
    });

    setIsPageModalOpen(true);
  };

  // =========================================================
  // GROUP HANDLERS
  // =========================================================

  const handleAddGroup = () => {
    setModalType("add");
    setSelectedGroup(null);

    groupFormik.resetForm();

    setIsGroupModalOpen(true);
  };

  const handleEditGroup = (row) => {
    setModalType("edit");
    setSelectedGroup(row);

    groupFormik.setValues({
      groupName: row.groupName || "",
      groupIcon: row.groupIcon || "",
    });

    setIsGroupModalOpen(true);
  };

  // =========================================================
  // STATUS
  // =========================================================

  const handlePageStatus = (id) => {
    setPageData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isActive: !item.isActive,
            }
          : item
      )
    );
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDeletePage = (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) {
      return;
    }

    setPageData((prev) => prev.filter((item) => item.id !== id));
  };

  // =========================================================
  // PAGE COLUMNS
  // =========================================================

  const pageColumns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
      center: true,
    },

    {
      name: "Page Name",
      selector: (row) => row.pageName,
      sortable: true,
      grow: 1,
    },

    {
      name: "Description",
      selector: (row) => row.pageDescription,
      sortable: true,
      grow: 1.5,
    },

    {
      name: "Group",
      selector: (row) => row.groupName,
      sortable: true,
      grow: 1,
    },

    {
      name: "Status",
      center: true,
      width: "100px",
      selector: (row) => (
        <TogleInput
          checked={row.isActive}
          onChange={() => handlePageStatus(row.id)}
        />
      ),
    },

    {
      name: "Action",
      center: true,
      width: "90px",
      selector: (row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleEditPage(row)}
            className="hover:scale-110 transition cursor-pointer"
          >
            <Icon name="FaEdit" size={17} color="black" />
          </button>
        </div>
      ),
    },

    {
      name: "Delete",
      center: true,
      width: "90px",
      selector: (row) => (
        <button
          onClick={() => handleDeletePage(row.id)}
          className="hover:scale-110 transition cursor-pointer"
        >
          <IoTrashBin color="red" size={17} />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex-1">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex justify-between items-center p-0 px-4">
          <div className="text-md font-medium self-center">
            Page Master
          </div>

          <div className="flex items-center gap-2">

            {/* ADD GROUP */}

            <button
              onClick={handleAddGroup}
              className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
            >
              Add Group
            </button>

            {/* ADD PAGE */}

            <button
              onClick={handleAddPage}
              className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
            >
              Add Page
            </button>

          </div>
        </div>

        {/* ================================================= */}
        {/* PAGE TABLE */}
        {/* ================================================= */}

        <Table
          data={pageData}
          columns={pageColumns}
        />
      </div>

      {/* ================================================= */}
      {/* ADD / EDIT PAGE MODAL */}
      {/* ================================================= */}

      <Modal
        title={modalType === "edit" ? "Edit Page" : "Add Page"}
        isOpen={isPageModalOpen}
        onClose={() => {
          setIsPageModalOpen(false);
          pageFormik.resetForm();
          setSelectedPage(null);
        }}
      >
        <form onSubmit={pageFormik.handleSubmit}>

          <div className="grid grid-cols-2 gap-4 mt-6">

            {/* GROUP */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Group
              </label>

              <select
                name="groupName"
                value={pageFormik.values.groupName}
                onChange={pageFormik.handleChange}
                onBlur={pageFormik.handleBlur}
                className={`w-full mt-1 border rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-primary ${
                  pageFormik.touched.groupName &&
                  pageFormik.errors.groupName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">
                  Select Group
                </option>

                {groupData
                  .filter((group) => group.isActive)
                  .map((group) => (
                    <option
                      key={group.id}
                      value={group.groupName}
                    >
                      {group.groupName}
                    </option>
                  ))}
              </select>

              {pageFormik.touched.groupName &&
                pageFormik.errors.groupName && (
                  <p className="text-xs text-red-500 mt-1">
                    {pageFormik.errors.groupName}
                  </p>
                )}
            </div>

            {/* PAGE NAME */}

            <TextInput
              label="Page Name"
              name="pageName"
              placeholder="Enter Page Name"
              value={pageFormik.values.pageName}
              onChange={pageFormik.handleChange}
              onBlur={pageFormik.handleBlur}
              error={
                pageFormik.touched.pageName &&
                pageFormik.errors.pageName
              }
            />

            {/* PAGE DESCRIPTION */}

            <TextInput
              label="Page Description"
              name="pageDescription"
              placeholder="Enter Description"
              value={pageFormik.values.pageDescription}
              onChange={pageFormik.handleChange}
              onBlur={pageFormik.handleBlur}
              error={
                pageFormik.touched.pageDescription &&
                pageFormik.errors.pageDescription
              }
            />

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-2 mt-6">

            <button
              type="button"
              onClick={() => {
                setIsPageModalOpen(false);
                pageFormik.resetForm();
                setSelectedPage(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md text-sm"
            >
              {modalType === "edit"
                ? "Update Page"
                : "Save Page"}
            </button>

          </div>
        </form>
      </Modal>

      {/* ================================================= */}
      {/* ADD / EDIT GROUP MODAL */}
      {/* ================================================= */}

      <Modal
        title={modalType === "edit" ? "Edit Group" : "Add Group"}
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          groupFormik.resetForm();
          setSelectedGroup(null);
        }}
      >
        <form onSubmit={groupFormik.handleSubmit}>

          <div className="grid grid-cols-2 gap-4 mt-6">

            {/* GROUP NAME */}

            <TextInput
              label="Group Name"
              name="groupName"
              placeholder="Enter Group Name"
              value={groupFormik.values.groupName}
              onChange={groupFormik.handleChange}
              onBlur={groupFormik.handleBlur}
              error={
                groupFormik.touched.groupName &&
                groupFormik.errors.groupName
              }
            />

            {/* GROUP ICON */}

            <TextInput
              label="Group Icon"
              name="groupIcon"
              placeholder="Enter Icon Name"
              value={groupFormik.values.groupIcon}
              onChange={groupFormik.handleChange}
              onBlur={groupFormik.handleBlur}
              error={
                groupFormik.touched.groupIcon &&
                groupFormik.errors.groupIcon
              }
            />

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-2 mt-6">

            <button
              type="button"
              onClick={() => {
                setIsGroupModalOpen(false);
                groupFormik.resetForm();
                setSelectedGroup(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md text-sm"
            >
              {modalType === "edit"
                ? "Update Group"
                : "Save Group"}
            </button>

          </div>

        </form>
      </Modal>
    </>
  );
};

export default PageMaster;