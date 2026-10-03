// import React, { useState } from "react";
// import Icon from "../utils/Icon";
// import Modal from "../utils/Modal";
// import TextInput from "../fields/TextInput";
// import Button from "../utils/Button";

// const LoanAnalysis = ({ permission = false }) => {
//   // ---------- Loan Product Details (editable) ----------
//   const [loanProduct, setLoanProduct] = useState({
//     productName: "Home Loan - Fixed Rate",
//     productType: "Home Loan",
//     loanAmount: "₹50,00,000",
//     interestRate: "8.5%",
//     tenure: "20 Years",
//     processingFee: "1%",
//     emiOption: "Fixed EMI",
//     purpose: "Purchase of new house",
//   });

//   // ---------- State for Modals & UI ----------
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   // Editable fields (copied from loanProduct for the edit form)
//   const [editForm, setEditForm] = useState({ ...loanProduct });

//   // ---------- Handlers ----------
//   const handleEditClick = () => {
//     setEditForm({ ...loanProduct });
//     setIsEditModalOpen(true);
//   };

//   const handleEditSave = () => {
//     setLoanProduct({ ...editForm });
//     setIsEditModalOpen(false);
//   };

//   // ---------- Render ----------
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
//             LA-1250
//           </span>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <div className="space-y-4">
//             {/* ---------- LOAN PRODUCT SECTION (with Edit) ---------- */}
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-1.5">
//                   <Icon name="RiProductHuntLine" size={14} color="#8140DC" />
//                   <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
//                     Loan Product
//                   </span>
//                 </div>
//                 {permission && (
//                   <button
//                     onClick={handleEditClick}
//                     className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition cursor-pointer"
//                   >
//                     <Icon name="RiEditLine" size={14} />
//                     Edit
//                   </button>
//                 )}
//               </div>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     Product
//                   </p>
//                   <p className="text-xs font-semibold text-slate-800 truncate">
//                     {loanProduct.productName}
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     Type
//                   </p>
//                   <p className="text-xs font-semibold text-slate-800">
//                     {loanProduct.productType}
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     Amount
//                   </p>
//                   <p className="text-xs font-bold text-primary">
//                     {loanProduct.loanAmount}
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     Interest
//                   </p>
//                   <p className="text-xs font-semibold text-slate-800">
//                     {loanProduct.interestRate}
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     Tenure
//                   </p>
//                   <p className="text-xs font-semibold text-slate-800">
//                     {loanProduct.tenure}
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     Processing Fee
//                   </p>
//                   <p className="text-xs font-semibold text-slate-800">
//                     {loanProduct.processingFee}
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     EMI Option
//                   </p>
//                   <p className="text-xs font-semibold text-slate-800">
//                     {loanProduct.emiOption}
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-md px-2 py-1.5">
//                   <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
//                     Purpose
//                   </p>
//                   <p className="text-xs font-semibold text-slate-800 truncate">
//                     {loanProduct.purpose}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ---------- EDIT PRODUCT MODAL ---------- */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         title="Edit Loan Product"
//         size="md"
//       >
//         <div className="space-y-3">
//           <div className="grid grid-cols-2 gap-2 pt-5">
//             <div>
//               <TextInput
//                 label={"Product Name"}
//                 value={editForm.productName}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, productName: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <TextInput
//                 label={"Product Type"}
//                 value={editForm.productType}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, productType: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <TextInput
//                 label={"Loan Amount"}
//                 value={editForm.loanAmount}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, loanAmount: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <TextInput
//                 label={"Interest Rate"}
//                 value={editForm.interestRate}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, interestRate: e.target.value })
//                 }
//                 readOnly
//               />
//             </div>
//             <div>
//               <TextInput
//                 label={"Tenure"}
//                 value={editForm.tenure}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, tenure: e.target.value })
//                 }
//                 readOnly
//               />
//             </div>
//             <div>
//               <TextInput
//                 label={"Processing Fee"}
//                 value={editForm.processingFee}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, processingFee: e.target.value })
//                 }
//                 readOnly
//               />
//             </div>
//             <div>
//               <TextInput
//                 label={"EMI Option"}
//                 value={editForm.emiOption}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, emiOption: e.target.value })
//                 }
//                 readOnly
//               />
//             </div>
//             <div>
//               <TextInput
//                 label={"Purpose"}
//                 value={editForm.purpose}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, purpose: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
//             <Button
//               style={"border-gray-200"}
//               btnName={"Cancel"}
//               onClick={() => setIsEditModalOpen(false)}
//             />

