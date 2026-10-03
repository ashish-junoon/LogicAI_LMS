import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllSectors,
  CreateSector,
  UpdateSector,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const SectorMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingSectorId, setEditingSectorId] = useState(null);

  // =========================================================
  // FETCH ALL SECTORS
  // =========================================================
  const fetchAllSectors = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllSectors();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setSectors(transformedData);
    } catch (error) {
      console.error("Error fetching sectors:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch sectors!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const sectorFormik = useFormik({
    initialValues: {
      sector: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      sector: Yup.string()
        .trim()
        .required("Sector is required")
        .min(2, "Sector must be at least 2 characters")
        .max(100, "Sector cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          sector: values.sector.trim(),
          is_active: values.is_active,
        };

        let response;

        if (isEdit) {
          response = await UpdateSector({
            id: editingSectorId,
            ...req,
          });
        } else {
          response = await CreateSector(req);
        }

        if (response?.status) {
          await fetchAllSectors();

          toast.success(
            response?.message ||
              (isEdit
                ? "Sector updated successfully!"
                : "Sector created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update sector!"
                : "Unable to create sector!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error updating sector:"
            : "Error creating sector:",
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
  // ADD SECTOR
  // =========================================================
  const handleAddSector = () => {
    setIsEdit(false);
    setEditingSectorId(null);

    sectorFormik.resetForm({
      values: {
        sector: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT SECTOR
  // =========================================================
  const handleEditSector = (row) => {
    setIsEdit(true);
    setEditingSectorId(row?.id);

    sectorFormik.setValues({
      sector: row?.sector || "",
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
    setSectors((prev) =>
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
        sector: row?.sector,
        is_active: nextStatus,
      };

      const response = await UpdateSector(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Sector status updated successfully!"
        );
      } else {
        // Revert
        setSectors((prev) =>
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
            "Unable to update sector status!"
        );
      }
    } catch (error) {
      // Revert
      setSectors((prev) =>
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
        "Error updating sector status:",
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
    setEditingSectorId(null);

    sectorFormik.resetForm({
      values: {
        sector: "",
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
      name: "Sector",
      selector: (row) => row?.sector || "-",
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
            onClick={() => handleEditSector(row)}
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
    fetchAllSectors();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Sector Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage sectors
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSector}
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

            Add Sector
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={sectors}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Sector" : "Add Sector"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={sectorFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Sector"
            name="sector"
            placeholder="Enter sector"
            value={sectorFormik.values.sector}
            onChange={sectorFormik.handleChange}
            onBlur={sectorFormik.handleBlur}
          />

          {sectorFormik.touched.sector &&
            sectorFormik.errors.sector && (
              <p className="mt-1 text-xs text-red-500">
                {sectorFormik.errors.sector}
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
                !sectorFormik.isValid ||
                sectorFormik.isSubmitting
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

export default SectorMaster;