import React from 'react';
import TextInput from '../../components/fields/TextInput';
import SelectInput from '../../components/fields/SelectInput';
import DateInput from '../../components/fields/DateInput';
import Button from '../../components/utils/Button';

// --- SHARED FORM INPUTS (Kept for lower sections) ---
const InputField = ({ label, type = "text", placeholder = "", value, required = false, className = "" }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
            <label className="text-xs font-semibold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        {type === "select" ? (
            <select className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">{placeholder}</option>
                <option value="1">Option 1</option>
            </select>
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                readOnly={!!value}
            />
        )}
    </div>
);

const LoanInfoRow = ({ label, value, isHighlighted = false, isLink = false }) => (
    <div className="flex border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
        <div className="w-1/3 min-w-30 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-500 font-medium border-r border-gray-100">
            {label}
        </div>
        <div className="w-2/3 px-4 py-2.5 text-sm font-medium text-gray-800 flex items-center">
            {isLink ? (
                <a href="#" className="text-blue-600 hover:underline">{value}</a>
            ) : (
                <span className={isHighlighted ? "text-red-600 font-bold" : ""}>{value}</span>
            )}
        </div>
    </div>
);

// --- MAIN COMPACT DASHBOARD ---
const CompactLoanDashboard = () => {
    return (
        <>
            {/* header  */}
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">

                <div>
                    <h2 className="text-xl font-semibold">
                        EMI Details
                    </h2>

                    <p className="text-sm text-gray-500">
                        View and manage customer's EMI
                    </p>
                </div>

            </div>

            <div className="min-h-screen bg-gray-100 px-4 pb-4 rounded-md font-sans text-gray-700 flex justify-center">


                <div className="w-full max-w-7xl space-y-5">

                    {/* 1. LOAN INFO SECTION (EXACTLY LIKE IMAGE) */}
                    <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-2 border-b border-gray-200 bg-gray-50/60">
                            <h3 className="text-sm font-bold text-gray-700">Loan Info</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-100">
                            {/* Column 1 */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                <LoanInfoRow label="Loan ID" value="113560" />
                                <LoanInfoRow label="Loan Date" value="18/03/2025" />
                                {/* <LoanInfoRow label="Member Code" value="B000007" isHighlighted={true} /> */}
                                <LoanInfoRow label="Scheme Code" value="0009" />
                                <LoanInfoRow label="Loan Amount" value="100000 Rs" />
                                <LoanInfoRow label="Grace Period" value="0 days" />
                                <LoanInfoRow label="Loan Type" value="Business Loan" isLink={true} />
                            </div>

                            {/* Column 2 */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                <LoanInfoRow label="Mode" value="MLY" />
                                <LoanInfoRow label="ROI" value="0.3%" />
                                <LoanInfoRow label="EMI" value="9748.71" isHighlighted={true} />
                                <LoanInfoRow label="Term" value="12" />
                                <LoanInfoRow label="NetPay" value="94960" />
                                <LoanInfoRow label="Fine" value="0%" />
                            </div>

                            {/* Column 3 */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                <LoanInfoRow label="Applicant" value="VINOD KUMAR RAI" />
                                <LoanInfoRow label="Scheme" value="Unsecured Business Loan (MSME-Udyam Scheme)" />
                                <LoanInfoRow label="Age" value="0" />
                                <LoanInfoRow label="Phone" value="9305551626" />
                                <LoanInfoRow label="EMI Date" value="05/05/2025" />
                                {/* <LoanInfoRow label="Collector" value="" /> */}
                            </div>
                        </div>
                    </section>

                    {/* 2. FINANCIALS & TOTALS (Compact 2-Column Layout) */}
                    <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-300">
                            <h3 className="text-xs font-bold text-black uppercase tracking-wider">Financial Summary & Inputs</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Totals */}
                            <div className="grid grid-cols-2 gap-3">
                                <TextInput label='Total Payable' placeholder={'e.g. 11698.55'} />
                                <TextInput label={'Total Paid'} placeholder={'e.g. 87738.41'} />
                                <TextInput label="Due Amt" placeholder="e.g. 29246.14" />
                                <TextInput label="Payment No" placeholder="e.g. 10" />
                                <TextInput label="Previous Advance" placeholder="e.g. 0" />
                                <TextInput label="Advance Amt" placeholder="e.g. 0" style="[&_input]:text-red-600 [&_input]:font-semibold" />
                            </div>

                            {/* Right Column: Payment Action Inputs */}
                            <div className="space-y-3 border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-6 pt-3 md:pt-0">
                                <div className="grid grid-cols-2 gap-3">
                                    <TextInput label="Calculate Latefine" type="select" placeholder="e.g. Yes" />
                                    <TextInput label="Total Amount" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <TextInput label="Payment Amt" placeholder="e.g. Enter Amount" />
                                    <DateInput label="Payment Date" placeholder="e.g. 08/07/2026" /> 
                                </div>
                                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
                                    <Button style="px-4 py-1.5 rounded border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors shadow-sm">
                                        Revert EMI
                                    </Button>
                                    <Button style="px-4 py-1.5 rounded border border-green-500 text-green-700 text-xs font-medium hover:bg-green-50 transition-colors shadow-sm">
                                        Print Last Receipt
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. PAYMENT DETAILS & REMARKS */}
                    <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <div className="mb-3 pb-2 border-b border-gray-200">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payment Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SelectInput label="Branch" type="select" placeholder="--Select Branch--" required
                                options={[{
                                    label: 'Option 1', value: 'Option 1'
                                }]}
                            />
                            <SelectInput label="Pay Mode" type="select" placeholder="--Select PayMode--" required />
                            <div className="flex items-end pb-0.5">
                                <TextInput label="Remarks" placeholder="Enter remarks here..." />
                            </div>
                        </div>
                    </section>

                    {/* 4. EMI TABLES (Paid vs New) */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        {/* Table 1: Paid EMIs */}
                        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-5 py-2 border-b border-slate-300 flex justify-between items-center">
                                <h3 className="text-xs font-bold text-black uppercase tracking-wider">Paid EMIs</h3>
                                <span className="text-[10px] text-slate-900 bg-slate-700/20 px-2 py-0.5 rounded-full">9 Records</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2.5 font-semibold">No.</th>
                                            <th className="px-4 py-2.5 font-semibold">Due Date</th>
                                            <th className="px-4 py-2.5 font-semibold">Pay Date</th>
                                            <th className="px-4 py-2.5 font-semibold text-right">Amount</th>
                                            <th className="px-4 py-2.5 font-semibold text-right">Fine</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <tr key={num} className="hover:bg-blue-50/40 transition-colors">
                                                <td className="px-4 py-2">{num}</td>
                                                <td className="px-4 py-2">05/0{num}/2025</td>
                                                <td className="px-4 py-2">09/0{num}/2025</td>
                                                <td className="px-4 py-2 text-right font-medium tabular-nums">9,748.71</td>
                                                <td className="px-4 py-2 text-right tabular-nums">0</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Table 2: New EMIs */}
                        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-5 py-2 border-b border-slate-300 flex justify-between items-center">
                                <h3 className="text-xs font-bold text-black uppercase tracking-wider">New EMIs</h3>
                                <span className="text-[10px] text-slate-900 bg-slate-700/20 px-2 py-0.5 rounded-full">3 Pending</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                                        <tr>
                                            <th className="px-3 py-2.5 font-semibold text-center w-8">#</th>
                                            <th className="px-4 py-2.5 font-semibold">EMI No</th>
                                            <th className="px-4 py-2.5 font-semibold">Due Date</th>
                                            <th className="px-4 py-2.5 font-semibold text-right">EMI Amount</th>
                                            <th className="px-3 py-2.5 font-semibold text-center w-10">Fine</th>
                                            <th className="px-4 py-2.5 font-semibold text-right">Fine Amt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[10, 11, 12].map((num, idx) => (
                                            <tr key={num} className="hover:bg-blue-50/40 transition-colors">
                                                <td className="px-3 py-2 text-center">
                                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" defaultChecked={idx === 0} />
                                                </td>
                                                <td className="px-4 py-2 font-medium">{num}</td>
                                                <td className="px-4 py-2">05/0{idx + 2}/2026</td>
                                                <td className="px-4 py-2 text-right font-medium tabular-nums">9,748.71</td>
                                                <td className="px-3 py-2 text-center">
                                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                                </td>
                                                <td className="px-4 py-2 text-right tabular-nums">0</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </>);
};

export default CompactLoanDashboard;