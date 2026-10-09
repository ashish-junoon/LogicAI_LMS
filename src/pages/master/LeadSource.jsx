import React, { useState } from "react";
import Table from "../../components/Table";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Modal from "../../components/utils/Modal";
import Button from "../../components/utils/Button";
import SelectInput from "../../components/fields/SelectInput";

const initialLeadSources = [
  { id: 1, source_type: "Direct", is_active: true },
  { id: 2, source_type: "Referral", is_active: true },
  { id: 3, source_type: "Website", is_active: true },
  { id: 4, source_type: "Social Media", is_active: true },
  { id: 5, source_type: "Walk-in", is_active: true },
  { id: 6, source_type: "Telecalling", is_active: false },
  { id: 7, source_type: "Partner / DSA", is_active: true },
  { id: 8, source_type: "Employee Referral", is_active: true },
  { id: 9, source_type: "Campaign", is_active: false },
  { id: 10, source_type: "Other", is_active: true },
];

const LeadSource = () => {
  const [leadSourceList, setLeadSourceList] = useState(initialLeadSources);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    source_type: "",
    is_active: true,
  });

  // Open Add Form
  const handleAdd = () => {
    setIsEdit(false);
    setEditingId(null);

    setFormData({
      source_type: "",
      is_active: true,
    });

    setIsModalOpen(true);
  };

  // Open Edit Form
  const handleEdit = (row) => {
    setIsEdit(true);
    setEditingId(row.id);

    setFormData({
      source_type: row.source_type || "",
      is_active: row.is_active,
    });

    setIsModalOpen(true);
  };

  // Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save / Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.source_type.trim()) {
      return;
    }

    if (isEdit) {
      setLeadSourceList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                source_type: formData.source_type.trim(),
                is_active: formData.is_active,
              }
            : item,
        ),
      );
    } else {
      const newLeadSource = {
        id:
          leadSourceList.length > 0
            ? Math.max(...leadSourceList.map((item) => item.id)) + 1
            : 1,
        source_type: formData.source_type.trim(),
        is_active: formData.is_active,
      };

      setLeadSourceList((prev) => [...prev, newLeadSource]);
    }

    handleClose();
  };

  // Toggle Status
  const handleToggleStatus = (row) => {
    setLeadSourceList((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
              ...item,
              is_active: !item.is_active,
            }
          : item,
      ),
    );
  };

  // Close Modal
  const handleClose = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setEditingId(null);

    setFormData({
      source_type: "",
      is_active: true,
    });
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row?.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Source Type",
      selector: (row) => row?.source_type || "-",
      sortable: true,
    },
    {
      name: "Status",
      center: true,
      width: "120px",
      selector: (row) => (
        <TogleInput
          checked={row?.is_active}
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

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div>
          <div className="text-md font-medium text-ink-800">
            All Lead Sources
          </div>
          <p className="text-[11px] text-ink-400">Manage lead source types</p>
        </div>

        <Button style={"bg-primary text-white text-sm"} type="button" onClick={handleAdd}>
          + Add Lead Source
        </Button>
      </div>

      {/* Table */}
      <Table data={leadSourceList} columns={columns} />

      {/* Add / Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={isEdit ? "Update Lead Source" : "Add Lead Source"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 my-4">
            <TextInput
              label="Source Type"
              name="source_type"
              value={formData.source_type}
              onChange={handleChange}
              placeholder="Enter source type"
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
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>

            <Button type="submit" style={"bg-primary text-white text-sm py-0"}>{isEdit ? "Update" : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeadSource;