//             <Button
//               onClick={handleEditSave}
//               btnIcon={"RiSaveLine"}
//               style={"bg-primary text-white"}
//               btnName={"Save Changes"}
//             />
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default LoanAnalysis;

import React, { useMemo, useState } from "react";
import Icon from "../utils/Icon";
import Modal from "../utils/Modal";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";

// Sample master data
const products = [
  {
    value: "home-fixed",
    label: "Home Loan - Fixed Rate",
    productType: "Home Loan",
    purpose: "Purchase of new house",
    amounts: [
      {
        value: "2500000",
        label: "₹25,00,000",
        interestRate: "8.5%",
        tenure: 240, // 20 years
        processingFee: "1%",
        emiOption: "Fixed EMI",
      },
      {
        value: "5000000",
        label: "₹50,00,000",
        interestRate: "8.5%",
        tenure: 240, // 20 years
        processingFee: "1%",
        emiOption: "Fixed EMI",
      },
      {
        value: "7500000",
        label: "₹75,00,000",
        interestRate: "8.75%",
        tenure: 300, // 25 years
        processingFee: "1%",
        emiOption: "Fixed EMI",
      },
    ],
  },
  {
    value: "personal-loan",
    label: "Personal Loan",
    productType: "Personal Loan",
    purpose: "Personal Expenses",
    amounts: [
      {
        value: "100000",
        label: "₹1,00,000",
        interestRate: "12%",
        tenure: 24, // 2 years
        processingFee: "2%",
        emiOption: "Fixed EMI",
      },
      {
        value: "300000",
        label: "₹3,00,000",
        interestRate: "13%",
        tenure: 36, // 3 years
        processingFee: "2%",
        emiOption: "Fixed EMI",
      },
      {
        value: "500000",
        label: "₹5,00,000",
        interestRate: "14%",
        tenure: 60, // 5 years
        processingFee: "2%",
        emiOption: "Fixed EMI",
      },
    ],
  },
  {
    value: "business-loan",
    label: "Business Loan",
    productType: "Business Loan",
    purpose: "Business Expansion",
    amounts: [
      {
        value: "500000",
        label: "₹5,00,000",
        interestRate: "14%",
        tenure: 36, // 3 years
        processingFee: "2%",
        emiOption: "Fixed EMI",
      },
      {
        value: "1000000",
        label: "₹10,00,000",
        interestRate: "15%",
        tenure: 60, // 5 years
        processingFee: "2%",
        emiOption: "Fixed EMI",
      },
    ],
  },
];

const initialLoanProduct = {
  productId: "home-fixed",
  productName: "Home Loan - Fixed Rate",
  productType: "Home Loan",
  loanAmount: "5000000",
  interestRate: "8.5%",
  tenure: 240,
  processingFee: "1%",
  emiOption: "Fixed EMI",
  purpose: "Purchase of new house",
};

const formatAmount = (amount) =>
  amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "-";

