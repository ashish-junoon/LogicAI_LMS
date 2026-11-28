
import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  GetAllZones,
  CreateUpdateZone,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showValidationError } from "../../components/utils/common";

const ZoneMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState(null);

  // =========================================================
  // FETCH ALL ZONES
  // =========================================================
  const fetchAllZones = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllZones();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setZones(transformedData);
    } catch (error) {
      console.error("Error fetching zones:", error);
      showValidationError(error)
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const zoneFormik = useFormik({
    initialValues: {
      zone_name: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      zone_name: Yup.string()
        .trim()
        .required("Zone name is required")
        .min(2, "Zone name must be at least 2 characters")
        .max(100, "Zone name cannot exceed 100 characters"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          zone_id: editingZoneId || 0,
          zone_name: values.zone_name.trim(),
          is_active: values.is_active,
          created_by: "string",
        };

        const response = await CreateUpdateZone(req);

        if (response?.status) {
          await fetchAllZones();

          toast.success(
            response?.message ||
              (isEdit
                ? "Zone updated successfully!"
                : "Zone created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update zone!"
                : "Unable to create zone!")
          );
        }
      } catch (error) {
        console.error("Error saving zone:", error);

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
  // ADD ZONE
  // =========================================================
  const handleAddZone = () => {
    setIsEdit(false);
    setEditingZoneId(null);

    zoneFormik.resetForm({
      values: {
        zone_name: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT ZONE
  // =========================================================
  const handleEditZone = (row) => {
    setIsEdit(true);
    setEditingZoneId(row?.zone_id);

    zoneFormik.setValues({
      zone_name: row?.zone_name || "",
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
    setZones((prev) =>
      prev.map((item) =>
        item.zone_id === row?.zone_id
          ? { ...item, is_active: nextStatus }
          : item
      )
    );

    try {
      const req = {
        zone_id: row?.zone_id,
        zone_name: row?.zone_name,
        is_active: nextStatus,
        created_by: "string",
      };

      const response = await CreateUpdateZone(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Zone status updated successfully!"
        );
      } else {
        // Revert on failure
        setZones((prev) =>
          prev.map((item) =>
            item.zone_id === row?.zone_id
              ? { ...item, is_active: row?.is_active }
              : item
          )
        );

        toast.info(
          response?.message ||
            "Unable to update zone status!"
        );
      }
    } catch (error) {
      // Revert on error
      setZones((prev) =>
        prev.map((item) =>
          item.zone_id === row?.zone_id
            ? { ...item, is_active: row?.is_active }
            : item
        )
      );

      console.error("Error updating zone status:", error);

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
    setEditingZoneId(null);

    zoneFormik.resetForm({
      values: {
        zone_name: "",
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
      name: "Zone Name",
      selector: (row) => row?.zone_name || "-",
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
            onClick={() => handleEditZone(row)}
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
    fetchAllZones();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Zone Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage zones
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddZone}
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

            Add Zone
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={zones}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Zone" : "Add Zone"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={zoneFormik.handleSubmit}
          className="pt-2"
        >
          <TextInput
            label="Zone Name"
            name="zone_name"
            placeholder="Enter zone name"
            value={zoneFormik.values.zone_name}
            onChange={zoneFormik.handleChange}
            onBlur={zoneFormik.handleBlur}
          />

          {zoneFormik.touched.zone_name &&
            zoneFormik.errors.zone_name && (
              <p className="mt-1 text-xs text-red-500">
                {zoneFormik.errors.zone_name}
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
                !zoneFormik.isValid ||
                zoneFormik.isSubmitting
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

export default ZoneMaster;
