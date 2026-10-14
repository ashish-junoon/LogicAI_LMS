import { useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import {
  RiTeamLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";

import { relationList } from "../../content/data";
import { SaveCoBorrower } from "../../api/application";

const GuarantorInformation = ({
  onNext,
  permission ,
  details,
  customerId,
  applicationId,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      guarantor1Name: details?.guarantor_name || "",
      guarantor1Mobile: details?.guarantor_mobile || "",
      guarantor1Relation: details?.guarantor_relation || "",
      guarantor1Pan: details?.guarantor_pan || "",
      guarantor1Aadhaar: details?.guarantor_aahaar_number || "",
      guarantor1Add: details?.guarantor_address || "",

      coborrowerName: details?.co_borrower_name || "",
      coborrowerMobile: details?.co_borrower_mobile || "",
      coborrowerRelation: details?.co_borrower_relation || "",
      coborrowerPan: details?.co_borrower_pan || "",
      coborrowerAadhaar: details?.co_borrower_aahaar_number || "",
      coborrowerAdd: details?.co_borrower_address || "",
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      const resolvedCustomerId = customerId || details?.customer_id;
      const resolvedApplicationId =
        applicationId || details?.application_id;

      if (!resolvedCustomerId || !resolvedApplicationId) {
        toast.error(
          "Customer and application IDs are required to save co-borrower and guarantor details.",
        );
        return;
      }

      const updatedBy =
        localStorage.getItem("username") ||
        localStorage.getItem("userName") ||
        localStorage.getItem("email") ||
        "admin";
      const request = {
        customer_id: resolvedCustomerId,
        application_id: resolvedApplicationId,
        id: details?.id,
        co_borrower_name: values.coborrowerName.trim(),
        co_borrower_mobile: values.coborrowerMobile.trim(),
        co_borrower_relation: values.coborrowerRelation,
        co_borrower_pan: values.coborrowerPan.trim(),
        co_borrower_aahaar_number: values.coborrowerAadhaar.trim(),
        co_borrower_address: values.coborrowerAdd.trim(),
        guarantor_name: values.guarantor1Name.trim(),
        guarantor_mobile: values.guarantor1Mobile.trim(),
        guarantor_relation: values.guarantor1Relation,
        guarantor_pan: values.guarantor1Pan.trim(),
        guarantor_aahaar_number: values.guarantor1Aadhaar.trim(),
        guarantor_address: values.guarantor1Add.trim(),
        created_by: details?.created_by || updatedBy,
        updated_by: updatedBy,
      };

      try {
        const response = await SaveCoBorrower(request);

        if (!response?.status) {
          toast.error(
            response?.message || "Unable to save co-borrower and guarantor details.",
          );
          return;
        }

        formik.resetForm({ values });
        setIsEditing(false);
        toast.success(
          response?.message || "Co-borrower and guarantor details saved successfully.",
        );
        onNext?.();
      } catch (error) {
        console.error("Error saving co-borrower and guarantor details:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message ||
            "Something went wrong while saving co-borrower and guarantor details.",
        );
      }
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-slate-200
          bg-gradient-to-r
          from-primary/10
          via-white
          to-white
          px-4
          py-3
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-3">

          {/* ICON */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-primary/10
              bg-primary/10
            "
          >
            <RiTeamLine className="text-xl text-primary" />
          </div>

          {/* TITLE */}

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Co-Borrower / Guarantor Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Co-borrower and guarantor details
            </p>
          </div>
        </div>

        {/* EDIT */}

        {permission && !isEditing && (
          <Button
            type="button"
            onClick={handleEdit}
            btnName={
              <span className="flex items-center gap-1.5">
                <RiEditLine size={15} />
                Edit
              </span>
            }
            style="
              !w-auto
              px-3
              py-1.5
              bg-white
              border
              border-primary
              text-primary
              hover:bg-primary
              hover:text-white
              text-xs
              font-medium
              rounded-lg
            "
          />
        )}
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}

      <form onSubmit={formik.handleSubmit}>
        <div className="p-4">

          {/* =================================================
              CO-BORROWER
          ================================================== */}

          <div className="mb-6">

            {/* SECTION HEADER */}

            <div
              className="
                mb-4
                flex
                items-center
                gap-2
                border-b
                border-slate-200
                pb-2
              "
            >
              <div
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-primary
                "
              />

              <h4 className="text-xs font-semibold text-slate-700">
                Co-Borrower
              </h4>
            </div>

            {/* FIELDS */}

            <div
              className="
                grid
                grid-cols-3
                gap-x-4
                gap-y-4
                max-lg:grid-cols-2
                max-sm:grid-cols-1
              "
            >

              {/* NAME */}

              <div>
                <TextInput
                  label="Name"
                  name="coborrowerName"
                  value={formik.values.coborrowerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.coborrowerName &&
                    formik.errors.coborrowerName
                  }
                />
              </div>

              {/* MOBILE */}

              <div>
                <TextInput
                  label="Mobile Number"
                  name="coborrowerMobile"
                  value={formik.values.coborrowerMobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={10}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.coborrowerMobile &&
                    formik.errors.coborrowerMobile
                  }
                />
              </div>

              {/* RELATION */}

              <div>
                <SelectInput
                  label="Relation"
                  name="coborrowerRelation"
                  placeholder="Select Relation"
                  value={formik.values.coborrowerRelation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={relationList}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.coborrowerRelation &&
                    formik.errors.coborrowerRelation
                  }
                />
              </div>

              {/* PAN */}

              <div>
                <TextInput
                  label="PAN Number"
                  name="coborrowerPan"
                  value={formik.values.coborrowerPan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={10}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.coborrowerPan &&
                    formik.errors.coborrowerPan
                  }
                />
              </div>

              {/* AADHAAR */}

              <div>
                <TextInput
                  label="Aadhaar Number"
                  name="coborrowerAadhaar"
                  value={formik.values.coborrowerAadhaar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={12}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.coborrowerAadhaar &&
                    formik.errors.coborrowerAadhaar
                  }
                />
              </div>

              {/* ADDRESS */}

              <div>
                <TextInput
                  label="Address"
                  name="coborrowerAdd"
                  value={formik.values.coborrowerAdd}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.coborrowerAdd &&
                    formik.errors.coborrowerAdd
                  }
                />
              </div>
            </div>
          </div>

          {/* =================================================
              GUARANTOR
          ================================================== */}

          <div>

            {/* SECTION HEADER */}

            <div
              className="
                mb-4
                flex
                items-center
                gap-2
                border-b
                border-slate-200
                pb-2
              "
            >
              <div
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-primary
                "
              />

              <h4 className="text-xs font-semibold text-slate-700">
                Guarantor
              </h4>
            </div>

            {/* FIELDS */}

            <div
              className="
                grid
                grid-cols-3
                gap-x-4
                gap-y-4
                max-lg:grid-cols-2
                max-sm:grid-cols-1
              "
            >

              {/* NAME */}

              <div>
                <TextInput
                  label="Name"
                  name="guarantor1Name"
                  value={formik.values.guarantor1Name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.guarantor1Name &&
                    formik.errors.guarantor1Name
                  }
                />
              </div>

              {/* MOBILE */}

              <div>
                <TextInput
                  label="Mobile Number"
                  name="guarantor1Mobile"
                  value={formik.values.guarantor1Mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={10}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.guarantor1Mobile &&
                    formik.errors.guarantor1Mobile
                  }
                />
              </div>

              {/* RELATION */}

              <div>
                <SelectInput
                  label="Relation"
                  name="guarantor1Relation"
                  placeholder="Select Relation"
                  value={formik.values.guarantor1Relation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={relationList}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.guarantor1Relation &&
                    formik.errors.guarantor1Relation
                  }
                />
              </div>

              {/* PAN */}

              <div>
                <TextInput
                  label="PAN Number"
                  name="guarantor1Pan"
                  value={formik.values.guarantor1Pan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={10}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.guarantor1Pan &&
                    formik.errors.guarantor1Pan
                  }
                />
              </div>

              {/* AADHAAR */}

              <div>
                <TextInput
                  label="Aadhaar Number"
                  name="guarantor1Aadhaar"
                  value={formik.values.guarantor1Aadhaar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={12}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.guarantor1Aadhaar &&
                    formik.errors.guarantor1Aadhaar
                  }
                />
              </div>

              {/* ADDRESS */}

              <div>
                <TextInput
                  label="Address"
                  name="guarantor1Add"
                  value={formik.values.guarantor1Add}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />

                <ErrorMsg
                  error={
                    formik.touched.guarantor1Add &&
                    formik.errors.guarantor1Add
                  }
                />
              </div>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================== */}

          {permission && isEditing && (
            <div
              className="
                mt-5
                flex
                items-center
                justify-end
                gap-2
                border-t
                border-slate-100
                pt-4
              "
            >

              {/* CANCEL */}

              <Button
                type="button"
                onClick={handleCancel}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCloseLine size={16} />
                    Cancel
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-white
                  border
                  border-slate-300
                  text-slate-600
                  hover:bg-slate-50
                  text-xs
                  font-medium
                  rounded-lg
                "
              />

              {/* SAVE */}

              <Button
                type="submit"
                disabled={formik.isSubmitting}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCheckLine size={16} />
                    Save & Continue
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-primary
                  hover:bg-primary
                  text-white
                  text-xs
                  font-medium
                  rounded-lg
                "
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuarantorInformation;