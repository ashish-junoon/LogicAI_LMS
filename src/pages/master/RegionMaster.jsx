
import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

import {
  GetAllRegions,
  CreateUpdateRegion,
  GetAllZones,
} from "../../api/mastersApi";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const RegionMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRegionId, setEditingRegionId] = useState(null);

  // =========================================================
  // FETCH ALL REGIONS
  // =========================================================
  const fetchAllRegions = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllRegions();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setRegions(transformedData);
    } catch (error) {
      console.error("Error fetching regions:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch regions!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FETCH ALL ZONES
  // =========================================================
  const fetchAllZones = async () => {
    try {
      const response = await GetAllZones();

      if (response?.status) {
        const activeZones =
          response?.data?.filter((item) => item?.is_active) || [];

        setZones(activeZones);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch zones!"
      );
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const regionFormik = useFormik({
    initialValues: {
      region_name: "",
      zone_id: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      region_name: Yup.string()
        .trim()
        .required("Region name is required")
        .min(2, "Region name must be at least 2 characters")
        .max(100, "Region name cannot exceed 100 characters"),

      zone_id: Yup.number()
        .required("Please select a zone")
        .moreThan(0, "Please select a valid zone"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          region_id: editingRegionId || 0,
          region_name: values.region_name.trim(),
          zone_id: Number(values.zone_id),
          is_active: values.is_active,
          created_by: "string",
        };

        const response = await CreateUpdateRegion(req);

        if (response?.status) {
          await fetchAllRegions();

          toast.success(
            response?.message ||
              (isEdit
                ? "Region updated successfully!"
                : "Region created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update region!"
                : "Unable to create region!")
          );
        }
      } catch (error) {
        console.error("Error saving region:", error);

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
  // ADD REGION
  // =========================================================
  const handleAddRegion = () => {
    setIsEdit(false);
    setEditingRegionId(null);

    regionFormik.resetForm({
      values: {
        region_name: "",
        zone_id: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT REGION
  // =========================================================
  const handleEditRegion = (row) => {
    setIsEdit(true);
    setEditingRegionId(row?.region_id);

    regionFormik.setValues({
      region_name: row?.region_name || "",
      zone_id: row?.zone_id || "",
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
    setRegions((prev) =>
      prev.map((item) =>
        item.region_id === row?.region_id
          ? { ...item, is_active: nextStatus }
          : item
      )
    );

    try {
      const req = {
        region_id: row?.region_id,
        region_name: row?.region_name,
        zone_id: row?.zone_id,
        is_active: nextStatus,
        created_by: "string",
      };

      const response = await CreateUpdateRegion(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Region status updated successfully!"
        );
      } else {
        // Revert on failure
        setRegions((prev) =>
          prev.map((item) =>
            item.region_id === row?.region_id
              ? { ...item, is_active: row?.is_active }
              : item
          )
        );

        toast.info(
          response?.message ||
            "Unable to update region status!"
        );
      }
    } catch (error) {
      // Revert on error
      setRegions((prev) =>
        prev.map((item) =>
          item.region_id === row?.region_id
            ? { ...item, is_active: row?.is_active }
            : item
        )
      );

      console.error("Error updating region status:", error);

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
    setEditingRegionId(null);

    regionFormik.resetForm({
      values: {
        region_name: "",
        zone_id: "",
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
      name: "Region Name",
      selector: (row) => row?.region_name || "-",
      sortable: true,
      grow: 1,
    },
    {
      name: "Zone",
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
            onClick={() => handleEditRegion(row)}
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
    fetchAllRegions();
    fetchAllZones();
  }, []);

  return (
    <>
      <div className="flex-1">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Region Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage regions and their associated zones
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddRegion}
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

            Add Region
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={regions}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Region" : "Add Region"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={regionFormik.handleSubmit}
          className="pt-2"
        >

          {/* REGION NAME */}
          <TextInput
            label="Region Name"
            name="region_name"
            placeholder="Enter region name"
            value={regionFormik.values.region_name}
            onChange={regionFormik.handleChange}
            onBlur={regionFormik.handleBlur}
          />

          {regionFormik.touched.region_name &&
            regionFormik.errors.region_name && (
              <p className="mt-1 text-xs text-red-500">
                {regionFormik.errors.region_name}
              </p>
            )}

          {/* ZONE */}
          <div className="mt-3">
            <SelectInput
              label="Zone"
              name="zone_id"
              placeholder={"Select zone"}
              options={zones.map((item) => ({
                value: item.zone_id,
                label: item.zone_name,
              }))}
              value={regionFormik.values.zone_id}
              onChange={(e) =>
                regionFormik.setFieldValue(
                  "zone_id",
                  e.target.value
                )
              }
              onBlur={regionFormik.handleBlur}
            />

            {regionFormik.touched.zone_id &&
              regionFormik.errors.zone_id && (
                <p className="mt-1 text-xs text-red-500">
                  {regionFormik.errors.zone_id}
                </p>
              )}
          </div>

          {/* BUTTONS */}
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
                !regionFormik.isValid ||
                regionFormik.isSubmitting
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

export default RegionMaster;
