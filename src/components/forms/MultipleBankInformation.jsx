import React, { useState } from "react";
import {
  RiBankLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiFileTextLine,
  RiArrowRightLine,
} from "react-icons/ri";

import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import SelectInput from "../fields/SelectInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";

import { useFormik } from "formik";
import * as Yup from "yup";

import { bankList } from "../../content/data";

const MultipleBankInformation = ({
  onNext,
  permission,
  step,
}) => {
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      bankName: "State Bank of India",
      ifscCode: "SBIN00002",
      accountNumber: "320895544887",
      accountHolderName: "Rajesh Kumar",
      bankDocument: null,
    },
    {
      id: 2,
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      accountNumber: "50100234567890",
      accountHolderName: "Rajesh Kumar",
      bankDocument: null,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const formik = useFormik({
    initialValues: {
      bankName: "",
      ifscCode: "",
      accountNumber: "",
      accountHolderName: "",
      bankDocument: null,
    },

    validationSchema: Yup.object({
      bankName: Yup.string()
        .required("Bank name is required"),

      ifscCode: Yup.string()
        .trim()
        .uppercase()
        .matches(
          /^[A-Z]{4}0[A-Z0-9]{6}$/,
          "Invalid IFSC Code"
        )
        .required("IFSC Code is required"),

      accountNumber: Yup.string()
        .matches(
          /^[0-9]{9,18}$/,
          "Invalid Account Number"
        )
        .required("Account Number is required"),

      accountHolderName: Yup.string()
        .matches(
          /^[A-Za-z ]+$/,
          "Only alphabets are allowed"
        )
        .required("Account Holder Name is required"),

      bankDocument: Yup.mixed()
        .nullable()
        .test(
          "fileSize",
          "File must be less than 10MB",
          (file) =>
            !file ||
            file.size <= 10 * 1024 * 1024
        )
        .test(
          "fileType",
          "Only JPG, PNG and PDF files are allowed",
          (file) =>
            !file ||
            [
              "image/jpeg",
              "image/png",
              "application/pdf",
            ].includes(file.type)
        ),
    }),

    onSubmit: (values) => {
      if (editingIndex === null) return;

      setBankAccounts((prev) =>
        prev.map((account, index) =>
          index === editingIndex
            ? {
                ...values,
                id: account.id,
              }
            : account
        )
      );

      formik.resetForm();
      setEditingIndex(null);
    },
  });

  // =========================================================
  // OPEN EDIT MODE
  // =========================================================

  const handleMainEdit = () => {
    setIsEditing(true);
    setEditingIndex(null);
  };

  // =========================================================
  // EDIT PARTICULAR BANK
  // =========================================================

  const handleEdit = (index) => {
    const account = bankAccounts[index];

    formik.setValues({
      bankName: account.bankName || "",
      ifscCode: account.ifscCode || "",
      accountNumber: account.accountNumber || "",
      accountHolderName:
        account.accountHolderName || "",
      bankDocument:
        account.bankDocument || null,
    });

    setEditingIndex(index);
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    formik.resetForm();
    setEditingIndex(null);
    setIsEditing(false);
  };

  // =========================================================
  // CANCEL PARTICULAR EDIT
  // =========================================================

  const handleCancelEdit = () => {
    formik.resetForm();
    setEditingIndex(null);
  };

  // =========================================================
  // SAVE & CONTINUE
  // =========================================================

  const handleContinue = () => {
    if (bankAccounts.length === 0) {
      alert("No bank account information available");
      return;
    }

    console.log(
      "All Bank Accounts:",
      bankAccounts
    );

    setIsEditing(false);
    setEditingIndex(null);

    onNext?.(bankAccounts);
  };

  return (
    <div
      className="
        w-full
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
            <RiBankLine className="text-xl text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Bank Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Customer bank account information
            </p>
          </div>

        </div>

        {/* EDIT MAIN */}

        {permission && !isEditing && (
          <Button
            type="button"
            onClick={handleMainEdit}
            btnName={
              <span className="flex items-center gap-1.5">
                <RiEditLine size={15} />
                Edit Bank
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
          CONTENT
      ====================================================== */}

      <div className="p-4">

        {/* ===================================================
            VIEW MODE
        ==================================================== */}

        {!isEditing && (
          <>
            {bankAccounts.length > 0 ? (
              <div className="space-y-3">

                {/* SUMMARY */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50/70
                    px-3
                    py-2.5
                  "
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Bank Accounts
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {bankAccounts.length} account
                      {bankAccounts.length > 1
                        ? "s"
                        : ""}{" "}
                      available
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-primary/10
                      px-2
                      text-xs
                      font-semibold
                      text-primary
                    "
                  >
                    {bankAccounts.length}
                  </div>
                </div>

                {/* BANK CARDS */}

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

                  {bankAccounts.map(
                    (account, index) => (
                      <div
                        key={
                          account.id || index
                        }
                        className="
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          p-4
                          transition
                          hover:border-primary/30
                          hover:shadow-sm
                        "
                      >

                        {/* CARD HEADER */}

                        <div
                          className="
                            mb-4
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-primary/10
                                text-primary
                              "
                            >
                              <RiBankLine
                                size={18}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] text-slate-400">
                                Bank Name
                              </p>

                              <p className="truncate text-sm font-semibold text-slate-800">
                                {account.bankName ||
                                  "-"}
                              </p>
                            </div>

                          </div>

                          {/* EDIT ICON */}

                          {permission && (
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(index)
                              }
                              className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-md
                                border
                                border-slate-200
                                bg-white
                                text-primary
                                transition
                                hover:border-primary
                                hover:bg-primary/10
                              "
                              title="Edit Bank Account"
                            >
                              <RiEditLine
                                size={15}
                              />
                            </button>
                          )}

                        </div>

                        {/* DETAILS */}

                        <div
                          className="
                            grid
                            grid-cols-2
                            gap-x-5
                            gap-y-4
                          "
                        >

                          <div>
                            <p className="mb-1 text-[10px] text-slate-400">
                              Account Number
                            </p>

                            <p className="text-xs font-semibold tracking-wide text-slate-700">
                              {account.accountNumber ||
                                "-"}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 text-[10px] text-slate-400">
                              IFSC Code
                            </p>

                            <p className="text-xs font-semibold text-slate-700">
                              {account.ifscCode ||
                                "-"}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <p className="mb-1 text-[10px] text-slate-400">
                              Account Holder Name
                            </p>

                            <p className="truncate text-xs font-semibold text-slate-700">
                              {account.accountHolderName ||
                                "-"}
                            </p>
                          </div>

                        </div>

                        {/* DOCUMENT */}

                        {account.bankDocument && (
                          <div
                            className="
                              mt-4
                              flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-slate-200
                              bg-slate-50
                              px-3
                              py-2
                            "
                          >
                            <RiFileTextLine
                              size={15}
                              className="shrink-0 text-primary"
                            />

                            <span className="truncate text-[10px] font-medium text-slate-600">
                              {account.bankDocument
                                .name ||
                                "Bank Document"}
                            </span>
                          </div>
                        )}

                      </div>
                    )
                  )}

                </div>
              </div>
            ) : (
              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50/50
                  px-4
                  py-10
                  text-center
                "
              >
                <RiBankLine
                  size={28}
                  className="mx-auto mb-2 text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-600">
                  No Bank Information Available
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Bank account information has not
                  been added yet.
                </p>
              </div>
            )}
          </>
        )}

        {/* ===================================================
            EDIT MODE
        ==================================================== */}

        {isEditing && (
          <>

            {/* EDIT MODE INFO */}

            <div
              className="
                mb-4
                flex
                items-center
                justify-between
                rounded-lg
                border
                border-primary/10
                bg-primary/5
                px-4
                py-3
              "
            >
              <div>
                <h4 className="text-xs font-semibold text-slate-700">
                  Edit Bank Information
                </h4>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Select the bank account you want
                  to update
                </p>
              </div>

              <span
                className="
                  rounded-full
                  bg-white
                  px-2.5
                  py-1
                  text-[10px]
                  font-medium
                  text-primary
                "
              >
                {bankAccounts.length} Account
                {bankAccounts.length > 1
                  ? "s"
                  : ""}
              </span>
            </div>

            {/* ACCOUNT LIST */}

            <div className="mb-5 space-y-2">

              {bankAccounts.map(
                (account, index) => (
                  <div
                    key={
                      account.id || index
                    }
                    className={`
                      flex
                      flex-col
                      gap-3
                      rounded-lg
                      border
                      p-3
                      transition
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      ${
                        editingIndex === index
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 bg-slate-50/70"
                      }
                    `}
                  >

                    <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">

                      <div>
                        <p className="text-[10px] text-slate-400">
                          Bank Name
                        </p>

                        <p className="truncate text-xs font-semibold text-slate-700">
                          {account.bankName ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">
                          Account Number
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                          {account.accountNumber ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">
                          IFSC Code
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                          {account.ifscCode ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">
                          Account Holder
                        </p>

                        <p className="truncate text-xs font-semibold text-slate-700">
                          {account.accountHolderName ||
                            "-"}
                        </p>
                      </div>

                    </div>

                    {/* ONLY EDIT */}

                    {permission && (
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(index)
                        }
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          text-primary
                          transition
                          hover:bg-primary/10
                        "
                        title="Edit"
                      >
                        <RiEditLine size={16} />
                      </button>
                    )}

                  </div>
                )
              )}

            </div>

            {/* =================================================
                FORM ONLY AFTER EDIT ICON
            ================================================== */}

            {editingIndex !== null && (
              <form onSubmit={formik.handleSubmit}>

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50/50
                    p-4
                  "
                >

                  {/* FORM TITLE */}

                  <div className="mb-4 flex items-center gap-2">

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                      "
                    >
                      <RiEditLine size={15} />
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-700">
                        Edit Bank Account
                      </h4>

                      <p className="text-[10px] text-slate-400">
                        Update selected bank account
                        details
                      </p>
                    </div>

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

                    {/* BANK NAME */}

                    <div>
                      <SelectInput
                        label="Bank Name"
                        name="bankName"
                        options={bankList}
                        placeholder="Select Bank"
                        value={
                          formik.values.bankName
                        }
                        onChange={
                          formik.handleChange
                        }
                        onBlur={
                          formik.handleBlur
                        }
                        disabled={
                          step && !isEditing
                        }
                      />

                      <ErrorMsg
                        error={
                          formik.touched.bankName &&
                          formik.errors.bankName
                        }
                      />
                    </div>

                    {/* IFSC */}

                    <div>
                      <TextInput
                        label="IFSC Code"
                        name="ifscCode"
                        value={
                          formik.values.ifscCode
                        }
                        maxLength={11}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "ifscCode",
                            e.target.value.toUpperCase()
                          )
                        }
                        onBlur={
                          formik.handleBlur
                        }
                        disabled={
                          step && !isEditing
                        }
                      />

                      <ErrorMsg
                        error={
                          formik.touched.ifscCode &&
                          formik.errors.ifscCode
                        }
                      />
                    </div>

                    {/* ACCOUNT NUMBER */}

                    <div>
                      <TextInput
                        label="Account Number"
                        name="accountNumber"
                        value={
                          formik.values.accountNumber
                        }
                        maxLength={18}
                        onChange={
                          formik.handleChange
                        }
                        onBlur={
                          formik.handleBlur
                        }
                        disabled={
                          step && !isEditing
                        }
                      />

                      <ErrorMsg
                        error={
                          formik.touched.accountNumber &&
                          formik.errors.accountNumber
                        }
                      />
                    </div>

                    {/* ACCOUNT HOLDER */}

                    <div>
                      <TextInput
                        label="Account Holder Name"
                        name="accountHolderName"
                        value={
                          formik.values
                            .accountHolderName
                        }
                        onChange={
                          formik.handleChange
                        }
                        onBlur={
                          formik.handleBlur
                        }
                        disabled={
                          step && !isEditing
                        }
                      />

                      <ErrorMsg
                        error={
                          formik.touched
                            .accountHolderName &&
                          formik.errors
                            .accountHolderName
                        }
                      />
                    </div>

                    {/* DOCUMENT */}

                    <div className="sm:col-span-2">

                      <UploadInput
                        label="Upload Bank Statement / Passbook"
                        name="bankDocument"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0] ||
                            null;

                          formik.setFieldValue(
                            "bankDocument",
                            file
                          );
                        }}
                        disabled={
                          step && !isEditing
                        }
                      />

                      <ErrorMsg
                        error={
                          formik.touched
                            .bankDocument &&
                          formik.errors
                            .bankDocument
                        }
                      />

                    </div>

                  </div>

                  {/* FORM ACTIONS */}

                  <div
                    className="
                      mt-5
                      flex
                      justify-end
                      gap-2
                      border-t
                      border-slate-200
                      pt-4
                    "
                  >

                    <Button
                      type="button"
                      onClick={
                        handleCancelEdit
                      }
                      btnName={
                        <span className="flex items-center gap-1.5">
                          <RiCloseLine
                            size={15}
                          />
                          Cancel
                        </span>
                      }
                      style="
                        !w-auto
                        px-3
                        py-1.5
                        bg-white
                        border border-slate-300
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
                          <RiCheckLine
                            size={15}
                          />
                          Update Account
                        </span>
                      }
                      style="
                        !w-auto
                        px-3
                        py-1.5
                        bg-primary
                        text-white
                        text-xs
                        font-medium
                        rounded-lg
                      "
                    />

                  </div>
                </div>
              </form>
            )}

            {/* =================================================
                MAIN ACTIONS
            ================================================== */}

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
                  border border-slate-300
                  text-slate-600
                  hover:bg-slate-50
                  text-xs
                  font-medium
                  rounded-lg
                "
              />

              <Button
                type="button"
                onClick={handleContinue}
                btnName={
                  <span className="flex items-center gap-1.5">
                    Save & Continue
                    <RiArrowRightLine
                      size={16}
                    />
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-primary
                  text-white
                  text-xs
                  font-medium
                  rounded-lg
                "
              />

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default MultipleBankInformation;