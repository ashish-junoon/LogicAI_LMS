// import React, { useMemo, useState } from "react";
// import Icon from "../utils/Icon";
// import Modal from "../utils/Modal";
// import TextInput from "../fields/TextInput";
// import SelectInput from "../fields/SelectInput";
// import Button from "../utils/Button";

// // Sample master data
// const products = [
//   {
//     value: "home-fixed",
//     label: "Home Loan - Fixed Rate",
//     productType: "Home Loan",
//     purpose: "Purchase of new house",
//     amounts: [
//       {
//         value: "2500000",
//         label: "₹25,00,000",
//         interestRate: "8.5%",
//         tenure: 240, // 20 years
//         processingFee: "1%",
//         emiOption: "Fixed EMI",
//       },
//       {
//         value: "5000000",
//         label: "₹50,00,000",
//         interestRate: "8.5%",
//         tenure: 240, // 20 years
//         processingFee: "1%",
//         emiOption: "Fixed EMI",
//       },
//       {
//         value: "7500000",
//         label: "₹75,00,000",
//         interestRate: "8.75%",
//         tenure: 300, // 25 years
//         processingFee: "1%",
//         emiOption: "Fixed EMI",
//       },
//     ],
//   },
//   {
//     value: "personal-loan",
//     label: "Personal Loan",
//     productType: "Personal Loan",
//     purpose: "Personal Expenses",
//     amounts: [
//       {
//         value: "100000",
//         label: "₹1,00,000",
//         interestRate: "12%",
//         tenure: 24, // 2 years
//         processingFee: "2%",
//         emiOption: "Fixed EMI",
//       },
//       {
//         value: "300000",
//         label: "₹3,00,000",
//         interestRate: "13%",
//         tenure: 36, // 3 years
//         processingFee: "2%",
//         emiOption: "Fixed EMI",
//       },
//       {
//         value: "500000",
//         label: "₹5,00,000",
//         interestRate: "14%",
//         tenure: 60, // 5 years
//         processingFee: "2%",
//         emiOption: "Fixed EMI",
//       },
//     ],
//   },
//   {
//     value: "business-loan",
//     label: "Business Loan",
//     productType: "Business Loan",
//     purpose: "Business Expansion",
//     amounts: [
//       {
//         value: "500000",
//         label: "₹5,00,000",
//         interestRate: "14%",
//         tenure: 36, // 3 years
//         processingFee: "2%",
//         emiOption: "Fixed EMI",
//       },
//       {
//         value: "1000000",
//         label: "₹10,00,000",
//         interestRate: "15%",
//         tenure: 60, // 5 years
//         processingFee: "2%",
//         emiOption: "Fixed EMI",
//       },
//     ],
//   },
// ];

// const toLoanProduct = (loanData) => ({
//   productId: "",
//   productName: loanData?.product_code || loanData?.loan_type || "",
//   productType: loanData?.loan_type || "",
//   loanAmount: loanData?.loan_amount == null ? "" : String(loanData.loan_amount),
//   interestRate: loanData?.interest_rate == null ? "" : `${loanData.interest_rate}%`,
//   tenure: loanData?.tenure || "",
//   processingFee: loanData?.processing_fee == null ? "" : String(loanData.processing_fee),
//   emiOption: "",
//   purpose: loanData?.purpose_of_loan || "",
// });

// const formatAmount = (amount) =>
//   amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "-";

// const LoanAnalysis = ({ permission = false, loanData, applicationId }) => {
//   const [loanProduct, setLoanProduct] = useState(() => toLoanProduct(loanData));
//   const [editForm, setEditForm] = useState(() => toLoanProduct(loanData));
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   // Selected product details
//   const selectedProduct = useMemo(
//     () => products.find((product) => product.value === editForm.productId),
//     [editForm.productId],
//   );

//   // Amount options depend on selected product
//   const amountOptions = useMemo(
//     () =>
//       selectedProduct?.amounts.map((amount) => ({
//         label: amount.label,
//         value: amount.value,
//       })) || [],
//     [selectedProduct],
//   );

//   // Open modal with existing details
//   const handleEditClick = () => {
//     setEditForm({ ...loanProduct });
//     setIsEditModalOpen(true);
//   };

//   // Support SelectInput returning either an event or an option/value
//   const getSelectedValue = (selected) => {
//     if (selected?.target) return selected.target.value;
//     return selected?.value ?? selected ?? "";
//   };

