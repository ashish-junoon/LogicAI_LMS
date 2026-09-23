import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  RiBuilding4Line,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";

import { sector, employmentType } from "../../content/data";

const EmploymentInformation = ({
  onNext,
  permission ,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      companyName: "ABC Corporation",
      sector: "other",
      employmentType: "salaried",
      employmentSince: "2020-06-01",
      monthlySalary: "75000",
      salaryDate: "2026-08-05",
      salarySlip: null,
    },

    // validationSchema: Yup.object({
    //   companyName: Yup.string()
    //     .required("Company name is required"),
    //
    //   sector: Yup.string()
    //     .required("Sector is required"),
    //
    //   employmentType: Yup.string()
    //     .required("Employment type is required"),
    //
    //   employmentSince: Yup.date()
    //     .required("Employment since is required"),
    //
    //   monthlySalary: Yup.number()
    //     .required("Monthly salary is required"),
    //
    //   salaryDate: Yup.date()
    //     .required("Salary date is required"),
    //
    //   salarySlip: Yup.mixed()
    //     .nullable(),
    // }),

    onSubmit: async (values) => {
      console.log("Employment Information:", values);

      // API call here

      setIsEditing(false);

      onNext?.();
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
            <RiBuilding4Line className="text-xl text-primary" />
          </div>

          {/* TITLE */}

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Employment Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Employment and income details
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
              EMPLOYMENT DETAILS
          ================================================== */}

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

            {/* COMPANY NAME */}

            <div>
              <TextInput
                label="Company Name"
                name="companyName"
                placeholder="Enter company name"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.companyName &&
                  formik.errors.companyName
                }
              />
            </div>

            {/* SECTOR */}

            <div>
              <SelectInput
                label="Sector"
                name="sector"
                options={sector}
                placeholder="Select sector"
                value={formik.values.sector}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.sector &&
                  formik.errors.sector
                }
              />
            </div>

            {/* EMPLOYMENT TYPE */}

            <div>
              <SelectInput
                label="Employment Type"
                name="employmentType"
                options={employmentType}
                placeholder="Select employment type"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.employmentType &&
                  formik.errors.employmentType
                }
              />
            </div>

            {/* EMPLOYMENT SINCE */}

            <div>
              <DateInput
                label="Employment Since"
                name="employmentSince"
                value={formik.values.employmentSince}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.employmentSince &&
                  formik.errors.employmentSince
                }
              />
            </div>

            {/* MONTHLY SALARY */}

            <div>
              <TextInput
                label="Monthly Salary"
                name="monthlySalary"
                placeholder="Enter monthly salary"
                value={formik.values.monthlySalary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.monthlySalary &&
                  formik.errors.monthlySalary
                }
              />
            </div>

            {/* SALARY DATE */}

            <div>
              <DateInput
                label="Salary Date"
                name="salaryDate"
                value={formik.values.salaryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.salaryDate &&
                  formik.errors.salaryDate
                }
              />
            </div>

            {/* SALARY SLIP */}

            <div className="max-lg:col-span-2 max-sm:col-span-1">

              <UploadInput
                label="Salary Slip"
                name="salarySlip"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) =>
                  formik.setFieldValue(
                    "salarySlip",
                    e.target.files?.[0] || null
                  )
                }
                disabled={!isEditing}
              />

              <ErrorMsg
                error={
                  formik.touched.salarySlip &&
                  formik.errors.salarySlip
                }
              />
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

export default EmploymentInformation;