import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllGenders,
  CreateGender,
  UpdateGender,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const GenderMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genders, setGenders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingGenderId, setEditingGenderId] = useState(null);

  // =========================================================
  // FETCH ALL GENDERS
  // =========================================================
  const fetchAllGenders = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllGenders();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setGenders(transformedData);
    } catch (error) {
      console.error("Error fetching genders:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch genders!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const genderFormik = useFormik({
    initialValues: {
      gender: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      gender: Yup.string()
        .trim()
        .required("Gender is required")
        .min(2, "Gender must be at least 2 characters")
        .max(100, "Gender cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          gender: values.gender.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateGender({
            id: editingGenderId,
            ...req,
          });
        } else {
          response = await CreateGender(req);
        }

        if (response?.status) {
          await fetchAllGenders();

          toast.success(
            response?.message ||
              (isEdit
                ? "Gender updated successfully!"
                : "Gender created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update gender!"
                : "Unable to create gender!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating gender:"
            : "Error creating gender:",
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
  // ADD GENDER
  // =========================================================
  const handleAddGender = () => {
    setIsEdit(false);
    setEditingGenderId(null);

    genderFormik.resetForm({
      values: {
        gender: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT GENDER
  // =========================================================
  const handleEditGender = (row) => {
    setIsEdit(true);
    setEditingGenderId(row?.id);

    genderFormik.setValues({
      gender: row?.gender || "",
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
    setGenders((prev) =>
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
      const response = await UpdateGender({
        id: row?.id,
        gender: row?.gender,
        is_active: nextStatus,
      });

      if (response?.status) {
        toast.success(
          response?.message ||
            "Gender status updated successfully!"
        );
      } else {
        // Revert if API fails
        setGenders((prev) =>
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
            "Unable to update gender status!"
        );
      }
    } catch (error) {
      // Revert if API throws an error
      setGenders((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item
        )
      );

      console.error("Error updating gender status:", error);

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
    setEditingGenderId(null);

    genderFormik.resetForm({
      values: {
        gender: "",
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
      name: "Gender",
      selector: (row) => row?.gender || "-",
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
            onClick={() => handleEditGender(row)}
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
    fetchAllGenders();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Gender Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage genders
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddGender}
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
            Add Gender
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={genders}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Gender" : "Add Gender"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={genderFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Gender"
            name="gender"
            placeholder="Enter gender"
            value={genderFormik.values.gender}
            onChange={genderFormik.handleChange}
            onBlur={genderFormik.handleBlur}
          />

          {genderFormik.touched.gender &&
            genderFormik.errors.gender && (
              <p className="mt-1 text-xs text-red-500">
                {genderFormik.errors.gender}
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
                !genderFormik.isValid ||
                genderFormik.isSubmitting
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

export default GenderMaster;