const LoanAnalysis = ({ permission = false }) => {
  const [loanProduct, setLoanProduct] = useState(initialLoanProduct);
  const [editForm, setEditForm] = useState(initialLoanProduct);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Selected product details
  const selectedProduct = useMemo(
    () => products.find((product) => product.value === editForm.productId),
    [editForm.productId],
  );

  // Amount options depend on selected product
  const amountOptions = useMemo(
    () =>
      selectedProduct?.amounts.map((amount) => ({
        label: amount.label,
        value: amount.value,
      })) || [],
    [selectedProduct],
  );

  // Open modal with existing details
  const handleEditClick = () => {
    setEditForm({ ...loanProduct });
    setIsEditModalOpen(true);
  };

  // Support SelectInput returning either an event or an option/value
  const getSelectedValue = (selected) => {
    if (selected?.target) return selected.target.value;
    return selected?.value ?? selected ?? "";
  };

  // Product selection: reset amount and dependent details
  const handleProductChange = (selected) => {
    const productId = getSelectedValue(selected);
    const product = products.find((item) => item.value === productId);

    if (!product) return;

    setEditForm((prev) => ({
      ...prev,
      productId: product.value,
      productName: product.label,
      productType: product.productType,
      loanAmount: "",
      interestRate: "",
      tenure: "",
      processingFee: "",
      emiOption: "",
      purpose: product.purpose,
    }));
  };

  // Amount selection: auto-fill remaining details
  const handleAmountChange = (selected) => {
    const loanAmount = getSelectedValue(selected);
    const amountDetails = selectedProduct?.amounts.find(
      (amount) => amount.value === String(loanAmount),
    );

    if (!amountDetails) return;

    setEditForm((prev) => ({
      ...prev,
      loanAmount: amountDetails.value,
      interestRate: amountDetails.interestRate,
      tenure: amountDetails.tenure,
      processingFee: amountDetails.processingFee,
      emiOption: amountDetails.emiOption,
      purpose: selectedProduct.purpose,
      productType: selectedProduct.productType,
      productName: selectedProduct.label,
    }));
  };

  const handleEditSave = () => {
    if (!editForm.productId || !editForm.loanAmount) return;

    setLoanProduct({ ...editForm });
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Icon name="RiFileListLine" size={16} color="#8140DC" />
            </div>

            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                Loan Details
              </h2>
              <p className="text-[10px] text-slate-500">
                Verify or Edit Loan Details
              </p>
            </div>
          </div>

          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            LA-1250
          </span>
        </div>

        {/* Loan Details */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Icon name="RiProductHuntLine" size={14} color="#8140DC" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Loan Product
              </span>
            </div>

            {permission && (
              <button
                type="button"
                onClick={handleEditClick}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition cursor-pointer"
              >
                <Icon name="RiEditLine" size={14} />
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                label: "Product",
                value: loanProduct.productName,
              },
              {
                label: "Type",
                value: loanProduct.productType,
              },
              {
                label: "Amount",
                value: formatAmount(loanProduct.loanAmount),
                highlight: true,
              },
              {
                label: "Interest",
                value: loanProduct.interestRate,
              },
              {
                label: "Tenure",
                value: loanProduct.tenure
                  ? `${loanProduct.tenure} Months`
                  : "-",
              },
              {
                label: "Processing Fee",
                value: loanProduct.processingFee,
              },
              {
                label: "EMI Option",
                value: loanProduct.emiOption,
              },
              {
                label: "Purpose",
                value: loanProduct.purpose,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-slate-50 rounded-md px-2 py-1.5 min-w-0"
              >
                <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
                  {item.label}
                </p>
                <p
                  className={`text-xs font-semibold truncate ${
                    item.highlight ? "text-primary" : "text-slate-800"
                  }`}
                  title={item.value}
                >
                  {item.value || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Loan Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Loan Product"
        size="md"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 pt-5">
            {/* Product Selection */}
            <div className="">
              <SelectInput
                placeholder={"Select product"}
                label="Product Name"
                options={products.map((product) => ({
                  label: product.label,
                  value: product.value,
                }))}
                value={editForm.productId}
                onChange={handleProductChange}
              />
            </div>

            {/* Loan Amount Selection */}
            <div className="">
              <SelectInput
                placeholder={"Select Amount"}
                label="Loan Amount"
                options={amountOptions}
                value={editForm.loanAmount}
                onChange={handleAmountChange}
                disabled={!editForm.productId}
              />
              {!editForm.loanAmount && (
                <p className="text-[10px] text-slate-500 mt-1">
                  Select a loan amount to fill in the loan details.
                </p>
              )}
            </div>

            {/* Auto-filled details */}
            <TextInput
              label="Product Type"
              value={editForm.productType}
              readOnly
            />

            <TextInput
              label="Interest Rate"
              value={editForm.interestRate}
              readOnly
            />

            <TextInput
              label="Tenure (Months)"
              value={editForm.tenure ? String(editForm.tenure) : ""}
              readOnly
            />

            <TextInput
              label="Processing Fee"
              value={editForm.processingFee}
              readOnly
            />

            <TextInput label="EMI Option" value={editForm.emiOption} readOnly />

            {/* <div className="col-span-2">
              <TextInput
                label="Purpose"
                value={editForm.purpose}
                readOnly
              />
            </div> */}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              style="border-gray-200"
              btnName="Cancel"
              onClick={() => setIsEditModalOpen(false)}
            />

            <Button
              onClick={handleEditSave}
              btnIcon="RiSaveLine"
              style="bg-primary text-white"
              btnName="Save Changes"
              disabled={!editForm.productId || !editForm.loanAmount}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoanAnalysis;
