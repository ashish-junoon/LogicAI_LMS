import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Modal from "../../components/utils/Modal";
import Button from "../../components/utils/Button";
import SelectInput from "../../components/fields/SelectInput";
import { toast } from "react-toastify";
import {
  GetAllLeadSources,
  CreateLeadSource,
  UpdateLeadSource,
} from "../../api/mastersApi";

// =========================================================
// LOGGED-IN USER (used for `created_by` field of the API)
// =========================================================
const getCreatedBy = () =>
  localStorage.getItem("username") ||
  localStorage.getItem("userName") ||
  localStorage.getItem("email") ||
  "admin";

const LeadSource = () => {
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    lead_source: "",
    is_active: true,
  });

  // =========================================================
  // FETCH ALL LEAD SOURCES
  // =========================================================
  const fetchAllLeadSources = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllLeadSources();

      if (response?.status) {
        setLeadSourceList(response?.data || []);
      } else {
        setLeadSourceList([]);

        toast.info(
          response?.msg ||
            response?.message ||
            "Unable to fetch lead source list!"
        );
      }
    } catch (error) {
      console.error("Error fetching lead sources:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to fetch lead sources!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================
  useEffect(() => {
    fetchAllLeadSources();
  }, []);

  // =========================================================
  // OPEN ADD FORM
  // =========================================================
  const handleAdd = () => {
    setIsEdit(false);
    setEditingId(null);

    setFormData({
      lead_source: "",
      is_active: true,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================
  const handleEdit = (row) => {
    setIsEdit(true);
    setEditingId(row.id);

    setFormData({
      lead_source: row.lead_source || "",
      is_active: !!row.is_active,
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE / UPDATE (hits API)
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = formData.lead_source.trim();

    if (!trimmed) {
      toast.info("Lead Source is required!");
      return;
    }

    try {
      setIsLoading(true);

      // ---- Exact API payload ----
      const req = {
        id: isEdit ? editingId : 0,
        lead_source: trimmed,
        is_active: formData.is_active,
        created_by: getCreatedBy(),
      };

      const response = isEdit
        ? await UpdateLeadSource(req)
        : await CreateLeadSource(req);

      if (response?.status) {
        await fetchAllLeadSources();

        toast.success(
          response?.msg ||
            response?.message ||
            (isEdit
              ? "Lead Source updated successfully!"
              : "Lead Source created successfully!")
        );

        handleClose();
      } else {
        toast.info(
          response?.msg ||
            response?.message ||
            (isEdit
              ? "Unable to update lead source!"
              : "Unable to create lead source!")
        );
      }
    } catch (error) {
      console.error(
        isEdit
          ? "Error updating lead source:"
          : "Error creating lead source:",
        error
      );

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Something went wrong!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // TOGGLE STATUS (optimistic + API + revert)
  // =========================================================
  const handleToggleStatus = async (row) => {
    const nextStatus = !row.is_active;

    // Optimistic update
    setLeadSourceList((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? { ...item, is_active: nextStatus }
          : item
      )
    );

    try {
      const req = {
        id: row.id,
        lead_source: row.lead_source,
        is_active: nextStatus,
        created_by: getCreatedBy(),
      };

      const response = await UpdateLeadSource(req);

      if (response?.status) {
        toast.success(
          response?.msg ||
            response?.message ||
            "Lead Source status updated successfully!"
        );
      } else {
        // Revert
        setLeadSourceList((prev) =>
          prev.map((item) =>
            item.id === row.id
              ? { ...item, is_active: row.is_active }
              : item
          )
        );

        toast.info(
          response?.msg ||
            response?.message ||
            "Unable to update lead source status!"
        );
      }
    } catch (error) {
      // Revert
      setLeadSourceList((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? { ...item, is_active: row.is_active }
            : item
        )
      );

      console.error("Error updating lead source status:", error);

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
  const handleClose = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setEditingId(null);

    setFormData({
      lead_source: "",
      is_active: true,
    });
  };

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Lead Source",
      selector: (row) => row?.lead_source || "-",
      sortable: true,
      grow: 1,
    },
    {
      name: "Status",
      center: true,
      width: "120px",
      selector: (row) => (
        <TogleInput
          checked={!!row?.is_active}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
    {
      name: "Action",
      center: true,
      width: "100px",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleEdit(row)}
          className="text-xs font-semibold text-primary cursor-pointer"
        >
          Edit
        </button>
      ),
    },
  ];

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div>
          <div className="text-md font-medium text-ink-800">
            All Lead Sources
          </div>
          <p className="text-[11px] text-ink-400">
            Manage lead source types
          </p>
        </div>

        <Button
          style={"bg-primary text-white text-sm"}
          type="button"
          onClick={handleAdd}
        >
          + Add Lead Source
        </Button>
      </div>

      {/* Table */}
      <Table
        data={leadSourceList}
        columns={columns}
        loading={isLoading}
      />

      {/* Add / Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={isEdit ? "Update Lead Source" : "Add Lead Source"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 my-4">
            <TextInput
              label="Lead Source"
              name="lead_source"
              value={formData.lead_source}
              onChange={handleChange}
              placeholder="Enter lead source"
              required
            />

            <SelectInput
              label="Status"
              name="is_active"
              value={formData.is_active ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.value === "true",
                }))
              }
              options={[
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ]}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              style={"bg-primary text-white text-sm py-0 disabled:opacity-50 disabled:cursor-not-allowed"}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeadSource;