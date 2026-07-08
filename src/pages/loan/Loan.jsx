import React, { useState } from "react";
import {
  RiUser3Line,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiBankCardLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiCalendarLine,
  RiAlertLine,
  RiShieldCheckLine,
  RiVideoChatLine,
  RiDownloadLine,
  RiExternalLinkLine,
  RiFilePdfLine,
  RiFileImageLine,
  RiFileTextLine,
  RiEyeLine,
  RiIdCardLine,
  RiTimeLine,
  RiSendPlaneLine,
  RiUploadCloud2Line,
  RiBuildingLine,
  RiBriefcaseLine,
  RiHeartPulseLine,
  RiInformationLine,
  RiPieChartLine,
  RiMoneyDollarCircleFill,
  RiSecurePaymentLine,
  RiBankLine,
} from "react-icons/ri";
import Icon from "../../components/utils/Icon";

// ============ LOAN INFO COMPONENT ============
const LoanInfo = ({ loanData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loanDetails = {
    loanId: loanData?.loanId || "L-2024-001234",
    applicationDate: loanData?.applicationDate || "2024-01-15",
    loanAmount: loanData?.loanAmount || 500000,
    interestRate: loanData?.interestRate || 8.5,
    tenure: loanData?.tenure || 60,
    monthlyEMI: loanData?.monthlyEMI || 10256,
    totalInterest: loanData?.totalInterest || 115360,
    totalPayable: loanData?.totalPayable || 615360,
    purpose: loanData?.purpose || "Home Renovation",
    status: loanData?.status || "Pending",
    disbursementDate: loanData?.disbursementDate || null,
    nextPaymentDate: loanData?.nextPaymentDate || "2024-02-01",
    remainingAmount: loanData?.remainingAmount || 410240,
    overdueDays: loanData?.overdueDays || 0,
    coApplicant: loanData?.coApplicant || {
      name: "Priya Sharma",
      relationship: "Spouse",
      pan: "ABCDE1234F",
    },
    emiDetails: {
      startDate: "2024-02-01",
      endDate: "2029-01-01",
      totalEMIs: 60,
      paidEMIs: 0,
      pendingEMIs: 60,
      nextEMIDate: "2024-02-01",
      nextEMIAmount: 10256,
    }
  };

  return (
    <div className="space-y-4">
      {/* Loan Summary Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
          <p className="text-xs opacity-90">Loan Amount</p>
          <p className="text-xl font-bold">{formatCurrency(loanDetails.loanAmount)}</p>
          <p className="text-xs opacity-75 mt-1">Tenure: {loanDetails.tenure} months</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-white">
          <p className="text-xs opacity-90">Monthly EMI</p>
          <p className="text-xl font-bold">{formatCurrency(loanDetails.monthlyEMI)}</p>
          <p className="text-xs opacity-75 mt-1">Rate: {loanDetails.interestRate}%</p>
        </div>
      </div>

      {/* Loan Details Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Lead ID</p>
          <p className="text-sm font-semibold text-gray-800 font-mono">{loanDetails.loanId}</p>
        </div>
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Purpose</p>
          <p className="text-sm font-semibold text-gray-800">{loanDetails.purpose}</p>
        </div>
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Application Date</p>
          <p className="text-sm font-semibold text-gray-800">{formatDate(loanDetails.applicationDate)}</p>
        </div>
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Total Interest</p>
          <p className="text-sm font-semibold text-gray-800">{formatCurrency(loanDetails.totalInterest)}</p>
        </div>
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Total Payable</p>
          <p className="text-sm font-semibold text-gray-800">{formatCurrency(loanDetails.totalPayable)}</p>
        </div>
        {/* {loanDetails.disbursementDate && (
          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500">Disbursement Date</p>
            <p className="text-sm font-semibold text-gray-800">{formatDate(loanDetails.disbursementDate)}</p>
          </div>
        )}
        {loanDetails.nextPaymentDate && (
          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500">Next Payment Due</p>
            <p className="text-sm font-semibold text-orange-600">{formatDate(loanDetails.nextPaymentDate)}</p>
          </div>
        )}
        {loanDetails.remainingAmount && (
          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500">Remaining Amount</p>
            <p className="text-sm font-semibold text-gray-800">{formatCurrency(loanDetails.remainingAmount)}</p>
          </div>
        )}
        {loanDetails.overdueDays > 0 && (
          <div className="px-4 py-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600">Overdue Days</p>
            <p className="text-sm font-bold text-red-600">{loanDetails.overdueDays} days</p>
          </div>
        )} */}
      </div>

      {/* EMI Schedule */}
      {/* <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">EMI Schedule</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-500">Start Date</p>
            <p className="text-sm font-semibold text-gray-800">{formatDate(loanDetails.emiDetails.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">End Date</p>
            <p className="text-sm font-semibold text-gray-800">{formatDate(loanDetails.emiDetails.endDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total EMIs</p>
            <p className="text-sm font-semibold text-gray-800">{loanDetails.emiDetails.totalEMIs}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Paid EMIs</p>
            <p className="text-sm font-semibold text-green-600">{loanDetails.emiDetails.paidEMIs}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending EMIs</p>
            <p className="text-sm font-semibold text-orange-600">{loanDetails.emiDetails.pendingEMIs}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Next EMI</p>
            <p className="text-sm font-semibold text-gray-800">{formatCurrency(loanDetails.emiDetails.nextEMIAmount)}</p>
          </div>
        </div>


        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>EMI Progress</span>
            <span>{((loanDetails.emiDetails.paidEMIs / loanDetails.emiDetails.totalEMIs) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(loanDetails.emiDetails.paidEMIs / loanDetails.emiDetails.totalEMIs) * 100}%` }}
            />
          </div>
        </div>
      </div> */}

      {/* Quick Actions */}
      {/* <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
          <RiDownloadLine size={16} />
          Download Sanction Letter
        </button>
        <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
          <RiExternalLinkLine size={16} />
          View Full Details
        </button>
      </div> */}
    </div>
  );
};

// ============ DOCUMENTS LIST COMPONENT ============
const DocumentsList = () => {
  const documents = [
    {
      id: 1,
      name: "Identity Proof (PAN Card)",
      type: "PDF",
      size: "2.4 MB",
      uploadedOn: "2024-01-16",
      status: "Uploaded",
    },
    {
      id: 2,
      name: "Address Proof",
      type: "JPG",
      size: "1.8 MB",
      uploadedOn: "2024-01-16",
      status: "Uploaded",
    },
    {
      id: 3,
      name: "Income Proof",
      type: "PDF",
      size: "3.2 MB",
      uploadedOn: "2024-01-17",
      status: "Pending",
    },
    {
      id: 4,
      name: "Bank Statement",
      type: "PDF",
      size: "5.1 MB",
      uploadedOn: "2024-01-18",
      status: "Uploaded",
    },
  ];

  const getFileIcon = (type) => {
    if (type === "PDF") return <RiFilePdfLine className="text-red-500" size={24} />;
    if (type === "JPG" || type === "PNG") return <RiFileImageLine className="text-green-500" size={24} />;
    return <RiFileTextLine className="text-blue-500" size={24} />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-800">Uploaded Documents</h4>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          <RiUploadCloud2Line size={16} />
          Upload
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(doc.type)}
              <div>
                <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                <p className="text-xs text-gray-500">
                  {doc.type} • {doc.size} • Uploaded: {doc.uploadedOn}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <RiEyeLine size={16} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <RiDownloadLine size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ CREDIT INFO COMPONENT ============
const CreditInfo = ({ userInfo }) => {
  const creditData = {
    score: userInfo.creditScore || 765,
    totalAccounts: 8,
    activeAccounts: 4,
    creditUtilization: 32,
    paymentHistory: "100%",
    totalOutstanding: 450000,
  };

  const getScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 750) return "bg-green-100";
    if (score >= 650) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-4">
      {/* Credit Score - Main Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Credit Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(creditData.score)}`}>
              {creditData.score}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className={`font-semibold ${getScoreColor(creditData.score)}`}>
                {getScoreLabel(creditData.score)}
              </span>
            </p>
          </div>
          <div className={`w-20 h-20 rounded-full ${getScoreBg(creditData.score)} flex items-center justify-center`}>
            <RiBankCardLine className={`text-3xl ${getScoreColor(creditData.score)}`} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500">Total Accounts</p>
          <p className="text-xl font-semibold text-gray-800">{creditData.totalAccounts}</p>
          <p className="text-xs text-gray-400">
            Active: {creditData.activeAccounts}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500">Credit Utilization</p>
          <p className="text-xl font-semibold text-gray-800">{creditData.creditUtilization}%</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                creditData.creditUtilization < 30 ? "bg-green-500" : "bg-yellow-500"
              }`}
              style={{ width: `${creditData.creditUtilization}%` }}
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500">Payment History</p>
          <p className="text-xl font-semibold text-green-600">{creditData.paymentHistory}</p>
          <p className="text-xs text-gray-400">On-time payments</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500">Total Outstanding</p>
          <p className="text-xl font-semibold text-gray-800">
            ₹{(creditData.totalOutstanding / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-gray-400">Across all accounts</p>
        </div>
      </div>
    </div>
  );
};

// ============ KYC INFO COMPONENT ============
const KYCInfo = ({ userInfo }) => {
  const kycData = [
    {
      label: "PAN Card",
      value: userInfo.pan || "ABCDE1234F",
      status: "Verified",
      icon: RiIdCardLine,
    },
    {
      label: "Aadhar Card",
      value: userInfo.aadhar || "XXXX-XXXX-XXXX-1234",
      status: "Verified",
      icon: RiIdCardLine,
    },
    {
      label: "Address Proof",
      value: "Electricity Bill",
      status: "Verified",
      icon: RiMapPinLine,
    },
    {
      label: "Photo ID",
      value: "Passport Size Photo",
      status: "Pending",
      icon: RiUser3Line,
    },
    {
      label: "Signature",
      value: "Digital Signature",
      status: "Pending",
      icon: RiFileTextLine,
    },
  ];

  const getStatusColor = (status) => {
    return status === "Verified" 
      ? "text-green-600 bg-green-50 border-green-200" 
      : "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const getStatusIcon = (status) => {
    return status === "Verified" ? RiCalendarLine : RiCalendarLine;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {kycData.map((item, index) => {
          const StatusIcon = getStatusIcon(item.status);
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Icon className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500 font-mono">{item.value}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                <StatusIcon size={14} />
                <span className="text-xs font-medium">{item.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KYC Summary */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
        <div className="flex items-start gap-3">
          <RiShieldCheckLine className="text-blue-600 text-xl mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-800">KYC Status</h4>
            <p className="text-sm text-gray-600 mt-1">
              {kycData.filter(d => d.status === "Verified").length} of {kycData.length} documents Verified
            </p>
            <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${(kycData.filter(d => d.status === "Verified").length / kycData.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ VIDEO KYC COMPONENT ============
const VideoKYC = () => {
  const [videoKycStatus, setVideoKycStatus] = useState("pending");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [videoLink, setVideoLink] = useState("");

  const handleSendLink = () => {
    if (videoLink) {
      setVideoKycStatus("link_sent");
      setShowLinkInput(false);
      alert(`Video KYC link sent to customer: ${videoLink}`);
      setVideoLink("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {videoKycStatus === "completed" && (
          <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1">
            <RiCalendarLine size={16} />
            Completed
          </span>
        )}
        {videoKycStatus === "link_sent" && (
          <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1">
            <RiSendPlaneLine size={16} />
            Link Sent
          </span>
        )}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
        <div className="flex items-center gap-2">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
            <RiVideoChatLine className="text-purple-600 text-2xl" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Video KYC Status</p>
            <p className="text-lg font-semibold text-gray-800">
              {videoKycStatus === "pending" && "Pending"}
              {videoKycStatus === "link_sent" && "Link Sent to Customer"}
              {videoKycStatus === "completed" && "Completed"}
            </p>
            {videoKycStatus === "pending" && (
              <p className="text-xs text-gray-500 mt-1">
                Send video KYC link to customer for verification
              </p>
            )}
            {videoKycStatus === "link_sent" && (
              <p className="text-xs text-blue-600 mt-1">
                Customer has been notified. Awaiting completion.
              </p>
            )}
          </div>
        </div>
      </div>

      {videoKycStatus === "pending" && (
        <div className="space-y-3">
          {!showLinkInput ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowLinkInput(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RiSendPlaneLine size={18} />
                Send Video KYC Link
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RiUploadCloud2Line size={18} />
                Upload Recorded Video
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Enter Video KYC Link
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://meet.example.com/kyc-session"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendLink}
                  disabled={!videoLink}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
                <button
                  onClick={() => {
                    setShowLinkInput(false);
                    setVideoLink("");
                  }}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This link will be sent to the customer for video KYC verification
              </p>
            </div>
          )}
        </div>
      )}

      {videoKycStatus === "link_sent" && (
        <div className="flex gap-3">
          <button
            onClick={() => setVideoKycStatus("completed")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RiCalendarLine size={18} />
            Mark as Completed
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RiSendPlaneLine size={18} />
            Resend Link
          </button>
        </div>
      )}
    </div>
  );
};

// ============ BANK INFO COMPONENT ============
const BankInfo = () => {
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
      <p className="font-semibold">Bank #1</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-gray-500">Name</p>
          <p className="text-sm font-semibold text-gray-800 mt-1 font-mono">{bankData.accountHolderName}</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-gray-500">Bank Account</p>
          <p className="text-sm font-semibold text-gray-800 mt-1 font-mono">{bankData.bankName}</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-gray-500">Account Number</p>
          <p className="text-sm font-semibold text-gray-800 mt-1 font-mono">{bankData.accountNumber}</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-gray-500">Account Type</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{bankData.accountType}</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-gray-500">IFSC Code</p>
          <p className="text-sm font-semibold text-gray-800 mt-1 font-mono">{bankData.ifscCode}</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-gray-500">UPI ID</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{bankData.upiId}</p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <RiSecurePaymentLine className="text-blue-600 text-xl mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Bank Verification Status</h4>
            <p className="text-sm text-gray-600 mt-1">
              Bank account has been verified successfully
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                ✓ Verified
              </span>
              <span className="text-xs text-gray-500">
                Last verified: 2024-01-20
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ EMPLOYMENT & INCOME SECTION ============
const EmploymentInfo = ({ userInfo }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <RiBriefcaseLine className="text-blue-600" size={18} />
            <p className="text-xs text-gray-500">Employment Type</p>
          </div>
          <p className="text-sm font-semibold text-gray-800">{userInfo.employmentType || "Salaried"}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <RiBuildingLine className="text-blue-600" size={18} />
            <p className="text-xs text-gray-500">Annual Income</p>
          </div>
          <p className="text-sm font-semibold text-gray-800">
            ₹{(userInfo.annualIncome || 1200000).toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <RiBankCardLine className="text-blue-600" size={18} />
            <p className="text-xs text-gray-500">Bank Name</p>
          </div>
          <p className="text-sm font-semibold text-gray-800">HDFC Bank</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <RiHeartPulseLine className="text-blue-600" size={18} />
            <p className="text-xs text-gray-500">CIBIL Score</p>
          </div>
          <p className="text-sm font-semibold text-gray-800">{userInfo.creditScore || 765}</p>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN LOAN APPROVAL PAGE ============
const Loan = ({ loanData, userData, onAction }) => {
  const [activeSection, setActiveSection] = useState("personal");

  // Mock data
  const mockLoanData = {
    loanId: "L-2024-001234",
    applicationDate: "2024-01-15",
    loanAmount: 500000,
    interestRate: 8.5,
    tenure: 60,
    monthlyEMI: 10256,
    totalInterest: 115360,
    totalPayable: 615360,
    purpose: "Home Renovation",
    status: "Pending",
    disbursementDate: null,
    nextPaymentDate: "2024-02-01",
    remainingAmount: 410240,
    overdueDays: 0,
    coApplicant: {
      name: "Priya Sharma",
      relationship: "Spouse",
      pan: "ABCDE1234F",
    },
  };

  const mockUserData = {
    name: "Rahul Kumar",
    email: "rahul.kumar@email.com",
    phone: "+91 98765 43210",
    address: "123, Green Valley Apartments, Electronic City, Bangalore - 560100",
    pan: "ABCDE1234F",
    aadhar: "XXXX-XXXX-XXXX-1234",
    dateOfBirth: "15 May 1990",
    employmentType: "Salaried",
    annualIncome: 1200000,
    creditScore: 765,
  };

  const loanInfo = loanData || mockLoanData;
  const userInfo = userData || mockUserData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sections = [
    { id: "personal", label: "Personal Info", icon: RiUser3Line },
    { id: "employment", label: "Employment & Income", icon: RiBriefcaseLine },
    { id: "loanInfo", label: "Loan Info", icon: RiInformationLine },
    { id: "documents", label: "Documents", icon: RiFileList3Line },
    { id: "kyc", label: "KYC Details", icon: RiShieldCheckLine },
    { id: "credit", label: "Credit Info", icon: RiBankCardLine },
    { id: "videoKyc", label: "Video KYC", icon: RiVideoChatLine },
    { id: "bankInfo", label: "Bank Info", icon: RiBankLine },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "loanInfo":
        return <LoanInfo loanData={loanInfo} />;
      case "personal":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Full Name</label>
                <p className="text-sm font-medium text-gray-800">{userInfo.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date of Birth</label>
                <p className="text-sm font-medium text-gray-800">{userInfo.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Email Address</label>
                <p className="text-sm font-medium text-gray-800">{userInfo.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone Number</label>
                <p className="text-sm font-medium text-gray-800">{userInfo.phone}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500">Residential Address</label>
                <p className="text-sm font-medium text-gray-800">{userInfo.address}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">PAN Card</label>
                <p className="text-sm font-medium text-gray-800 font-mono">{userInfo.pan}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Aadhar Number</label>
                <p className="text-sm font-medium text-gray-800 font-mono">{userInfo.aadhar}</p>
              </div>
            </div>
          </div>
        );
      case "employment":
        return <EmploymentInfo userInfo={userInfo} />;
      case "documents":
        return <DocumentsList />;
      case "kyc":
        return <KYCInfo userInfo={userInfo} />;
      case "credit":
        return <CreditInfo userInfo={userInfo} />;
      case "videoKyc":
        return <VideoKYC />;
      case "bankInfo":
        return <BankInfo />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Loan Information</h1>
            <p className="text-gray-500 text-sm mt-1">Review application details before approval</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
              Status: Pending Review
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500">Application ID</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{loanInfo.loanId}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500">Loan Amount</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{formatCurrency(loanInfo.loanAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500">Tenure</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{loanInfo.tenure} months</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500">Application Date</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{formatDate(loanInfo.applicationDate)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</p>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon className={isActive ? "text-blue-600" : "text-gray-400"} size={18} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              <span className="text-xs text-gray-400">
                Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
              </span>
            </div>
            {renderSection()}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-3">
              <button className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                Reject Application
              </button>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Request More Info
              </button>
              <button 
                onClick={() => onAction?.("approve")}
                className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <RiCalendarLine size={18} />
                Approve Loan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loan;