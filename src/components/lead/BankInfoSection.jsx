import Icon from "../utils/Icon";

const BankInfoSection = () => {
  const bankData = {
    accountHolderName: "Rahul Kumar",
    accountNumber: "XXXX-XXXX-XXXX-1234",
    accountType: "Savings",
    bankName: "HDFC Bank",
    branchName: "Electronic City Branch",
    ifscCode: "HDFC0001234",
    upiId: "rahul.kumar@hdfc",
    averageBalance: 75000,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Name</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5 font-mono truncate">{bankData.accountHolderName}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bank</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{bankData.bankName}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Account</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5 font-mono">{bankData.accountNumber}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">IFSC</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5 font-mono">{bankData.ifscCode}</p>
        </div>
      </div>

      <div className="p-3 bg-primary/5 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="RiSecurePaymentLine" color="blue" />
          <div>
            <h4 className="text-xs font-semibold text-gray-800">Bank Verification Status</h4>
            <p className="text-xs text-gray-600 mt-0.5">Bank account has been verified successfully</p>
            <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium inline-block mt-1">
              ✓ Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankInfoSection;