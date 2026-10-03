import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import {
  CreateBusinessType,
  GetAllBusinessTypes,
  UpdateBusinessType,
} from "../../api/mastersApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const BusinessTypeMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);

  // Fetch all business types
  const fetchAllBusinessTypes = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllBusinessTypes();

      const transformedData = response.data?.map((item, index) => ({
        ...item,
        sn: index + 1,
      }));

      setBusinessTypes(transformedData || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.title ||
          error?.message ||
          "Failed to fetch business types!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal to add
  const handleAddBusinessType = () => {
    setIsEdit(false);
    setEditingBusinessId(null);
    BusinessTypeFormik.resetForm({
      values: {
        business_type: "",
        is_active: true,
      },
    });
    setIsModalOpen(true);
  };

  // Open modal to edit
  const handleEditBusinessType = (row) => {
    setIsEdit(true);
    setEditingBusinessId(row.id);

    BusinessTypeFormik.setValues({
      business_type: row.business_type || "",
      is_active: row.is_active,
    });

    setIsModalOpen(true);
  };

  // Toggle status
  const handleToggleStatus = async (row) => {
    const nextStatus = !row.is_active;

    // Optimistic update
    setBusinessTypes((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? { ...item, is_active: nextStatus }
          : item
      )
    );

    try {
      const response = await UpdateBusinessType({
        id: row.id,
        business_type: row.business_type,
        is_active: nextStatus,
        created_by: "ADMIN",
      });

      if (!response?.status) {
        // Revert on failure
        setBusinessTypes((prev) =>
          prev.map((item) =>
            item.id === row.id
              ? { ...item, is_active: row.is_active }
              : item
          )
        );

        toast.info(response?.msg || "Unable to update status!");
        return;
      }

      toast.success(response?.msg || "Status updated successfully!");
    } catch (error) {
      // Revert on error
      setBusinessTypes((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? { ...item, is_active: row.is_active }
            : item
        )
      );

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Something went wrong!"
      );
    }
  };

  // Formik
  const BusinessTypeFormik = useFormik({
    initialValues: {
      business_type: "",
      is_active: true,
    },

    enableReinitialize: false,

    validationSchema: Yup.object({
      business_type: Yup.string()
        .trim()
        .required("Business type is required")
        .min(2, "Business type must be at least 2 characters")
        .max(100, "Business type cannot exceed 100 characters"),
      is_active: Yup.boolean().required("Please select status"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          business_type: values.business_type.trim(),
          is_active: values.is_active === true || values.is_active === "true",
          created_by: "ADMIN",
        };

        let response;

        if (isEdit) {
          response = await UpdateBusinessType({
            id: editingBusinessId,
            ...req,
          });
        } else {
          response = await CreateBusinessType(req);
        }

        if (response?.status) {
          await fetchAllBusinessTypes();

          toast.success(
            response.msg ||
              (isEdit
                ? "Business type updated successfully!"
                : "Business type created successfully!")
          );

          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingBusinessId(null);
        } else {
          toast.info(
            response?.msg ||
              (isEdit
                ? "Unable to update business type!"
                : "Unable to add business type!")
          );
        }
      } catch (error) {
        console.error("Business type save error:", error);

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  const ErrorText = ({ name }) =>
    BusinessTypeFormik.touched[name] &&
    BusinessTypeFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">
        {BusinessTypeFormik.errors[name]}
      </p>
    ) : null;

  const columns = [
    {
      name: "#",
      selector: (row) => row.sn,
      sortable: true,
      width: "80px",
    },
    {
      name: "Business Type",
      selector: (row) => row.business_type,
      sortable: true,
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleEditBusinessType(row)}
          className="cursor-pointer"
          title="Edit business type"
        >
          <Icon name="FaEdit" size={18} color="black" />
        </button>
      ),
    },
    {
      name: "Status",
      center: true,
      cell: (row) => (
        <TogleInput
          checked={row.is_active}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchAllBusinessTypes();
  }, []);

  return (
    <>
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center px-4">
          <div className="text-md font-medium">
            All Business Types
          </div>

          <button
            type="button"
            onClick={handleAddBusinessType}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex items-center gap-2 cursor-pointer"
          >
            Add Business Type
          </button>
        </div>

        {/* Table */}
        <Table data={businessTypes} columns={columns} />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={isEdit ? "Update Business Type" : "Add Business Type"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={BusinessTypeFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div>
              <TextInput
                label="Business Type"
                name="business_type"
                value={BusinessTypeFormik.values.business_type}
                onChange={BusinessTypeFormik.handleChange}
                onBlur={BusinessTypeFormik.handleBlur}
                placeholder="Enter business type"
              />

              <ErrorText name="business_type" />
            </div>

            <div>
              <SelectInput
                label="Status"
                placeholder="Select status"
                name="is_active"
                value={BusinessTypeFormik.values.is_active}
                onChange={(value) =>
                  BusinessTypeFormik.setFieldValue(
                    "is_active",
                    value?.target ? value.target.value : value
                  )
                }
                onBlur={BusinessTypeFormik.handleBlur}
                options={[
                  { label: "Active", value: true },
                  { label: "Deactive", value: false },
                ]}
              />

              <ErrorText name="is_active" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              onClick={() => setIsModalOpen(false)}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              style="bg-primary text-sm text-white hover:bg-primary/90"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BusinessTypeMaster;