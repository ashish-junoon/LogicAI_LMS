import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllReligions,
  CreateReligion,
  UpdateReligion,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const ReligionMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [religions, setReligions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingReligionId, setEditingReligionId] = useState(null);

  // =========================================================
  // FETCH ALL RELIGIONS
  // =========================================================
  const fetchAllReligions = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllReligions();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setReligions(transformedData);
    } catch (error) {
      console.error("Error fetching religions:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch religions!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const religionFormik = useFormik({
    initialValues: {
      religion: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      religion: Yup.string()
        .trim()
        .required("Religion is required")
        .min(2, "Religion must be at least 2 characters")
        .max(100, "Religion cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          religion: values.religion.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateReligion({
            id: editingReligionId,
            ...req,
          });
        } else {
          response = await CreateReligion(req);
        }

        if (response?.status) {
          await fetchAllReligions();

          toast.success(
            response?.message ||
              (isEdit
                ? "Religion updated successfully!"
                : "Religion created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update religion!"
                : "Unable to create religion!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating religion:"
            : "Error creating religion:",
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
  // ADD RELIGION
  // =========================================================
  const handleAddReligion = () => {
    setIsEdit(false);
    setEditingReligionId(null);

    religionFormik.resetForm({
      values: {
        religion: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT RELIGION
  // =========================================================
  const handleEditReligion = (row) => {
    setIsEdit(true);
    setEditingReligionId(row?.id);

    religionFormik.setValues({
      religion: row?.religion || "",
      is_active:
        typeof row?.is_active === "boolean"
          ? row.is_active
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
    setReligions((prev) =>
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
        religion: row?.religion,
        is_active: nextStatus,
      };

      const response = await UpdateReligion(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Religion status updated successfully!"
        );
      } else {
        // Revert
        setReligions((prev) =>
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
            "Unable to update religion status!"
        );
      }
    } catch (error) {
      // Revert
      setReligions((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item
        )
      );

      console.error(
        "Error updating religion status:",
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
  const closeModal = () => {
    setIsModalOpen(false);

    setIsEdit(false);
    setEditingReligionId(null);

    religionFormik.resetForm({
      values: {
        religion: "",
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
      name: "Religion",
      selector: (row) => row?.religion || "-",
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
            onClick={() => handleEditReligion(row)}
            className="
              w-7 h-7
              flex items-center justify-center
              rounded-md
              hover:bg-primary/10
              transition
            "
          >
            <Icon
              name="FaEdit"
              size={16}
              color="5050b8"
            />
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
    fetchAllReligions();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Religion Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage religions
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddReligion}
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

            Add Religion
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={religions}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Religion" : "Add Religion"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={religionFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Religion"
            name="religion"
            placeholder="Enter religion"
            value={religionFormik.values.religion}
            onChange={religionFormik.handleChange}
            onBlur={religionFormik.handleBlur}
          />

          {religionFormik.touched.religion &&
            religionFormik.errors.religion && (
              <p className="mt-1 text-xs text-red-500">
                {religionFormik.errors.religion}
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
                !religionFormik.isValid ||
                religionFormik.isSubmitting
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

export default ReligionMaster;