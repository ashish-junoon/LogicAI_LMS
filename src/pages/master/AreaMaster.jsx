
import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";

import {
  GetAllAreas,
  CreateUpdateArea,
  GetAllRegions,
} from "../../api/mastersApi";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const AreaMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [areas, setAreas] = useState([]);
  const [regions, setRegions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState(null);

  // =========================================================
  // FETCH ALL AREAS
  // =========================================================
  const fetchAllAreas = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllAreas();

      const transformedData =
        response?.data?.map((item, index) => ({
          ...item,
          sn: index + 1,
        })) || [];

      setAreas(transformedData);
    } catch (error) {
      console.error("Error fetching areas:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch areas!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FETCH ALL REGIONS
  // =========================================================
  const fetchAllRegions = async () => {
    try {
      const response = await GetAllRegions();

      if (response?.status) {
        const activeRegions =
          response?.data?.filter((item) => item?.is_active) || [];

        setRegions(activeRegions);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch regions!"
      );
    }
  };

  // =========================================================
  // FORMIK
  // =========================================================
  const areaFormik = useFormik({
    initialValues: {
      area_name: "",
      region_id: "",
      is_active: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      area_name: Yup.string()
        .trim()
        .required("Area name is required")
        .min(2, "Area name must be at least 2 characters")
        .max(100, "Area name cannot exceed 100 characters"),

      region_id: Yup.number()
        .required("Please select a region")
        .moreThan(0, "Please select a valid region"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          area_id: editingAreaId || 0,
          area_name: values.area_name.trim(),
          region_id: Number(values.region_id),
          is_active: values.is_active,
          created_by: "string",
        };

        const response = await CreateUpdateArea(req);

        if (response?.status) {
          await fetchAllAreas();

          toast.success(
            response?.message ||
              (isEdit
                ? "Area updated successfully!"
                : "Area created successfully!")
          );

          closeModal();
          resetForm();
        } else {
          toast.info(
            response?.message ||
              (isEdit
                ? "Unable to update area!"
                : "Unable to create area!")
          );
        }
      } catch (error) {
        console.error("Error saving area:", error);

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
  // ADD AREA
  // =========================================================
  const handleAddArea = () => {
    setIsEdit(false);
    setEditingAreaId(null);

    areaFormik.resetForm({
      values: {
        area_name: "",
        region_id: "",
        is_active: true,
      },
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT AREA
  // =========================================================
  const handleEditArea = (row) => {
    setIsEdit(true);
    setEditingAreaId(row?.area_id);

    areaFormik.setValues({
      area_name: row?.area_name || "",
      region_id: row?.region_id || "",
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
    setAreas((prev) =>
      prev.map((item) =>
        item.area_id === row?.area_id
          ? { ...item, is_active: nextStatus }
          : item
      )
    );

    try {
      const req = {
        area_id: row?.area_id,
        area_name: row?.area_name,
        region_id: row?.region_id,
        is_active: nextStatus,
        created_by: "string",
      };

      const response = await CreateUpdateArea(req);

      if (response?.status) {
        toast.success(
          response?.message ||
            "Area status updated successfully!"
        );
      } else {
        // Revert on failure
        setAreas((prev) =>
          prev.map((item) =>
            item.area_id === row?.area_id
              ? { ...item, is_active: row?.is_active }
              : item
          )
        );

        toast.info(
          response?.message ||
            "Unable to update area status!"
        );
      }
    } catch (error) {
      // Revert on error
      setAreas((prev) =>
        prev.map((item) =>
          item.area_id === row?.area_id
            ? { ...item, is_active: row?.is_active }
            : item
        )
      );

      console.error("Error updating area status:", error);

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
    setEditingAreaId(null);

    areaFormik.resetForm({
      values: {
        area_name: "",
        region_id: "",
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
      name: "Area Name",
      selector: (row) => row?.area_name || "-",
      sortable: true,
      grow: 1,
    },
    {
      name: "Region",
      selector: (row) => row?.region_name || "-",
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
            onClick={() => handleEditArea(row)}
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
    fetchAllAreas();
    fetchAllRegions();
  }, []);

  return (
    <>
      <div className="flex-1">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-md font-medium text-slate-800">
              Area Master
            </h2>

            <p className="text-[11px] text-slate-400">
              Manage areas and their associated regions
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddArea}
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

            Add Area
          </button>
        </div>

        {/* TABLE */}
        <Table
          data={areas}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* MODAL */}
      <Modal
        title={isEdit ? "Update Area" : "Add Area"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form
          onSubmit={areaFormik.handleSubmit}
          className="pt-2"
        >

          {/* AREA NAME */}
          <TextInput
            label="Area Name"
            name="area_name"
            placeholder="Enter area name"
            value={areaFormik.values.area_name}
            onChange={areaFormik.handleChange}
            onBlur={areaFormik.handleBlur}
          />

          {areaFormik.touched.area_name &&
            areaFormik.errors.area_name && (
              <p className="mt-1 text-xs text-red-500">
                {areaFormik.errors.area_name}
              </p>
            )}

          {/* REGION */}
          <div className="mt-3">
            <SelectInput
              label="Region"
              name="region_id"
              options={regions.map((item) => ({
                value: item.region_id,
                label: item.region_name,
              }))}
              value={areaFormik.values.region_id}
              onChange={(e) =>
                areaFormik.setFieldValue(
                  "region_id",
                  e.target.value
                )
              }
              onBlur={areaFormik.handleBlur}
            />

            {areaFormik.touched.region_id &&
              areaFormik.errors.region_id && (
                <p className="mt-1 text-xs text-red-500">
                  {areaFormik.errors.region_id}
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
                !areaFormik.isValid ||
                areaFormik.isSubmitting
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

export default AreaMaster;
