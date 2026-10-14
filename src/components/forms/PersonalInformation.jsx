import { useFormik } from "formik";
import {
  RiUser3Line,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import ErrorMsg from "../utils/ErrorMsg";

import { gender, meritalStatus, religion } from "../../content/data";
import { SaveMarketSurvey } from "../../api/application";

const PersonalInformation = ({ permission, marketSurvey, personalKyc }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      customerName: marketSurvey?.business_owner_name || personalKyc?.full_name || "",
      fathername: personalKyc?.father_name || "",
      dob: personalKyc?.dob || "",
      mobile: marketSurvey?.business_owner_mobile_no || personalKyc?.alternate_mobile || "",
      email: marketSurvey?.contact_person_email || personalKyc?.email_id || "",
      religion: "",
      maritalStatus: personalKyc?.marital_status || "",
      gender: personalKyc?.gender || "",
    },

    enableReinitialize: true,

    // validationSchema: Yup.object({
    //   customerName: Yup.string()
    //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
    //     .required("Customer name is required"),
    //   fathername: Yup.string()
    //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
    //     .required("Father name is required"),
    //   dob: Yup.string().required("DOB is required"),
    //   mobile: Yup.string()
    //     .matches(/^[6-9]\d{9}$/, "Enter valid mobile number")
    //     .required("Mobile number is required"),
    //   email: Yup.string()
    //     .email("Invalid email")
    //     .required("Email is required"),
    //   religion: Yup.string().required("Religion is required"),
    //   maritalStatus: Yup.string().required("Marital status is required"),
    //   gender: Yup.string().required("Gender is required"),
    // }),

    onSubmit: async (values) => {
      if (!marketSurvey?.customer_id) {
        toast.error("Customer ID is missing. Customer details cannot be saved.");
        return;
      }

      const updatedBy =
        localStorage.getItem("username") ||
        localStorage.getItem("userName") ||
        localStorage.getItem("email") ||
        "admin";
      const request = {
        customer_id: marketSurvey?.customer_id || "",
        business_name: marketSurvey?.business_name || "",
        business_type: marketSurvey?.business_type || "",
        business_trade: marketSurvey?.business_trade || "",
        lead_source: marketSurvey?.lead_source || "",
        market_locality: marketSurvey?.market_locality || "",
        business_owner_name: values.customerName.trim(),
        business_owner_mobile_no: values.mobile.trim(),
        business_owner_uid: marketSurvey?.business_owner_uid || "",
        contact_person_email: values.email.trim(),
        contact_person_mobile_no: marketSurvey?.contact_person_mobile_no || "",
        address: marketSurvey?.address || "",
        pin_code: marketSurvey?.pin_code || "",
        state: marketSurvey?.state || "",
        latitude:
          marketSurvey?.latitude == null ? "" : String(marketSurvey.latitude),
        longitude:
          marketSurvey?.longitude == null ? "" : String(marketSurvey.longitude),
        lat_long_address: marketSurvey?.lat_long_address || "",
        interested_for_loan: marketSurvey?.interested_for_loan ?? false,
        next_meeting_date: null,
        loan_amount: marketSurvey?.loan_amount ?? 0,
        market_survey_observations:
          marketSurvey?.market_survey_observations || "",
        created_by: marketSurvey?.created_by || updatedBy,
        updated_by: updatedBy,
        company_id: marketSurvey?.company_id || "",
        product_name: marketSurvey?.product_name || "",
        business_photo: null,
      };

      try {
        const response = await SaveMarketSurvey(request);

        if (!response?.status) {
          toast.error(response?.message || "Unable to save customer details.");
          return;
        }

        formik.resetForm({ values });
        setIsEditing(false);
        toast.success(response?.message || "Customer details saved successfully.");
      } catch (error) {
        console.error("Error saving market survey details:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message ||
            "Something went wrong while saving customer details.",
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
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex items-center justify-between
          border-b border-slate-200
          bg-gradient-to-r from-primary/10 via-white to-white
          px-4 py-3
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              border border-primary/10
              bg-primary/10
            "
          >
            <RiUser3Line className="text-xl text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Customer Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Basic customer details
            </p>
          </div>
        </div>

        {/* RIGHT */}
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
          <div
            className="
              grid
              grid-cols-4
              gap-x-4
              gap-y-3
              max-xl:grid-cols-2
              max-sm:grid-cols-1
            "
          >
            {/* Customer Name */}

            <div>
              <TextInput
                label="Customer Name"
                name="customerName"
                value={formik.values.customerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.customerName && formik.errors.customerName
                }
              />
            </div>

            {/* Father Name */}
            <div>
              <TextInput
                label="Father Name"
                name="fathername"
                value={formik.values.fathername}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={formik.touched.fathername && formik.errors.fathername}
              />
            </div>

            {/* DOB */}
            <div>
              <DateInput
                label="Date of Birth"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg error={formik.touched.dob && formik.errors.dob} />
            </div>

            {/* Mobile */}
            <div>
              <TextInput
                label="Mobile Number"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={10}
                disabled={!isEditing}
              />

              <ErrorMsg error={formik.touched.mobile && formik.errors.mobile} />
            </div>

            {/* Email */}
            <div>
              <TextInput
                label="Email Address"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg error={formik.touched.email && formik.errors.email} />
            </div>

            {/* Religion */}
            <div>
              <SelectInput
                label="Religion"
                name="religion"
                options={religion}
                placeholder="Select Religion"
                value={formik.values.religion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={formik.touched.religion && formik.errors.religion}
              />
            </div>

            {/* Marital Status */}
            <div>
              <SelectInput
                label="Marital Status"
                name="maritalStatus"
                options={meritalStatus}
                placeholder="Select Marital Status"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.maritalStatus && formik.errors.maritalStatus
                }
              />
            </div>

            {/* Gender */}
            {/* {loanDetails?.gender &&  */}
            <div>
              <SelectInput
                label="Gender"
                name="gender"
                options={gender}
                placeholder="Select Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg error={formik.touched.gender && formik.errors.gender} />
            </div>
            {/* } */}
          </div>

          {/* =================================================
              EDIT ACTIONS
          ================================================== */}
          {permission && isEditing && (
            <div
              className="
                mt-5
                flex items-center justify-end gap-2
                border-t border-slate-100
                pt-4
              "
            >
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

              <Button
                type="submit"
                disabled={formik.isSubmitting}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCheckLine size={16} />
                    Save Changes
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

export default PersonalInformation;
