import Icon from "../utils/Icon";

const BankInfoSection = ({ bankData, isVerified }) => {
  const readableValue = (value) =>
    value ? value : "-";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Name</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{readableValue(bankData?.account_holder_name)}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bank</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{readableValue(bankData?.bank_name)}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Account</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5">{readableValue(bankData?.account_number)}</p>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">IFSC</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5">{readableValue(bankData?.ifsc_code)}</p>
        </div>
      </div>

      <div className="p-3 bg-primary/5 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="RiSecurePaymentLine" color="#5050b8" />
          <div>
            <h4 className="text-xs font-semibold text-gray-800">Bank Verification Status</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              {isVerified ? "Bank details have been submitted." : "Bank details are pending."}
            </p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${isVerified ? "text-green-600 bg-green-100" : "text-amber-700 bg-amber-100"}`}>
              {isVerified ? "Submitted" : "Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankInfoSection;