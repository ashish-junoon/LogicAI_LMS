import React, { useEffect, useState, useMemo } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CreateLoanProduct,
  GetAllLoanProducts,
  UpdateLoanProduct,
  GetAllLoanTypes,
} from "../../api/mastersApi";

const CALCULATION_METHOD_OPTIONS = [
  { label: "Simple", value: "Simple" },
  { label: "Compound", value: "Compound" },
  { label: "Reducing Balance", value: "Reducing Balance" },
  { label: "Flat", value: "Flat" },
];

const YES_NO_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const LoanProductMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loanTypeOptions, setLoanTypeOptions] = useState([]); // <-- dynamic loan types

  // =========================================================
  // FETCH ALL LOAN TYPES (for dropdown)
  // =========================================================
  const fetchLoanTypes = async () => {
    try {
      const response = await GetAllLoanTypes();
      // assume response.data is an array of loan type objects
      const options = (response?.data || []).filter((item) => item?.is_active).map((item) => ({
        label: item.loan_type,
        value: String(item.id),
      }));
      setLoanTypeOptions(options);
    } catch (error) {
      console.error("Error fetching loan types:", error);
      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Failed to load loan types!"
      );
    }
  };

  // Helper to get label from value
  const loanTypeLabel = (val) => {
    const option = loanTypeOptions.find(
      (o) => Number(o.value) === Number(val)
    );
    return option?.label || "-";
  };

  // =========================================================
  // FETCHING ALL LOAN PRODUCTS
  // =========================================================
  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await GetAllLoanProducts();
      if (response?.status) {
        const transformedData = (response.data || []).map((d, i) => ({
          ...d,
          sn: i + 1,
        }));
        setProductList(transformedData);
      } else {
        toast.info(response?.msg || "Unable to fetch loan products");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // TO ADD PRODUCT
  // =========================================================
  const handleAddProduct = () => {
    setIsEdit(false);
    setEditingProductId(null);
    productFormik.resetForm();
    setIsModalOpen(true);
  };

  // =========================================================
  // TO EDIT PRODUCT
  // =========================================================
  const handleEditProduct = (row) => {
    setIsEdit(true);
    setEditingProductId(row.id);

    productFormik.setValues({
      product_id: row.product_id || "",
      product_name: row.product_name || "",
      loan_type: String(row.loan_type ?? ""),
      category: row.category || "",
      principle_amount: row.principle_amount ?? "",
      lpf: row.lpf ?? "",
      interest_rate: row.interest_rate ?? "",
      tenure_months: row.tenure_months ?? "",
      apr_rate: row.apr_rate ?? "",
      eir_rate: row.eir_rate ?? "",
      mrr_rate: row.mrr_rate ?? "",
      calculation_method: row.calculation_method || "",
      disbursement_charges_rate: row.disbursement_charges_rate ?? "",
      membership_fee: row.membership_fee ?? "",
      pre_closure_rate: row.pre_closure_rate ?? "",
      flexi_emi: row.flexi_emi ? "Yes" : "No",
      is_active: !!row.is_active,
      created_by: "Admin",
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // TO TOGGLE PRODUCT STATUS
  // =========================================================
  const handleToggleStatus = async (row) => {
    const nextStatus = !row?.is_active;

    // Optimistic update
    setProductList((prev) =>
      prev.map((p) =>
        p.id !== row?.id ? p : { ...p, is_active: nextStatus }
      )
    );

    try {
      const req = {
        id: row?.id,
        product_id: row?.product_id,
        loan_type: Number(row?.loan_type),
        product_name: row?.product_name,
        category: row?.category,
        principle_amount: Number(row?.principle_amount),
        lpf: Number(row?.lpf),
        interest_rate: Number(row?.interest_rate),
        tenure_months: Number(row?.tenure_months),
        apr_rate: Number(row?.apr_rate),
        eir_rate: Number(row?.eir_rate),
        mrr_rate: Number(row?.mrr_rate),
        calculation_method: row?.calculation_method,
        disbursement_charges_rate: Number(row?.disbursement_charges_rate),
        membership_fee: Number(row?.membership_fee),
        pre_closure_rate: Number(row?.pre_closure_rate),
        flexi_emi: !!row?.flexi_emi,
        is_active: nextStatus,
        created_by: "Admin",
      };

      const response = await UpdateLoanProduct(req);

      if (response?.status) {
        toast.success(response?.msg || "Status updated successfully!");
      } else {
        // Revert on failure
        setProductList((prev) =>
          prev.map((p) =>
            p.id !== row?.id ? p : { ...p, is_active: row?.is_active }
          )
        );
        toast.info(response?.msg || "Unable to update status!");
      }
    } catch (error) {
      // Revert on error
      setProductList((prev) =>
        prev.map((p) =>
          p.id !== row?.id ? p : { ...p, is_active: row?.is_active }
        )
      );

      console.error("Error toggling product status:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Something went wrong!"
      );
    }
  };

  // =========================================================
  // DYNAMIC VALIDATION SCHEMA (depends on loanTypeOptions)
  // =========================================================
  const validationSchema = useMemo(
    () =>
      Yup.object({
        product_id: Yup.string()
          .trim()
          .required("Product ID is required")
          .max(50, "Product ID cannot exceed 50 characters"),

        product_name: Yup.string()
          .trim()
          .required("Product name is required")
          .min(2, "Product name must be at least 2 characters")
          .max(100, "Product name cannot exceed 100 characters"),

        loan_type: Yup.string()
          .required("Loan type is required")
          .test(
            "is-valid-loan-type",
            "Please select a valid loan type",
            (value) => loanTypeOptions.some((o) => o.value === value)
          ),

        category: Yup.string()
          .trim()
          .required("Category is required"),

        principle_amount: Yup.number()
          .typeError("Principle amount must be a number")
          .positive("Principle amount must be positive")
          .required("Principle amount is required"),

        lpf: Yup.number()
          .typeError("LPF must be a number")
          .min(0, "LPF must be at least 0")
          .required("LPF is required"),

        interest_rate: Yup.number()
          .typeError("Interest rate must be a number")
          .min(0, "Interest rate must be at least 0")
          .required("Interest rate is required"),

        tenure_months: Yup.number()
          .typeError("Tenure must be a number")
          .positive("Tenure must be positive")
          .integer("Tenure must be a whole number")
          .required("Tenure is required"),

        apr_rate: Yup.number()
          .typeError("APR rate must be a number")
          .min(0, "APR rate must be at least 0")
          .required("APR rate is required"),

        eir_rate: Yup.number()
          .typeError("EIR rate must be a number")
          .min(0, "EIR rate must be at least 0")
          .required("EIR rate is required"),

        mrr_rate: Yup.number()
          .typeError("MRR rate must be a number")
          .min(0, "MRR rate must be at least 0")
          .required("MRR rate is required"),

        calculation_method: Yup.string()
          .required("Calculation method is required")
          .oneOf(
            CALCULATION_METHOD_OPTIONS.map((o) => o.value),
            "Please select a valid calculation method"
          ),

        disbursement_charges_rate: Yup.number()
          .typeError("Disbursement charges rate must be a number")
          .min(0, "Disbursement charges rate must be at least 0")
          .required("Disbursement charges rate is required"),

        membership_fee: Yup.number()
          .typeError("Membership fee must be a number")
          .min(0, "Membership fee must be at least 0")
          .required("Membership fee is required"),

        pre_closure_rate: Yup.number()
          .typeError("Pre-closure rate must be a number")
          .min(0, "Pre-closure rate must be at least 0")
          .required("Pre-closure rate is required"),

        flexi_emi: Yup.string()
          .required("Flexi EMI option is required")
          .oneOf(["Yes", "No"], "Select Yes or No"),
      }),
    [loanTypeOptions]
  );

  // =========================================================
  // FORMIK FUNCTION TO ADD/EDIT PRODUCT DATA
  // =========================================================
  const productFormik = useFormik({
    initialValues: {
      product_id: "",
      product_name: "",
      loan_type: "",
      category: "",
      principle_amount: "",
      lpf: "",
      interest_rate: "",
      tenure_months: "",
      apr_rate: "",
      eir_rate: "",
      mrr_rate: "",
      calculation_method: "",
      disbursement_charges_rate: "",
      membership_fee: "",
      pre_closure_rate: "",
      flexi_emi: "No",
      is_active: false,
    },

    enableReinitialize: true,
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          product_id: values.product_id.trim(),
          loan_type: Number(values.loan_type),
          product_name: values.product_name.trim(),
          category: values.category,
          principle_amount: Number(values.principle_amount),
          lpf: Number(values.lpf),
          interest_rate: Number(values.interest_rate),
          tenure_months: Number(values.tenure_months),
          apr_rate: Number(values.apr_rate),
          eir_rate: Number(values.eir_rate),
          mrr_rate: Number(values.mrr_rate),
          calculation_method: values.calculation_method,
          disbursement_charges_rate: Number(values.disbursement_charges_rate),
          membership_fee: Number(values.membership_fee),
          pre_closure_rate: Number(values.pre_closure_rate),
          flexi_emi: values.flexi_emi === "Yes",
          is_active: isEdit ? !!values.is_active : false,
          created_by: "Admin",
        };

        let response;

        if (isEdit) {
          response = await UpdateLoanProduct({ id: editingProductId, ...req });
        } else {
          response = await CreateLoanProduct(req);
        }

        if (response?.status) {
          fetchAllProducts();
          toast.success(
            response.msg ||
              (isEdit
                ? "Loan product updated successfully!"
                : "Loan product created successfully!")
          );
          setIsModalOpen(false);
          resetForm();
          setIsEdit(false);
          setEditingProductId(null);
        } else {
          toast.info(
            response?.msg ||
              (isEdit
                ? "Unable to update loan product!"
                : "Unable to add loan product!")
          );
        }
      } catch (error) {
        console.error(
          isEdit
            ? "Error in updating loan product"
            : "Error in creating loan product",
          error
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  const formatCurrency = (value) => {
    if (value === "" || value === null || value === undefined) return "-";
    const num = Number(value);
    if (!Number.isFinite(num)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (value) => {
    if (value === "" || value === null || value === undefined) return "-";
    return `${value}%`;
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row?.sn,
      sortable: true,
      width: "70px",
    },
    {
      name: "Product ID",
      selector: (row) => row?.product_id || "-",
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row?.product_name || "-",
      sortable: true,
    },
    {
      name: "Loan Type",
      selector: (row) => loanTypeLabel(row?.loan_type),
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.category || "-",
      sortable: true,
    },
    {
      name: "Principle Amount",
      selector: (row) => formatCurrency(row?.principle_amount),
      sortable: true,
      right: true,
    },
    {
      name: "LPF",
      selector: (row) => formatPercentage(row?.lpf),
      sortable: true,
      center: true,
    },
    {
      name: "Interest Rate",
      selector: (row) => formatPercentage(row?.interest_rate),
      sortable: true,
      center: true,
    },
    {
      name: "Tenure (Months)",
      selector: (row) => row?.tenure_months ?? "-",
      sortable: true,
      center: true,
    },
    {
      name: "APR Rate",
      selector: (row) => formatPercentage(row?.apr_rate),
      sortable: true,
      center: true,
    },
    {
      name: "EIR Rate",
      selector: (row) => formatPercentage(row?.eir_rate),
      sortable: true,
      center: true,
    },
    {
      name: "MRR Rate",
      selector: (row) => formatPercentage(row?.mrr_rate),
      sortable: true,
      center: true,
    },
    {
      name: "Calculation Method",
      selector: (row) => row?.calculation_method || "-",
      sortable: true,
    },
    {
      name: "Disbursement Charges",
      selector: (row) => formatPercentage(row?.disbursement_charges_rate),
      sortable: true,
      center: true,
    },
    {
      name: "Membership Fee",
      selector: (row) => formatCurrency(row?.membership_fee),
      sortable: true,
      right: true,
    },
    {
      name: "Pre-Closure Rate",
      selector: (row) => formatPercentage(row?.pre_closure_rate),
      sortable: true,
      center: true,
    },
    {
      name: "Flexi EMI",
      selector: (row) => (row?.flexi_emi ? "Yes" : "No"),
      sortable: true,
      center: true,
    },
    {
      name: "Action",
      center: true,
      selector: (row) => (
        <div className="flex gap-5 cursor-pointer">
          <button onClick={() => handleEditProduct(row)}>
            <Icon name="FaEdit" size={18} color="black" />
          </button>
        </div>
      ),
    },
    {
      name: "Status",
      center: true,
      selector: (row) => (
        <TogleInput
          checked={row?.is_active}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchAllProducts();
    fetchLoanTypes(); // <-- fetch loan types on mount
  }, []);

  const ErrorText = ({ name }) =>
    productFormik.touched[name] && productFormik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">{productFormik.errors[name]}</p>
    ) : null;

  return (
    <>
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center p-0 px-4">
          <div className="text-md font-medium self-center">Loan Products</div>

          <button
            onClick={handleAddProduct}
            className="text-sm py-1.5 px-3 rounded-sm bg-primary hover:bg-primary/90 text-white flex justify-between gap-3 cursor-pointer"
          >
            New Loan Product
          </button>
        </div>

        {/* Table */}
        <Table data={productList} columns={columns} />
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        title={isEdit ? "Update Loan Product" : "Add New Loan Product"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          productFormik.resetForm();
          setIsEdit(false);
          setEditingProductId(null);
        }}
        size="large"
      >
        <form onSubmit={productFormik.handleSubmit}>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div>
              <TextInput
                label="Product ID"
                name="product_id"
                placeholder="Enter product ID"
                value={productFormik.values.product_id}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="product_id" />
            </div>

            <div>
              <TextInput
                label="Product Name"
                name="product_name"
                placeholder="Enter product name"
                value={productFormik.values.product_name}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="product_name" />
            </div>

            <div>
              <SelectInput
                label="Loan Type"
                name="loan_type"
                placeholder="Select loan type"
                value={productFormik.values.loan_type}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
                options={loanTypeOptions} // <-- dynamic options
              />
              <ErrorText name="loan_type" />
            </div>

            <div>
              <TextInput
                label="Category"
                name="category"
                placeholder="Enter category"
                value={productFormik.values.category}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="category" />
            </div>

            <div>
              <TextInput
                label="Principle Amount (₹)"
                name="principle_amount"
                type="number"
                placeholder="Enter principle amount"
                value={productFormik.values.principle_amount}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="principle_amount" />
            </div>

            <div>
              <TextInput
                label="LPF (%)"
                name="lpf"
                type="number"
                step="0.01"
                placeholder="Enter LPF"
                value={productFormik.values.lpf}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="lpf" />
            </div>

            <div>
              <TextInput
                label="Interest Rate (%)"
                name="interest_rate"
                type="number"
                step="0.01"
                placeholder="Enter interest rate"
                value={productFormik.values.interest_rate}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="interest_rate" />
            </div>

            <div>
              <TextInput
                label="Tenure (Months)"
                name="tenure_months"
                type="number"
                placeholder="Enter tenure"
                value={productFormik.values.tenure_months}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="tenure_months" />
            </div>

            <div>
              <TextInput
                label="APR Rate (%)"
                name="apr_rate"
                type="number"
                step="0.01"
                placeholder="Enter APR rate"
                value={productFormik.values.apr_rate}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="apr_rate" />
            </div>

            <div>
              <TextInput
                label="EIR Rate (%)"
                name="eir_rate"
                type="number"
                step="0.01"
                placeholder="Enter EIR rate"
                value={productFormik.values.eir_rate}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="eir_rate" />
            </div>

            <div>
              <TextInput
                label="MRR Rate (%)"
                name="mrr_rate"
                type="number"
                step="0.01"
                placeholder="Enter MRR rate"
                value={productFormik.values.mrr_rate}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="mrr_rate" />
            </div>

            <div>
              <SelectInput
                label="Calculation Method"
                name="calculation_method"
                placeholder="Select calculation method"
                value={productFormik.values.calculation_method}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
                options={CALCULATION_METHOD_OPTIONS}
              />
              <ErrorText name="calculation_method" />
            </div>

            <div>
              <TextInput
                label="Disbursement Charges Rate (%)"
                name="disbursement_charges_rate"
                type="number"
                step="0.01"
                placeholder="Enter disbursement charges rate"
                value={productFormik.values.disbursement_charges_rate}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="disbursement_charges_rate" />
            </div>

            <div>
              <TextInput
                label="Membership Fee (₹)"
                name="membership_fee"
                type="number"
                step="0.01"
                placeholder="Enter membership fee"
                value={productFormik.values.membership_fee}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="membership_fee" />
            </div>

            <div>
              <TextInput
                label="Pre-Closure Rate (%)"
                name="pre_closure_rate"
                type="number"
                step="0.01"
                placeholder="Enter pre-closure rate"
                value={productFormik.values.pre_closure_rate}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
              />
              <ErrorText name="pre_closure_rate" />
            </div>

            <div>
              <SelectInput
                label="Flexi EMI"
                name="flexi_emi"
                placeholder="Select Flexi EMI option"
                value={productFormik.values.flexi_emi}
                onChange={productFormik.handleChange}
                onBlur={productFormik.handleBlur}
                options={YES_NO_OPTIONS}
              />
              <ErrorText name="flexi_emi" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-5">
            <Button
              btnName="Cancel"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                productFormik.resetForm();
                setIsEdit(false);
                setEditingProductId(null);
              }}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              disabled={!productFormik.isValid || productFormik.isSubmitting}
              style="bg-primary text-sm text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default LoanProductMaster;