//   // Product selection: reset amount and dependent details
//   const handleProductChange = (selected) => {
//     const productId = getSelectedValue(selected);
//     const product = products.find((item) => item.value === productId);

//     if (!product) return;

//     setEditForm((prev) => ({
//       ...prev,
//       productId: product.value,
//       productName: product.label,
//       productType: product.productType,
//       loanAmount: "",
//       interestRate: "",
//       tenure: "",
//       processingFee: "",
//       emiOption: "",
//       purpose: product.purpose,
//     }));
//   };

//   // Amount selection: auto-fill remaining details
//   const handleAmountChange = (selected) => {
//     const loanAmount = getSelectedValue(selected);
//     const amountDetails = selectedProduct?.amounts.find(
//       (amount) => amount.value === String(loanAmount),
//     );

//     if (!amountDetails) return;

//     setEditForm((prev) => ({
//       ...prev,
//       loanAmount: amountDetails.value,
//       interestRate: amountDetails.interestRate,
//       tenure: amountDetails.tenure,
//       processingFee: amountDetails.processingFee,
//       emiOption: amountDetails.emiOption,
//       purpose: selectedProduct.purpose,
//       productType: selectedProduct.productType,
//       productName: selectedProduct.label,
//     }));
//   };

//   const handleEditSave = () => {
//     if (!editForm.productId || !editForm.loanAmount) return;

//     setLoanProduct({ ...editForm });
//     setIsEditModalOpen(false);
//   };

//   return (
//     <>
//       <div className="bg-white rounded-lg shadow-sm border border-slate-200">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
//           <div className="flex items-center gap-2">
//             <div className="p-1.5 bg-primary/10 rounded-md">
//               <Icon name="RiFileListLine" size={16} color="#8140DC" />
//             </div>

//             <div>
//               <h2 className="text-xs font-semibold text-slate-800">
//                 Loan Details
//               </h2>
//               <p className="text-[10px] text-slate-500">
//                 Verify or Edit Loan Details
//               </p>
//             </div>
//           </div>

//           <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
//             {loanData?.application_id || applicationId || "-"}
//           </span>
//         </div>

//         {/* Loan Details */}
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-1.5">
//               <Icon name="RiProductHuntLine" size={14} color="#8140DC" />
//               <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
//                 Loan Product
//               </span>
//             </div>

//             {permission && (
//               <button
//                 type="button"
//                 onClick={handleEditClick}
//                 className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition cursor-pointer"
//               >
//                 <Icon name="RiEditLine" size={14} />
//                 Edit
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//             {[
//               {
//                 label: "Product",
//                 value: loanProduct.productName,
//               },
//               {
//                 label: "Type",
//                 value: loanProduct.productType,
//               },
//               {
//                 label: "Amount",
//                 value: formatAmount(loanProduct.loanAmount),
//                 highlight: true,
//               },
//               {
//                 label: "Interest",
//                 value: loanProduct.interestRate,
//               },
//               {
//                 label: "Tenure",
//                 value: loanProduct.tenure
//                   ? `${loanProduct.tenure} Months`
//                   : "-",
//               },
//               {
//                 label: "Processing Fee",
//                 value: loanProduct.processingFee,
//               },
//               {
//                 label: "EMI Option",
//                 value: loanProduct.emiOption,
//               },
//               {
//                 label: "Purpose",
//                 value: loanProduct.purpose,
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="bg-slate-50 rounded-md px-2 py-1.5 min-w-0"
//               >
//                 <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                   {item.label}
//                 </p>
//                 <p
//                   className={`text-xs font-semibold truncate ${
//                     item.highlight ? "text-primary" : "text-slate-800"
//                   }`}
//                   title={item.value}
//                 >
//                   {item.value || "-"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Edit Loan Product Modal */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         title="Edit Loan Product"
//         size="md"
//       >
//         <div className="space-y-3">
//           <div className="grid grid-cols-2 gap-3 pt-5">
//             {/* Product Selection */}
//             <div className="">
//               <SelectInput
//                 placeholder={"Select product"}
//                 label="Product Name"
//                 options={products.map((product) => ({
//                   label: product.label,
//                   value: product.value,
//                 }))}
//                 value={editForm.productId}
//                 onChange={handleProductChange}
//               />
//             </div>

