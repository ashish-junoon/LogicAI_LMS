import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
} from "react-icons/ri";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import Button from "../../components/utils/Button";

const LoanProductMaster = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  // Initial form values
  const initialValues = {
    productName: "",
    category: "",
    principleAmount: "",
    lpf: "",
    interestRate: "",
    tenure: "",
    aprRate: "",
    eirRate: "",
    mrrRate: "",
    calculationMethod: "",
    disbursementChargesRate: "",
    productId: "",
    membershipFee: "",
    preClosureRate: "",
    flexiEmi: "",
  };

  // Validation schema
  const validationSchema = Yup.object({
    productName: Yup.string().required("Product name is required"),
    category: Yup.string().required("Category is required"),
    principleAmount: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("Principle amount is required"),
    lpf: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("LPF is required"),
    interestRate: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("Interest rate is required"),
    tenure: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .integer("Must be a whole number")
      .required("Tenure is required"),
    aprRate: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("APR rate is required"),
    eirRate: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("EIR rate is required"),
    mrrRate: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("MRR rate is required"),
    calculationMethod: Yup.string().required("Calculation method is required"),
    disbursementChargesRate: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("Disbursement charges rate is required"),
    productId: Yup.string().required("Product ID is required"),
    membershipFee: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("Membership fee is required"),
    preClosureRate: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be at least 0")
      .required("Pre-closure rate is required"),
    flexiEmi: Yup.string().required("Flexi EMI option is required"),
  });

  const formik = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: (values) => {
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map((product) =>
          product.id === editingProduct.id
            ? { ...values, id: product.id, createdAt: product.createdAt }
            : product
        );
        setProducts(updatedProducts);
      } else {
        // Add new product
        const newProduct = {
          ...values,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        setProducts([...products, newProduct]);
      }
      handleCloseModal();
    },
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      formik.setValues({
        productName: product.productName,
        category: product.category,
        principleAmount: product.principleAmount,
        lpf: product.lpf,
        interestRate: product.interestRate,
        tenure: product.tenure,
        aprRate: product.aprRate,
        eirRate: product.eirRate,
        mrrRate: product.mrrRate,
        calculationMethod: product.calculationMethod,
        disbursementChargesRate: product.disbursementChargesRate,
        productId: product.productId,
        membershipFee: product.membershipFee,
        preClosureRate: product.preClosureRate,
        flexiEmi: product.flexiEmi,
      });
    } else {
      setEditingProduct(null);
      formik.resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    formik.resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value}%`;
  };

  // Table columns configuration with correct format
  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      sortable: true,
      width: 60,
      center: true,
    },
    {
      name: "Product ID",
      selector: (row) => row.productId,
      sortable: true,
      width: 120,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
      width: 180,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      width: 150,
    },
    {
      name: "Principle Amount",
      selector: (row) => formatCurrency(row.principleAmount),
      sortable: true,
      width: 150,
      right: true,
    },
    {
      name: "LPF",
      selector: (row) => formatPercentage(row.lpf),
      sortable: true,
      width: 100,
      center: true,
    },
    {
      name: "Interest Rate",
      selector: (row) => formatPercentage(row.interestRate),
      sortable: true,
      width: 120,
      center: true,
    },
    {
      name: "Tenure (Months)",
      selector: (row) => row.tenure,
      sortable: true,
      width: 130,
      center: true,
    },
    {
      name: "APR Rate",
      selector: (row) => formatPercentage(row.aprRate),
      sortable: true,
      width: 100,
      center: true,
    },
    {
      name: "EIR Rate",
      selector: (row) => formatPercentage(row.eirRate),
      sortable: true,
      width: 100,
      center: true,
    },
    {
      name: "MRR Rate",
      selector: (row) => formatPercentage(row.mrrRate),
      sortable: true,
      width: 100,
      center: true,
    },
    {
      name: "Calculation Method",
      selector: (row) => row.calculationMethod,
      sortable: true,
      width: 160,
    },
    {
      name: "Disbursement Charges",
      selector: (row) => formatPercentage(row.disbursementChargesRate),
      sortable: true,
      width: 170,
      center: true,
    },
    {
      name: "Membership Fee",
      selector: (row) => formatCurrency(row.membershipFee),
      sortable: true,
      width: 130,
      right: true,
    },
    {
      name: "Pre-Closure Rate",
      selector: (row) => formatPercentage(row.preClosureRate),
      sortable: true,
      width: 140,
      center: true,
    },
    {
      name: "Flexi EMI",
      selector: (row) => row.flexiEmi,
      sortable: true,
      width: 100,
      center: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <RiEyeLine size={18} />
          </button>
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <RiEditLine size={18} />
          </button>
          {/* <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <RiDeleteBinLine size={18} />
          </button> */}
        </div>
      ),
      sortable: false,
      width: 150,
      center: true,
    },
  ];

  // Calculation method options
  const calculationMethodOptions = [
    { value: "Simple", label: "Simple" },
    { value: "Compound", label: "Compound" },
    { value: "Reducing Balance", label: "Reducing Balance" },
    { value: "Flat", label: "Flat" },
  ];

  // Flexi EMI options
  const flexiEmiOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  return (
    <div>
      <div className="flex-1">
        {/* header  */}
        <div className="flex justify-between items-center px-4">
          <div className="text-md font-medium self-center">Create Loan Product</div>

          <Button
            onClick={() => handleOpenModal()}
            btnName="Add Create"
            style="bg-primary hover:bg-primary text-white flex items-center gap-2"
            icon={<RiAddLine size={20} />}
          />
        </div>

        {/* table data */}
        <Table data={products} columns={columns} />
      </div>

      {/* View Product Modal */}
      <Modal
        title="Product Details"
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      >
        {viewingProduct && (
          <div className="grid grid-cols-3 gap-2 mt-6">
            {columns
              .filter((col) => col.name !== "Actions" && col.name !== "#")
              .map((col) => (
                <div key={col.name} className="bg-gray-100 border border-gray-200 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium">
                    {col.name}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {typeof col.selector === "function"
                      ? col.selector(viewingProduct)
                      : viewingProduct[col.name]}
                  </p>
                </div>
              ))}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => setIsViewModalOpen(false)}
            btnName="Close"
            style="bg-gray-200 hover:bg-gray-300 text-gray-700"
          />
        </div>
      </Modal>

      {/* Create/Edit Product Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Create New Product"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="large"
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            {/* Product ID */}
            <TextInput
              label="Product ID"
              name="productId"
              placeholder="Enter product ID"
              value={formik.values.productId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.productId && formik.errors.productId}
              required
            />

            {/* Product Name */}
            <TextInput
              label="Product Name"
              name="productName"
              placeholder="Enter product name"
              value={formik.values.productName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.productName && formik.errors.productName}
              required
            />

            {/* Category */}
            <TextInput
              label="Category"
              name="category"
              placeholder="Enter category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && formik.errors.category}
              required
            />

            {/* Principle Amount */}
            <TextInput
              label="Principle Amount (₹)"
              name="principleAmount"
              type="number"
              placeholder="Enter principle amount"
              value={formik.values.principleAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.principleAmount && formik.errors.principleAmount
              }
              required
            />

            {/* LPF */}
            <TextInput
              label="LPF (%)"
              name="lpf"
              type="number"
              step="0.01"
              placeholder="Enter LPF"
              value={formik.values.lpf}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lpf && formik.errors.lpf}
              required
            />

            {/* Interest Rate */}
            <TextInput
              label="Interest Rate (%)"
              name="interestRate"
              type="number"
              step="0.01"
              placeholder="Enter interest rate"
              value={formik.values.interestRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.interestRate && formik.errors.interestRate}
              required
            />

            {/* Tenure */}
            <TextInput
              label="Tenure (Months)"
              name="tenure"
              type="number"
              placeholder="Enter tenure"
              value={formik.values.tenure}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tenure && formik.errors.tenure}
              required
            />

            {/* APR Rate */}
            <TextInput
              label="APR Rate (%)"
              name="aprRate"
              type="number"
              step="0.01"
              placeholder="Enter APR rate"
              value={formik.values.aprRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.aprRate && formik.errors.aprRate}
              required
            />

            {/* EIR Rate */}
            <TextInput
              label="EIR Rate (%)"
              name="eirRate"
              type="number"
              step="0.01"
              placeholder="Enter EIR rate"
              value={formik.values.eirRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.eirRate && formik.errors.eirRate}
              required
            />

            {/* MRR Rate */}
            <TextInput
              label="MRR Rate (%)"
              name="mrrRate"
              type="number"
              step="0.01"
              placeholder="Enter MRR rate"
              value={formik.values.mrrRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mrrRate && formik.errors.mrrRate}
              required
            />

            {/* Calculation Method */}
            <SelectInput
              label="Calculation Method"
              name="calculationMethod"
              placeholder="Select calculation method"
              value={formik.values.calculationMethod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={calculationMethodOptions}
              error={
                formik.touched.calculationMethod &&
                formik.errors.calculationMethod
              }
              required
            />

            {/* Disbursement Charges Rate */}
            <TextInput
              label="Disbursement Charges Rate (%)"
              name="disbursementChargesRate"
              type="number"
              step="0.01"
              placeholder="Enter disbursement charges rate"
              value={formik.values.disbursementChargesRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.disbursementChargesRate &&
                formik.errors.disbursementChargesRate
              }
              required
            />

            {/* Membership Fee */}
            <TextInput
              label="Membership Fee (₹)"
              name="membershipFee"
              type="number"
              step="0.01"
              placeholder="Enter membership fee"
              value={formik.values.membershipFee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.membershipFee && formik.errors.membershipFee}
              required
            />

            {/* Pre-Closure Rate */}
            <TextInput
              label="Pre-Closure Rate (%)"
              name="preClosureRate"
              type="number"
              step="0.01"
              placeholder="Enter pre-closure rate"
              value={formik.values.preClosureRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.preClosureRate && formik.errors.preClosureRate}
              required
            />

            {/* Flexi EMI */}
            <SelectInput
              label="Flexi EMI"
              name="flexiEmi"
              placeholder="Select Flexi EMI option"
              value={formik.values.flexiEmi}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={flexiEmiOptions}
              error={formik.touched.flexiEmi && formik.errors.flexiEmi}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleCloseModal}
              btnName="Cancel"
              style="bg-gray-200 hover:bg-gray-300 text-gray-700"
            />
            <Button
              type="submit"
              btnName={editingProduct ? "Update Product" : "Create Product"}
              style="bg-primary hover:bg-primary text-white"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoanProductMaster;