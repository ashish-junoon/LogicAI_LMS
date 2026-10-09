import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllVendors,
  CreateVendor,
  UpdateVendor,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const VendorMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);

  // =========================================================
  // FETCH ALL VENDORS
  // =========================================================
  const fetchAllVendors = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllVendors();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setVendorList(transformedData);
    } catch (error) {
      console.error("Error fetching vendors:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch vendors!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const vendorFormik = useFormik({
    initialValues: {
      vendor_name: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      vendor_name: Yup.string()
        .trim()
        .required("Vendor name is required")
        .min(2, "Vendor name must be at least 2 characters")
        .max(100, "Vendor name cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          vendor_name: values.vendor_name.trim(),
          is_active: values.is_active,
        };

        const response = isEdit
          ? await UpdateVendor({
              id: editingVendorId,
              ...req,
            })
          : await CreateVendor(req);

        if (response?.status) {
          await fetchAllVendors();

          toast.success(
            response?.message ||
              (isEdit
                ? "Vendor updated successfully!"
                : "Vendor created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update vendor!"
                : "Unable to create vendor!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating vendor:"
            : "Error creating vendor:",
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

  // =========================================================
  // ADD VENDOR
  // =========================================================
  const handleAddVendor = () => {
    setIsEdit(false);
    setEditingVendorId(null);

    vendorFormik.resetForm({
      values: {
        vendor_name: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT VENDOR
  // =========================================================
  const handleEditVendor = (row) => {
    setIsEdit(true);
    setEditingVendorId(row?.id);

    vendorFormik.setValues({
      vendor_name: row?.vendor_name || "",
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
    setVendorList((prev) =>
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
        vendor_name: row?.vendor_name,
        is_active: nextStatus,
      };

      const response = await UpdateVendor(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Vendor status updated successfully!"
        );
      } else {
        // Revert status
        setVendorList((prev) =>
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
            "Unable to update vendor status!"
        );
      }
    } catch (error) {
      // Revert status
      setVendorList((prev) =>
        prev.map((item) =>
          item.id === row?.id
            ? {
                ...item,
                is_active: row?.is_active,
              }
            : item
        )
      );

      console.error("Error updating vendor status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
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
    setIsModalOpen(false);

    setIsEdit(false);
    setEditingVendorId(null);

    vendorFormik.resetForm({
      values: {
        vendor_name: "",
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
      name: "Vendor Name",
      selector: (row) => row?.vendor_name || "-",
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
            onClick={() => handleEditVendor(row)}
            title="Edit Vendor"
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
          checked={Boolean(row?.is_active)}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  // =========================================================
  // FETCH ON LOAD
  // =========================================================
  useEffect(() => {
    fetchAllVendors();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Vendor Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage vendors
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddVendor}
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

            Add Vendor
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={vendorList}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal
        title={isEdit ? "Update Vendor" : "Add Vendor"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={vendorFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Vendor Name"
            name="vendor_name"
            placeholder="Enter vendor name"
            value={vendorFormik.values.vendor_name}
            onChange={vendorFormik.handleChange}
            onBlur={vendorFormik.handleBlur}
          />

          {vendorFormik.touched.vendor_name &&
            vendorFormik.errors.vendor_name && (
              <p className="mt-1 text-xs text-red-500">
                {vendorFormik.errors.vendor_name}
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
              btnName={
                vendorFormik.isSubmitting
                  ? "Please wait..."
                  : isEdit
                    ? "Update"
                    : "Submit"
              }
              type="submit"
              disabled={
                !vendorFormik.isValid ||
                vendorFormik.isSubmitting
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

export default VendorMaster;