//             {/* Loan Amount Selection */}
//             <div className="">
//               <SelectInput
//                 placeholder={"Select Amount"}
//                 label="Loan Amount"
//                 options={amountOptions}
//                 value={editForm.loanAmount}
//                 onChange={handleAmountChange}
//                 disabled={!editForm.productId}
//               />
//               {!editForm.loanAmount && (
//                 <p className="text-[10px] text-slate-500 mt-1">
//                   Select a loan amount to fill in the loan details.
//                 </p>
//               )}
//             </div>

//             {/* Auto-filled details */}
//             <TextInput
//               label="Product Type"
//               value={editForm.productType}
//               readOnly
//             />

//             <TextInput
//               label="Interest Rate"
//               value={editForm.interestRate}
//               readOnly
//             />

//             <TextInput
//               label="Tenure (Months)"
//               value={editForm.tenure ? String(editForm.tenure) : ""}
//               readOnly
//             />

//             <TextInput
//               label="Processing Fee"
//               value={editForm.processingFee}
//               readOnly
//             />

//             <TextInput label="EMI Option" value={editForm.emiOption} readOnly />

//             {/* <div className="col-span-2">
//               <TextInput
//                 label="Purpose"
//                 value={editForm.purpose}
//                 readOnly
//               />
//             </div> */}
//           </div>

//           <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
//             <Button
//               style="border-gray-200"
//               btnName="Cancel"
//               onClick={() => setIsEditModalOpen(false)}
//             />

//             <Button
//               onClick={handleEditSave}
//               btnIcon="RiSaveLine"
//               style="bg-primary text-white"
//               btnName="Save Changes"
//               disabled={!editForm.productId || !editForm.loanAmount}
//             />
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default LoanAnalysis;




