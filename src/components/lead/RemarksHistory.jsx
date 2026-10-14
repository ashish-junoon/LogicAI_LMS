import React, { useState } from "react";
import {
  RiChatHistoryLine,
  RiTimeLine,
  RiUser3Line,
  RiSearchLine,
} from "react-icons/ri";

import Button from "../utils/Button";
import Modal from "../utils/Modal";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import { SaveAdditionalRemark } from "../../api/application";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const RemarksHistory = ({
  remarks = [],
  className = "",
  maxHeight = "400px",
  permission = false,
  remarkOptions,
  fetchData
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const appplicationId = searchParams?.get("application_id");

  const formik = useFormik({
    initialValues: {
      reason: "",
      remarks: "",
    },

    validationSchema: Yup.object({
      reason: Yup.string().required("Please select a remark"),
      remarks: Yup.string().trim().required("Please enter a description"),
    }),

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        application_id: appplicationId,
        is_prove: true,
        step_status: 0,
        reason: values.reason,
        remarks: values.remarks.trim(),
        updated_by: "USR0001",
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      };

      try {
        const response = await SaveAdditionalRemark(payload);
        if(response.status){
          toast.success(response?.message || "Remark saved successfully");
          resetForm();
          setOpen(false);
          fetchData && fetchData()
        }
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Failed to save remark");
      }
    },
  });

  // Use passed options when available; otherwise, use local defaults
  const defaultRemarkOptions = [
    { label: "Remark 1", value: "Remark 1" },
    { label: "Remark 2", value: "Remark 2" },
  ];

  const finalRemarkOptions =
    Array.isArray(remarkOptions) && remarkOptions.length > 0
      ? remarkOptions
      : defaultRemarkOptions;

  const remarkData = remarks.map((item) => ({
    id: item.id,
    status: item.is_prove ? "Completed" : "Pending",
    step: item.reason || `Step ${item.step_status || ""}`.trim(),
    remark: item.remarks || "-",
    description: item.product_name || "-",
    processedBy: item.updated_by || "-",
    processedOn: item.updated_date || "-",
  }));

  // Filter and search remarks
  const getFilteredRemarks = () => {
    let filtered = remarkData;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (r) =>
          String(r.status || "")
            .toLowerCase()
            .includes(term) ||
          String(r.step || "")
            .toLowerCase()
            .includes(term) ||
          String(r.remark || "")
            .toLowerCase()
            .includes(term) ||
          String(r.description || "")
            .toLowerCase()
            .includes(term) ||
          String(r.processedBy || "")
            .toLowerCase()
            .includes(term),
      );
    }

    return filtered;
  };

  const filteredRemarks = getFilteredRemarks();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex justify-between items-center w-full">
          <div className="relative">
            <RiSearchLine
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={14}
            />

            <input
              type="text"
              placeholder="Search remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-2">
            {permission && (
              <Button
                btnName="Add Remarks"
                btnIcon="IoAddCircleOutline"
                onClick={() => setOpen(true)}
                style="bg-primary text-white text-sm font-medium py-0 rounded-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-auto rounded-lg border border-gray-200 no-scrollbar"
        style={{ maxHeight }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Step
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Remark
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-nowrap">
                Processed By
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-nowrap">
                Processed On
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRemarks.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  <RiChatHistoryLine className="mx-auto text-gray-300 text-3xl mb-2" />
                  No remarks found matching your criteria
                </td>
              </tr>
            ) : (
              filteredRemarks.map((remark) => (
                <tr
                  key={remark.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-800">
                      {remark.step}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-800 font-medium">
                      {remark.remark}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 line-clamp-2">
                      {remark.description}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <RiUser3Line className="text-gray-400" size={12} />
                      <span className="text-xs text-gray-700">
                        {remark.processedBy}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <RiTimeLine className="text-gray-400" size={12} />
                      <span className="text-xs text-gray-600">
                        {remark.processedOn}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>
          Showing {filteredRemarks.length} of {remarkData.length} entries
        </span>

        {searchTerm && <span>Search results for: "{searchTerm}"</span>}
      </div>

      {/* Add Remarks Modal */}
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          formik.resetForm();
        }}
        title="Add Remarks"
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-2 my-3">
            <div>
              <SelectInput
                label="Remark"
                placeholder="Select Remark"
                options={finalRemarkOptions}
                value={formik.values.reason}
                onChange={(value) => {
                  formik.setFieldValue(
                    "reason",
                    value?.target ? value.target.value : value,
                  );
                }}
                onBlur={() => formik.setFieldTouched("reason", true)}
              />

              {formik.touched.reason && formik.errors.reason && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.reason}
                </p>
              )}
            </div>

            <div>
              <TextInput
                label="Description"
                placeholder="Enter description"
                name="remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.remarks && formik.errors.remarks && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.remarks}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-1 items-center justify-end">
            <Button
              btnName="Cancel"
              style="border border-gray-200"
              onClick={() => {
                setOpen(false);
                formik.resetForm();
              }}
              disabled={formik.isSubmitting}
            />

            <Button
              btnName={formik.isSubmitting ? "Submitting..." : "Submit"}
              style="bg-primary text-white"
              disabled={formik.isSubmitting}
              onClick={formik.handleSubmit}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RemarksHistory;
