import React, { useState } from "react";
import { RiBankLine, RiAddLine, RiDeleteBinLine, RiEditLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectInput from "../fields/SelectInput";
import { bankList } from "../../content/data";

const MultipleBankInfo = ({ onNext, open, onToggle, step }) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(true); //false
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      bankName: step === "prepd" ? "State Bank of India" : "",
      ifscCode: step === "prepd" ? "XXXXXX" : "",
      accountNumber: step === "prepd" ? "XXXXXX" : "",
      accountHolderName: step === "prepd" ? "Rajesh Kumar" : "",
      bankDocument: step === "prepd" ? null : null,
    },

    validationSchema: Yup.object({
      //   bankName: Yup.string().required("Bank name is required"),
      //   ifscCode: Yup.string()
      //     .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code")
      //     .required("IFSC Code is required"),
      //   accountNumber: Yup.string()
      //     .matches(/^[0-9]{9,18}$/, "Invalid Account Number")
      //     .required("Account Number is required"),
      //   accountHolderName: Yup.string()
      //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
      //     .required("Account Holder Name is required"),


      //   bankDocument: Yup.mixed().required("Bank document is required"),
    }),

    onSubmit: (values) => {
      if (editingIndex !== null) {
        // Update existing bank account
        const updatedAccounts = [...bankAccounts];
        updatedAccounts[editingIndex] = { ...values, id: Date.now() };
        setBankAccounts(updatedAccounts);
        setEditingIndex(null);
      } else {
        // Add new bank account
        setBankAccounts([...bankAccounts, { ...values, id: Date.now() }]);
      }

      // Reset form
      formik.resetForm();
      setIsAdding(false);
    },
  });

  const handleEdit = (index) => {
    const account = bankAccounts[index];
    formik.setValues({
      bankName: account.bankName,
      ifscCode: account.ifscCode,
      accountNumber: account.accountNumber,
      accountHolderName: account.accountHolderName,
      bankDocument: account.bankDocument,
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDelete = (index) => {
    const updatedAccounts = bankAccounts.filter((_, i) => i !== index);
    setBankAccounts(updatedAccounts);
    if (editingIndex === index) {
      setEditingIndex(null);
      formik.resetForm();
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleContinue = () => {
    if (bankAccounts.length === 0) {
      alert("Please add at least one bank account");
      return;
    }
    console.log("All Bank Accounts:", bankAccounts);
          onNext();
setIsEditing(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Bank Details"
        subtitle="Customer bank account information"
        icon={RiBankLine}
        onToggle={onToggle}
        open={open}
      >
        {/* Display existing bank accounts */}
        {bankAccounts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Added Bank Accounts ({bankAccounts.length})
            </h4>
            <div className="space-y-3">
              {bankAccounts.map((account, index) => (
                <div
                  key={account.id || index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Bank Name</p>
                      <p className="text-sm font-medium text-gray-800">
                        {account.bankName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Number</p>
                      <p className="text-sm font-medium text-gray-800">
                        {account.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IFSC Code</p>
                      <p className="text-sm font-medium text-gray-800">
                        {account.ifscCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Holder</p>
                      <p className="text-sm font-medium text-gray-800">
                        {account.accountHolderName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Document</p>
                      <a href="" className="text-xs font-medium text-primary">
                        Download Report
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <RiEditLine size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Bank Account Form */}
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <RiAddLine size={20} />
            <span>Add Bank Account</span>
          </button>
        ) : (
          <div className="mb-6 p-4 shadow-md rounded-lg bg-blue-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              {editingIndex !== null ? "Edit Bank Account" : "Add New Bank Account"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3 lg:gap-2">
              {/* Bank Name */}
              <div>
                <SelectInput
                  label="Bank Name"
                  name="bankName"
                  options={bankList}
                  placeholder="Select Bank"
                  value={formik.values.bankName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={step && !isEditing}
                />
                <ErrorMsg
                  error={formik.touched.bankName && formik.errors.bankName}
                />
              </div>

              {/* IFSC Code */}
              <div>
                <TextInput
                  label="IFSC Code"
                  name="ifscCode"
                  value={formik.values.ifscCode}
                  onChange={step === "prepd" ? (e) => {
                    if (e.target.value.length < 6) return;
                    formik.setFieldValue('ifscCode', e.target.value)
                  } : formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <ErrorMsg
                  error={formik.touched.ifscCode && formik.errors.ifscCode}
                />
              </div>

              {/* Account Number */}
              <div>
                <TextInput
                  label="Account Number"
                  name="accountNumber"
                  value={formik.values.accountNumber}
                  onChange={step === "prepd" ? (e) => {
                    if (e.target.value.length < 6) return;
                    formik.setFieldValue('accountNumber', e.target.value)
                  } : formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <ErrorMsg
                  error={
                    formik.touched.accountNumber && formik.errors.accountNumber
                  }
                />
              </div>

              {/* Account Holder Name */}
              <div>
                <TextInput
                  label="Account Holder Name"
                  name="accountHolderName"
                  value={formik.values.accountHolderName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={step && !isEditing}
                />
                <ErrorMsg
                  error={
                    formik.touched.accountHolderName &&
                    formik.errors.accountHolderName
                  }
                />
              </div>

              {/* Cancelled Cheque / Passbook */}
              <div className="sm:col-span-2 lg:col-span-4">
                <UploadInput
                  label="Upload Bank Statement / Passbook"
                  name="bankDocument"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) =>
                    formik.setFieldValue("bankDocument", e.target.files[0])
                  }
                  disabled={step && !isEditing}
                />
                <ErrorMsg
                  error={formik.touched.bankDocument && formik.errors.bankDocument}
                />
              </div>
            </div>

            {/* Form Actions */}
            {!step && <div className="flex gap-3 mt-4">
              <Button
                type="submit"
                btnName={editingIndex !== null ? "Update Account" : "Add Account"}
                style="bg-primary hover:bg-primary text-white"
              />
              <Button
                type="button"
                btnName="Cancel"
                style="bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={handleCancel}
              />
            </div>}
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end mt-6 gap-3">
          {step === "prepd" && !isEditing &&
              <Button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                btnName={isEditing ? "Save" : "Edit Bank"}
                style="bg-primary hover:bg-primary text-white w-full sm:w-auto"
              />
            }
            {(!step || isEditing) &&
              <Button
                type="submit"
                btnName="Save & Continue"
                style="bg-primary text-white hover:bg-primary cursor-pointer w-full sm:w-auto"
                onClick={handleContinue}
              />}
        </div>
      </Accordion>
    </form>
  );
};

export default MultipleBankInfo;