import { useEffect, useMemo, useState } from "react";
import {
  RiFileListLine,
  RiProductHuntLine,
  RiEditLine,
  RiSaveLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import {
  GetAllLoanTypes,
  GetAllLoanPurposes,
  GetAllLoanProducts,
  GetAllLoanSubPurposes,
} from "../../api/mastersApi.js";
import { SaveLoanInfo } from "../../api/application.js";
import { useAuthData } from "../../context/authContext";

// Resolve a raw ID to its label from a master list.
const makeResolver =
  (list, idKey, labelKey, fallback = "0") =>
    (value) => {
      if (value === null || value === undefined || value === "") return fallback;
      const found = list.find((x) => String(x[idKey]) === String(value));
      return found ? found[labelKey] : fallback;
    };

// Products can be referenced by either product_id (string) or id (number).
const makeProductResolver = (products) => (value) => {
  if (value === null || value === undefined || value === "") return "0";
  const found = products.find(
    (p) =>
      String(p.product_id) === String(value) ||
      String(p.id) === String(value) ||
      String(p.product_name) === String(value),
  );
  return found ? found.product_name || found.product_id : "0";
};

// "₹1,00,000 | 12% | 24 Months"
const formatProductLabel = ({
  principle_amount,
  interest_rate,
  tenure_months,
} = {}) =>
  `₹${Number(principle_amount || 0).toLocaleString("en-IN")} | ${interest_rate ?? "-"
  }% | ${tenure_months ?? "-"} Months`;

const firstAvailable = (...values) =>
  values.find((value) => value !== null && value !== undefined && value !== "") ?? 0;

const toLoanProduct = (loanData = {}, products = []) => {
  const productCode = loanData.product_code ?? loanData.product_id;
  const masterProduct = products.find(
    (product) =>
      [product.product_id, product.id, product.product_name].some(
        (value) => value != null && String(value) === String(productCode),
      ),
  );
  const insuranceFee = firstAvailable(
    loanData.insurance_fee,
    masterProduct?.insurance_fee,
  );
  const hasInsurance =
    loanData.is_insurance != null
      ? loanData.is_insurance
      : Number(insuranceFee) > 0;

  return {
    productType: firstAvailable(
      loanData.loan_type_id,
      loanData.loan_type,
      masterProduct?.loan_type,
    ),
    productName:
      productCode || masterProduct?.product_id || masterProduct?.id || "0",
    loanAmount: firstAvailable(
      loanData.loan_amount,
      masterProduct?.principle_amount,
    ),
    interestRate: firstAvailable(
      loanData.interest_rate,
      masterProduct?.interest_rate,
    ),
    tenure: firstAvailable(loanData.tenure, masterProduct?.tenure_months),
    repaymentFrequency: firstAvailable(
      loanData.repayment_frequency,
      masterProduct?.repayment_frequency,
    ),
    emiAmount: firstAvailable(loanData.emi_amount),
    loginFee: firstAvailable(loanData.login_fee),
    gstLoginFee: firstAvailable(loanData.gst_login_fee),
    hasInsurance: hasInsurance ? "true" : "false",
    insuranceFee,
    processingFee: firstAvailable(
      loanData.processing_fee,
      masterProduct?.lpf,
    ),
    purpose: firstAvailable(
      loanData.loan_purpose_id,
      loanData.purpose_of_loan,
    ),
    subPurpose: firstAvailable(
      loanData.loan_sub_purpose_id,
      loanData.sub_purpose_loan,
    ),
  };
};

const LoanAnalysis = ({ data }) => {
  const loanRecord = data?.loanDetails?.[0];
  const [savedLoanProduct, setSavedLoanProduct] = useState(null);

  /* ---------- Master lists ---------- */
  const [loanTypes, setLoanTypes] = useState([]);
  const [loanPurposes, setLoanPurposes] = useState([]);
  const [loanSubPurposes, setLoanSubPurposes] = useState([]);
  const [loanProducts, setLoanProducts] = useState([]);
  const loanProduct =
    savedLoanProduct?.source === loanRecord
      ? savedLoanProduct.value
      : toLoanProduct(loanRecord, loanProducts);

  const { authData } = useAuthData();

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [typesRes, purposesRes, subPurposesRes, productsRes] =
          await Promise.all([
            GetAllLoanTypes(),
            GetAllLoanPurposes(),
            GetAllLoanSubPurposes(),
            GetAllLoanProducts(),
          ]);
        if (cancelled) return;

        if (typesRes?.status && Array.isArray(typesRes.data)) {
          setLoanTypes(typesRes.data.filter((x) => x?.is_active === true));
        }
        if (purposesRes?.status && Array.isArray(purposesRes.data)) {
          setLoanPurposes(purposesRes.data.filter((x) => x?.is_active === true));
        }
        if (subPurposesRes?.status && Array.isArray(subPurposesRes.data)) {
          setLoanSubPurposes(
            subPurposesRes.data.filter((x) => x?.is_active === true),
          );
        }
        if (productsRes?.status && Array.isArray(productsRes.data)) {
          setLoanProducts(
            productsRes.data.filter((x) => x?.is_active === true),
          );
        }
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Edit state ---------- */
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...loanProduct });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const findProduct = (value) =>
    loanProducts.find(
      (p) =>
        String(p.product_id) === String(value) || String(p.id) === String(value),
    );

  const handleEditClick = () => {
    // Normalize productName to product_id so the select can match it.
    const next = { ...loanProduct };
    const found = findProduct(loanProduct.productName);
    if (found) next.productName = found.product_id ?? found.id;
    setSaveError(null);
    setEditForm(next);
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    setSaveError(null);

    const loanRecord = data?.loanDetails?.[0] ?? {};
    const found = findProduct(editForm.productName);

    const payload = {
      id: loanRecord.id ?? 0,
      customer_id: String(
        loanRecord.customer_id ??
          data?.workflowNodes?.[0]?.customer_id ??
          data?.personalKyc?.[0]?.customer_id ??
          "",
      ),
      application_id: String(
        loanRecord.application_id ??
          data?.workflowNodes?.[0]?.application_id ??
          "",
      ),
      loan_type: Number(editForm.productType ?? 0),
      product_code: String(editForm.productName ?? ""),
      loan_amount: Number(editForm.loanAmount ?? 0),
      interest_rate: Number(editForm.interestRate ?? 0),
      tenure: String(editForm.tenure ?? "0"),
      processing_fee: Number(editForm.processingFee ?? 0),
      purpose_of_loan: Number(editForm.purpose ?? 0),
      sub_purpose_loan: Number(editForm.subPurpose ?? 0),
      login_fee: Number(editForm.loginFee ?? 0),
      gst_login_fee: Number(editForm.gstLoginFee ?? 0),
      repayment_frequency: String(editForm.repaymentFrequency ?? ""),
      emi_amount: Number(editForm.emiAmount ?? 0),
      insurance_fee: Number(editForm.insuranceFee ?? 0),
      is_insurance:
        editForm.hasInsurance === "true" || editForm.hasInsurance === true,
      created_by: authData?.user_id,
      company_id: import.meta.env.VITE_COMPANY_ID,
      product_name: found?.product_name ?? import.meta.env.VITE_PRODUCT_NAME,
      is_loaninfo_verified: true,
    };

    setIsSaving(true);
    try {
      const response = await SaveLoanInfo(payload);
      if (response?.status) {
        setSavedLoanProduct({ source: loanRecord, value: { ...editForm } });
        setIsEditing(false);
        toast.success(response.message || "Loan details saved successfully!");
      } else {
        setSaveError(response?.message || "Unable to save loan details.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "Something went wrong!";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setSaveError(null);
    setEditForm({ ...loanProduct });
    setIsEditing(false);
  };

  /* ---------- Field-specific change handlers ---------- */
  const handlePurposeChange = (e) => {
    const newPurpose = e.target.value;
    setEditForm((prev) => {
      const stillValid = loanSubPurposes.some(
        (s) =>
          String(s.loan_purpose_id) === String(newPurpose) &&
          String(s.id) === String(prev.subPurpose),
      );
      return {
        ...prev,
        purpose: newPurpose,
        subPurpose: stillValid ? prev.subPurpose : "",
      };
    });
  };

  const handleProductTypeChange = (e) => {
    const newType = e.target.value;
    setEditForm((prev) => {
      const selected = findProduct(prev.productName);
      const stillValid =
        selected && String(selected.loan_type) === String(newType);
      return {
        ...prev,
        productType: newType,
        productName: stillValid ? prev.productName : "",
      };
    });
  };

  const handleProductChange = (e) => {
    const newProductId = e.target.value;
    const product = findProduct(newProductId);

    if (!product) {
      setEditForm((prev) => ({ ...prev, productName: newProductId }));
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      productName: product.product_id ?? product.id,
      loanAmount: product.principle_amount,
      interestRate: product.interest_rate,
      tenure: product.tenure_months,
      processingFee: product.lpf,
      insuranceFee: product.insurance_fee,
      hasInsurance: Number(product.insurance_fee) > 0 ? "true" : "false",
    }));
  };

  const handleHasInsuranceChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      hasInsurance: e.target.checked ? "true" : "false",
    }));
  };

  /* ---------- Derived options ---------- */
  const filteredProducts = useMemo(() => {
    if (!editForm.productType) return loanProducts;
    return loanProducts.filter(
      (p) => String(p.loan_type) === String(editForm.productType),
    );
  }, [editForm.productType, loanProducts]);

  const filteredSubPurposes = useMemo(() => {
    if (!editForm.purpose) return [];
    return loanSubPurposes.filter(
      (s) => String(s.loan_purpose_id) === String(editForm.purpose),
    );
  }, [editForm.purpose, loanSubPurposes]);

  /* ---------- Small primitives ---------- */
  const StatBox = ({ label, value, accent }) => (
    <div className="bg-ink-50 rounded-lg px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p
        className={`text-xs font-semibold mt-0.5 truncate ${accent || "text-ink-800"
          }`}
      >
        {value}
      </p>
    </div>
  );

  const EditBox = ({ label, value, onChange, disabled }) => (
    <div className="bg-ink-50 rounded-lg px-3 py-2">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-xs font-semibold text-ink-800 focus:outline-none focus:border-primary-500 focus:ring-0 disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-500"
      />
    </div>
  );

  const SelectBox = ({ label, value, onChange, options, disabled }) => (
    <div className="bg-ink-50 rounded-lg px-3 py-2">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-xs font-semibold text-ink-800 focus:outline-none focus:border-primary-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const CheckBox = ({ label, checked, onChange, disabled }) => (
    <div className="bg-ink-50 rounded-lg px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">
        {label}
      </p>
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span className="text-xs font-semibold text-ink-800">
          {checked ? "Yes" : "No"}
        </span>
      </label>
    </div>
  );

  /* Fields list keeps StatBox / EditBox / SelectBox / CheckBox pairs in sync.
     Only productType, productName, purpose, subPurpose, and hasInsurance are editable. */
  const productFields = [
    {
      key: "productType",
      label: "Type",
      type: "select",
      options: loanTypes.map((t) => ({ value: t.id, label: t.loan_type })),
      resolve: makeResolver(loanTypes, "id", "loan_type"),
    },
    {
      key: "productName",
      label: "Product",
      type: "select",
      options: filteredProducts.map((p) => ({
        value: p.product_id,
        label: formatProductLabel(p),
      })),
      resolve: makeProductResolver(loanProducts),
      disabled: !editForm.productType,
    },
    {
      key: "loanAmount",
      label: "Amount (₹)",
      accent: "text-primary-700 font-bold",
      disabled: true,
    },
    { key: "interestRate", label: "Interest (%)", disabled: true },
    { key: "tenure", label: "Tenure (months)", disabled: true },
    { key: "repaymentFrequency", label: "Repayment Frequency", disabled: true },
    { key: "emiAmount", label: "EMI Amount", disabled: true },
    { key: "processingFee", label: "Processing Fee (₹)", disabled: true },
    { key: "loginFee", label: "Login Fee (₹)", disabled: true },
    { key: "gstLoginFee", label: "GST on Login Fee (18%)", disabled: true },
    {
      key: "hasInsurance",
      label: "Has Insurance",
      type: "checkbox",
    },
    { key: "insuranceFee", label: "Insurance Fee (₹)", disabled: true },
    {
      key: "purpose",
      label: "Purpose",
      type: "select",
      options: loanPurposes.map((p) => ({
        value: p.id,
        label: p.loan_purpose,
      })),
      resolve: makeResolver(loanPurposes, "id", "loan_purpose"),
    },
    {
      key: "subPurpose",
      label: "Sub-Purpose",
      type: "select",
      options: filteredSubPurposes.map((s) => ({
        value: s.id,
        label: s.loan_sub_purpose,
      })),
      resolve: makeResolver(loanSubPurposes, "id", "loan_sub_purpose"),
      disabled: !editForm.purpose,
    },
  ];

  const fieldOnChange = (key) => {
    if (key === "purpose") return handlePurposeChange;
    if (key === "productType") return handleProductTypeChange;
    if (key === "productName") return handleProductChange;
    if (key === "hasInsurance") return handleHasInsuranceChange;
    return (e) => setEditForm({ ...editForm, [key]: e.target.value });
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-ink-100 shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-ink-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-9 w-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
              <RiFileListLine size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-display font-bold text-ink-900">
                Loan Details
              </h2>
              <p className="text-xs text-ink-400 mt-0.5">
                {isEditing
                  ? "Edit the sanctioned loan details below"
                  : "Verify or edit the sanctioned loan details"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={isSaving}
                  className="text-xs font-semibold text-ink-500 border border-ink-200 px-3 py-1.5 rounded-lg hover:bg-ink-50 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  <RiSaveLine size={13} />
                  {isSaving ? "Saving…" : "Save"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEditClick}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 transition-colors"
              >
                <RiEditLine size={14} />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary-700">
                  <RiProductHuntLine size={16} />
                </span>
                <span className="text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Loan Product
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {productFields.map(
                  ({ key, label, accent, type, options, resolve, disabled }) => {
                    if (isEditing) {
                      if (type === "checkbox") {
                        return (
                          <CheckBox
                            key={key}
                            label={label}
                            checked={editForm[key] === "true"}
                            disabled={isSaving}
                            onChange={fieldOnChange(key)}
                          />
                        );
                      }
                      if (type === "select") {
                        return (
                          <SelectBox
                            key={key}
                            label={label}
                            value={editForm[key]}
                            options={options}
                            disabled={disabled || isSaving}
                            onChange={fieldOnChange(key)}
                          />
                        );
                      }
                      return (
                        <EditBox
                          key={key}
                          label={label}
                          value={editForm[key]}
                          disabled={disabled || isSaving}
                          onChange={fieldOnChange(key)}
                        />
                      );
                    }
                    return (
                      <StatBox
                        key={key}
                        label={label}
                        value={
                          resolve
                            ? resolve(loanProduct[key])
                            : key === "hasInsurance"
                              ? loanProduct[key] === "true"
                                ? "Yes"
                                : "No"
                              : loanProduct[key]
                        }
                        accent={accent}
                      />
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {saveError && (
            <p className="mt-3 text-xs text-rose-600">{saveError}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LoanAnalysis;