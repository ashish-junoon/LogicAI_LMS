import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuthData } from "../context/authContext";
// import { UpdateUtrDetails } from "../../api/application"; 

const UpdateUtrModal = ({ isOpen, onClose, customerId, applicationId, onSuccess }) => {
  const { authData } = useAuthData();

  const formik = useFormik({
    initialValues: {
      utr_number: "",
      disbursement_date: "",
      amount: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      utr_number: Yup.string().trim().required("UTR number is required"),
      disbursement_date: Yup.date()
        .typeError("Invalid date")
        .required("Disbursement date is required"),
      amount: Yup.number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than 0")
        .required("Amount is required"),
      remarks: Yup.string().max(200, "Too long"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!customerId || !applicationId) {
        toast.error("Customer ID and Application ID are required.");
        return;
      }

      try {
        const payload = {
          customer_id: customerId,
          application_id: applicationId,
          utr_number: values.utr_number.trim(),
          disbursement_date: values.disbursement_date,
          amount: Number(values.amount),
          remarks: values.remarks?.trim() || "",
          creadted_by: authData?.user_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
        };

        // const response = await UpdateUtrDetails(payload);
        const response = {};

        if (response?.status) {
          toast.success(response?.message || "UTR updated successfully.");
          resetForm();
          onSuccess?.();
          onClose();
        } else {
          toast.error(response?.message || "Failed to update UTR.");
        }
      } catch (err) {
        console.error("UTR update error:", err);
        toast.error("Something went wrong while updating UTR.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) formik.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const inputBase =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2";
  const okBorder = "border-gray-300 focus:ring-primary/40 focus:border-primary";
  const errBorder = "border-red-400 focus:ring-red-200 focus:border-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Update UTR</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <form onSubmit={formik.handleSubmit} className="p-5 space-y-4" noValidate>
          {/* UTR Number */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              UTR Number <span className="text-red-500">*</span>
            </label>
            <input
              name="utr_number"
              type="text"
              value={formik.values.utr_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. 123456789012"
              className={`${inputBase} ${
                formik.touched.utr_number && formik.errors.utr_number
                  ? errBorder
                  : okBorder
              }`}
            />
            {formik.touched.utr_number && formik.errors.utr_number && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.utr_number}</p>
            )}
          </div>

          {/* Disbursement Date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Disbursement Date <span className="text-red-500">*</span>
            </label>
            <input
              name="disbursement_date"
              type="date"
              value={formik.values.disbursement_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputBase} ${
                formik.touched.disbursement_date && formik.errors.disbursement_date
                  ? errBorder
                  : okBorder
              }`}
            />
            {formik.touched.disbursement_date && formik.errors.disbursement_date && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.disbursement_date}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0.00"
              className={`${inputBase} ${
                formik.touched.amount && formik.errors.amount ? errBorder : okBorder
              }`}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.amount}</p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              rows={2}
              value={formik.values.remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputBase} ${okBorder} resize-none`}
              placeholder="Optional"
            />
            {formik.touched.remarks && formik.errors.remarks && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.remarks}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.dirty}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Saving..." : "Save UTR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUtrModal;