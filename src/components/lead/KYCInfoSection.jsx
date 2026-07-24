import Icon from "../utils/Icon";

const KYCInfoSection = ({ userInfo }) => {
  const kycData = [
    {
      label: "PAN Card",
      value: userInfo.pan || "ABCDE1234F",
      status: "Verified",
      icon: "RiIdCardLine",
    },
    {
      label: "Aadhar Card",
      value: userInfo.aadhar || "XXXX-XXXX-XXXX-1234",
      status: "Verified",
      icon: "RiIdCardLine",
    },
    {
      label: "Address Proof",
      value: "Electricity Bill",
      status: "Verified",
      icon: "RiMapPinLine",
    },
    {
      label: "Photo ID",
      value: "Passport Size Photo",
      status: "Pending",
      icon: "RiUser3Line",
    },
    {
      label: "Signature",
      value: "Digital Signature",
      status: "Pending",
      icon: "RiFileTextLine",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {kycData.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name={"RiIdCardLine"} color="blue" size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">{item.label}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{item.value}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                item.status === "Verified" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* KYC Summary */}
      <div className="p-3 bg-primary/5 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="RiShieldCheckLine" color="blue" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-800">KYC Status</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              {kycData.filter(d => d.status === "Verified").length} of {kycData.length} documents Verified
            </p>
            <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-primary/90 h-1.5 rounded-full"
                style={{ width: `${(kycData.filter(d => d.status === "Verified").length / kycData.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCInfoSection;