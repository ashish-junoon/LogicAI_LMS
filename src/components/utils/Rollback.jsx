import React from "react";
import { RiArrowGoBackLine, RiInformationLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";

const Rollback = ({
  availableSteps = [],
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const formik = useFormik({
    initialValues: {
      rollbackStep: "",
      remarks: "",
    },

    validationSchema: Yup.object({
      rollbackStep: Yup.string().required(
        "Please select rollback step"
      ),

      remarks: Yup.string()
        .trim()
        .required("Remarks are required")
        .min(5, "Remarks must be at least 5 characters"),
    }),

    onSubmit: async (values) => {
      await onSubmit?.(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Info */}
      <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
        <RiInformationLine
          size={20}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="text-sm font-medium text-blue-800">
            Rollback Application
          </p>

          <p className="mt-0.5 text-xs text-blue-600">
            Select the step where you want to move this application
            back. The subsequent steps will need to be completed
            again.
          </p>
        </div>
      </div>

      {/* Rollback Steps */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Rollback To <span className="text-red-500">*</span>
        </label>

        {availableSteps?.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {availableSteps?.map((step) => {
              const selected =
                formik.values.rollbackStep === step.value;

              return (
                <button
                  key={step.value}
                  type="button"
                  onClick={() =>
                    formik.setFieldValue(
                      "rollbackStep",
                      step.value
                    )
                  }
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <RiArrowGoBackLine size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {step.label}
                    </p>

                    {step.description && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
            No rollback steps are available for this application.
          </div>
        )}

        {formik.touched.rollbackStep &&
          formik.errors.rollbackStep && (
            <p className="mt-1.5 text-xs text-red-500">
              {formik.errors.rollbackStep}
            </p>
          )}
      </div>

      {/* Remarks */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Remarks <span className="text-red-500">*</span>
        </label>

        <textarea
          name="remarks"
          rows={4}
          placeholder="Enter reason for rollback..."
          value={formik.values.remarks}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary ${
            formik.touched.remarks && formik.errors.remarks
              ? "border-red-400"
              : "border-gray-200"
          }`}
        />

        {formik.touched.remarks && formik.errors.remarks && (
          <p className="mt-1.5 text-xs text-red-500">
            {formik.errors.remarks}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || availableSteps?.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RiArrowGoBackLine size={17} />

          {loading ? "Rolling Back..." : "Confirm Rollback"}
        </button>
      </div>
    </form>
  );
};

export default Rollback;