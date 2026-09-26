import { useFormik } from "formik";
import * as Yup from "yup";
import {
  RiUser3Line,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { useState } from "react";

import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import ErrorMsg from "../utils/ErrorMsg";

import { gender, meritalStatus, religion } from "../../content/data";
import { useLoanDetails } from "../../provider/loanContext";

const PersonalInformation = ({ permission }) => {
  const { loanDetails } = useLoanDetails();
  const [isEditing, setIsEditing] = useState(false);

  console.log("loandetails------", loanDetails);

  const formik = useFormik({
    initialValues: {
      customerName: loanDetails?.customer_name || "N/A",
      fathername: "",
      dob: loanDetails?.dob,
      mobile: loanDetails?.mobile_number,
      email: "",
      religion: "",
      maritalStatus: "",
      gender: loanDetails?.gender,
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
      console.log(values);

      // API call here

      setIsEditing(false);
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
